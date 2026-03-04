#!/usr/bin/env python3
"""Export v2-boceto deck to PPTX via Anthropic code execution API (batched).

Splits slides into batches to avoid token limits. Uses container reuse
so Claude builds incrementally on the same PPTX file across API calls.

Usage:
    ANTHROPIC_API_KEY=sk-... python3 showcase/scripts/export-pptx.py
    ANTHROPIC_API_KEY=sk-... python3 showcase/scripts/export-pptx.py --dark
    ANTHROPIC_API_KEY=sk-... python3 showcase/scripts/export-pptx.py --batch-size 20 --output out.pptx
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path

import anthropic

# ─── Config ───────────────────────────────────────────────────────────────────

SLIDES_DIR = Path(__file__).resolve().parent.parent / "src/content/slides/v2-boceto"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "exports"
DEFAULT_OUTPUT = OUTPUT_DIR / "v2-boceto.pptx"
MODEL = "claude-haiku-4-5"
TOOL = {"type": "code_execution_20250825", "name": "code_execution"}
MAX_TOKENS = 64000
MAX_CONTINUATIONS = 10


# ─── MDX Parsing ──────────────────────────────────────────────────────────────


def parse_frontmatter(text: str) -> dict:
    """Extract YAML frontmatter from MDX."""
    m = re.match(r"^---\n(.*?)\n---", text, re.DOTALL)
    if not m:
        return {}
    fm = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            key, val = line.split(":", 1)
            val = val.strip().strip('"').strip("'")
            if val == "true":
                val = True
            elif val == "false":
                val = False
            else:
                try:
                    val = float(val) if "." in val else int(val)
                except ValueError:
                    pass
            fm[key.strip()] = val
    return fm


def strip_html(text: str) -> str:
    """Remove HTML/JSX tags, preserve text structure."""
    text = re.sub(r"<br\s*/?>", "\n", text)
    text = re.sub(r"<strong[^>]*>(.*?)</strong>", r"**\1**", text, flags=re.DOTALL)
    text = re.sub(r"<li[^>]*>(.*?)</li>", r"- \1\n", text, flags=re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n ", "\n", text)
    return text.strip()


def extract_content_slide(text: str) -> str:
    """Extract text from a regular content/cover/custom slide."""
    body = re.sub(r"^---\n.*?\n---\n?", "", text, flags=re.DOTALL)
    body = re.sub(r"^import\s+.*$", "", body, flags=re.MULTILINE)
    return strip_html(body)


def extract_case_study(text: str) -> str:
    """Extract structured content from CaseStudy component."""
    parts = []

    for prop in ["title", "dominio", "dolor", "necesidad", "rolDesc"]:
        m = re.search(rf'{prop}="([^"]*)"', text)
        if m:
            parts.append(f"{prop}: {strip_html(m.group(1))}")

    # contexto may use single quotes (contains HTML)
    m = re.search(r"contexto='(.*?)'", text, re.DOTALL) or re.search(
        r'contexto="(.*?)"', text, re.DOTALL
    )
    if m:
        parts.append(f"Context: {strip_html(m.group(1))}")

    # roles array
    m = re.search(r"roles=\{\[(.*?)\]\}", text, re.DOTALL)
    if m:
        roles = re.findall(r'"([^"]+)"', m.group(1))
        parts.append(f"Roles: {', '.join(roles)}")

    # casosAgrupados
    m = re.search(r"casosAgrupados=\{\[(.*?)\]\}", text, re.DOTALL)
    if m:
        casos = re.findall(r'"([^"]+)"', m.group(1))
        parts.append(f"Grouped cases: {', '.join(casos)}")

    # stages — D→A→R
    stages = re.findall(
        r"type:\s*'([dar])'.*?descripcion:\s*\"(.*?)\".*?pilarName:\s*\"([^\"]+)\"",
        text,
        re.DOTALL,
    )
    stage_labels = {"d": "Detect", "a": "Analyze", "r": "Respond"}
    for stype, desc, pilar in stages:
        label = stage_labels.get(stype, stype.upper())
        parts.append(f"Stage {label} ({pilar}): {strip_html(desc)}")

    # reference names
    refs = re.findall(r'refName:\s*"([^"]+)"', text)
    if refs:
        parts.append(f"References: {', '.join(refs)}")

    return "\n".join(parts)


def extract_viz_slide(text: str) -> str:
    """Extract structured content from VizSlide component."""
    parts = []
    for prop in ["title", "momentTitle", "imageAlt", "pilarDesc"]:
        m = re.search(rf"""{prop}=["'](.*?)["']""", text, re.DOTALL)
        if m:
            parts.append(f"{prop}: {strip_html(m.group(1))}")

    m = re.search(r"""momentDesc=["'](.*?)["']""", text, re.DOTALL)
    if m:
        parts.append(f"momentDesc: {strip_html(m.group(1))}")

    return "\n".join(parts)


# ─── Slide Loading ────────────────────────────────────────────────────────────


def read_slides() -> list[dict]:
    """Read all active (non-hidden) MDX slides, sorted by order."""
    slides = []
    for f in SLIDES_DIR.glob("*.mdx"):
        text = f.read_text()
        fm = parse_frontmatter(text)

        if fm.get("hidden"):
            continue

        layout = fm.get("slideLayout", "content")
        if layout == "case-study":
            content = extract_case_study(text)
        elif layout == "viz":
            content = extract_viz_slide(text)
        else:
            content = extract_content_slide(text)

        slides.append(
            {
                "order": fm.get("order", 999),
                "title": fm.get("title", f.stem),
                "layout": layout,
                "file": f.name,
                "content": content,
            }
        )

    slides.sort(key=lambda s: s["order"])
    return slides


# ─── Design System ────────────────────────────────────────────────────────────

DESIGN_LIGHT = """\
## Design System (Light Mode)
- Background: #ffffff (white)
- Text: #1a1a2e (near-black), muted: #6b7280
- Accent: #0891b2 (teal)
- Stage colors: Detect = #0891b2 (teal), Analyze = #d97706 (amber), Respond = #16a34a (green)
- Card background: #f8fafc, card border: #e2e8f0
- Font: Arial (universal fallback for Inter)
- Title: 28pt bold #1a1a2e, Body: 14pt #1a1a2e, Caption: 10pt #6b7280
- Slide numbers: bottom-right, 10pt #6b7280"""

DESIGN_DARK = """\
## Design System (Dark Mode)
- Background: #0a0f12 (near-black)
- Text: #ffffff (white), muted: #8899aa
- Accent: #00f3ff (cyan)
- Stage colors: Detect = #00f3ff (cyan), Analyze = #f59e0b (amber), Respond = #22c55e (green)
- Card background: #111820, card border: #1a2530
- Font: Arial (universal fallback for Inter)
- Title: 28pt bold white, Body: 14pt white, Caption: 10pt #8899aa
- Slide numbers: bottom-right, 10pt #8899aa"""


# ─── Prompt Construction ──────────────────────────────────────────────────────


def format_slide_blocks(slides: list[dict], offset: int = 0) -> str:
    """Format slides as numbered prompt blocks."""
    blocks = []
    for i, s in enumerate(slides, offset + 1):
        blocks.append(
            f"### Slide {i} (order {s['order']}, layout: {s['layout']})\n"
            f"**Title: {s['title']}**\n"
            f"{s['content']}"
        )
    return "\n\n".join(blocks)


def build_batch_prompt(
    slides: list[dict],
    batch_num: int,
    total_batches: int,
    total_slides: int,
    offset: int,
    light: bool,
) -> str:
    """Build the generation prompt for one batch of slides."""
    slide_text = format_slide_blocks(slides, offset)
    start = offset + 1
    end = offset + len(slides)

    if batch_num == 1:
        design = DESIGN_LIGHT if light else DESIGN_DARK
        return f"""\
Generate a professional PPTX presentation for a mining operations UX research deck.

## Metadata
- Title: TIMINING CORE — Refinamiento Estratégico
- Subtitle: Follow-up Touchpoint 2 · Semana 5
- Client: IDEMAX
- Total slides: {total_slides}
- Language: Spanish
- Format: 16:9 widescreen
- Batch {batch_num}/{total_batches}: slides {start}–{end} of {total_slides}

{design}

## Layout Rules
- **cover**: centered title (36pt), subtitle below, minimal
- **content**: title top-left, body as bullets or card-like text boxes
- **case-study**: title + domain at top, context paragraph, then D→A→R stages as three color-coded sections (colored left-border or header)
- **viz**: title + text description (no images)
- **custom**: adapt based on content

## Instructions
1. `pip install python-pptx`
2. Slide size: 16:9 (13.333in × 7.5in)
3. Every slide gets the design-system background fill
4. D→A→R stages: colored rectangles or text boxes with colored headers
5. Tables: PowerPoint tables with matching style
6. Slide numbers: small, bottom-right, muted color
7. Save as `/tmp/presentation.pptx`

## Slides {start}–{end}

{slide_text}"""

    design = DESIGN_LIGHT if light else DESIGN_DARK
    return f"""\
Open `/tmp/presentation.pptx` and ADD slides {start}–{end}.

IMPORTANT: Do NOT read, inspect, or iterate over existing slides. Just open the file and append new slides.

{design}

## Instructions
1. `from pptx import Presentation; prs = Presentation('/tmp/presentation.pptx')`
2. Add ONLY the new slides below — do not modify existing slides
3. Use the exact same design system colors/fonts listed above
4. Save as `/tmp/presentation.pptx`

## Slides {start}–{end}

{slide_text}"""


# ─── API Helpers ──────────────────────────────────────────────────────────────

BETAS = ["files-api-2025-04-14"]


def _log(label: str, response):
    """Print stop reason and token usage."""
    print(
        f"  [{label}] stop={response.stop_reason}, "
        f"in={response.usage.input_tokens:,} out={response.usage.output_tokens:,}"
    )


def create_container(client: anthropic.Anthropic) -> tuple:
    """Create a reusable container with a cheap non-streaming call.

    Returns (container_id, usage_tuple).
    """
    response = client.beta.messages.create(
        betas=BETAS,
        model=MODEL,
        max_tokens=256,
        messages=[{"role": "user", "content": "Run: echo container_ready"}],
        tools=[TOOL],
    )
    cid = response.container.id
    return cid, (response.usage.input_tokens, response.usage.output_tokens)


def _stream_call(client: anthropic.Anthropic, label: str, **api_kwargs):
    """Make a streaming beta API call with progress dots. Returns final Message."""
    sys.stdout.write(f"  [{label}] streaming")
    sys.stdout.flush()

    with client.beta.messages.stream(betas=BETAS, **api_kwargs) as stream:
        for event in stream:
            if getattr(event, "type", None) == "content_block_start":
                sys.stdout.write(".")
                sys.stdout.flush()
        response = stream.get_final_message()

    print()  # newline after dots
    return response


def run_batch(
    client: anthropic.Anthropic,
    prompt: str,
    container_id: str,
    label: str,
) -> object:
    """Execute one batch with pause_turn/max_tokens continuation.

    Uses beta streaming (required by SDK for max_tokens >= 64000,
    beta needed for file references in response).
    Returns final_response.
    """
    kwargs = {
        "model": MODEL,
        "max_tokens": MAX_TOKENS,
        "messages": [{"role": "user", "content": prompt}],
        "tools": [TOOL],
        "container": container_id,
    }

    response = _stream_call(client, label, **kwargs)
    _log(label, response)

    turn = 1
    while response.stop_reason in ("pause_turn", "max_tokens") and turn < MAX_CONTINUATIONS:
        turn += 1
        reason = response.stop_reason
        print(f"  [{label}] ...{reason}, continuing (turn {turn})...")

        if reason == "pause_turn":
            # Server paused its sampling loop — re-send as-is, no extra message
            cont_messages = [
                {"role": "user", "content": prompt},
                {"role": "assistant", "content": response.content},
            ]
        else:
            # max_tokens — model needs a continuation prompt
            cont_messages = [
                {"role": "user", "content": prompt},
                {"role": "assistant", "content": response.content},
                {
                    "role": "user",
                    "content": "Continue. Complete the PPTX generation and save the file.",
                },
            ]

        cont_kwargs = {
            "model": MODEL,
            "max_tokens": MAX_TOKENS,
            "messages": cont_messages,
            "tools": [TOOL],
            "container": container_id,
        }

        response = _stream_call(client, label, **cont_kwargs)
        _log(label, response)

    return response


# ─── File Extraction ──────────────────────────────────────────────────────────


def extract_file_ids(response) -> list[str]:
    """Find all file_id values in response content blocks (recursive)."""
    ids = []

    def _scan(obj):
        if hasattr(obj, "file_id") and obj.file_id:
            ids.append(obj.file_id)
        if hasattr(obj, "content"):
            children = obj.content if isinstance(obj.content, list) else [obj.content]
            for child in children:
                if child is not None:
                    _scan(child)

    for block in response.content:
        _scan(block)

    return ids


# ─── Main ─────────────────────────────────────────────────────────────────────


def main():
    global MODEL

    parser = argparse.ArgumentParser(
        description="Export v2-boceto deck to PPTX via Claude code execution"
    )
    parser.add_argument(
        "--dark", action="store_true", help="Dark mode (default: light)"
    )
    parser.add_argument(
        "--output", type=str, help="Output path (default: exports/v2-boceto.pptx)"
    )
    parser.add_argument(
        "--batch-size", type=int, default=26, help="Slides per batch (default: 26)"
    )
    parser.add_argument(
        "--model",
        type=str,
        default=MODEL,
        help=f"Claude model (default: {MODEL})",
    )
    parser.add_argument(
        "--compress",
        action="store_true",
        help="Compress output (not yet implemented)",
    )
    args = parser.parse_args()

    MODEL = args.model

    light = not args.dark
    output = Path(args.output) if args.output else DEFAULT_OUTPUT

    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("ERROR: Set ANTHROPIC_API_KEY environment variable")
        sys.exit(1)

    # 1. Read slides
    slides = read_slides()
    print(f"[1/4] Read {len(slides)} active slides")

    # 2. Split into batches
    batches = [
        slides[i : i + args.batch_size]
        for i in range(0, len(slides), args.batch_size)
    ]
    mode = "light" if light else "dark"
    print(f"[2/4] {len(batches)} batch(es) of ~{args.batch_size} slides ({mode} mode)")

    # 3. Create container + run batches
    client = anthropic.Anthropic(max_retries=4)
    total_in = total_out = 0
    last_response = None

    print(f"[3/5] Creating container via {MODEL}...")
    container_id, (ci, co) = create_container(client)
    total_in += ci
    total_out += co
    print(f"  container={container_id}")

    print(f"[4/5] Generating slides via {MODEL} + code_execution...")

    offset = 0
    for batch_num, batch_slides in enumerate(batches, 1):
        label = f"Batch {batch_num}/{len(batches)}"
        print(f"\n  {label}: slides {offset + 1}–{offset + len(batch_slides)}")

        prompt = build_batch_prompt(
            batch_slides,
            batch_num,
            len(batches),
            len(slides),
            offset,
            light,
        )
        print(f"  [{label}] Prompt: {len(prompt):,} chars")

        response = run_batch(client, prompt, container_id, label)
        last_response = response
        total_in += response.usage.input_tokens
        total_out += response.usage.output_tokens

        # Show Claude's text summary
        for block in response.content:
            if hasattr(block, "text") and block.text:
                preview = block.text[:200]
                if len(block.text) > 200:
                    preview += "..."
                print(f"  Claude: {preview}")

        offset += len(batch_slides)

    print(f"\n  Total tokens: in={total_in:,} out={total_out:,}")

    # 5. Download PPTX
    file_ids = extract_file_ids(last_response) if last_response else []

    if not file_ids:
        # File exists in container but wasn't returned as a reference.
        # Make a cheap non-streaming beta call to retrieve it.
        print("\n  No files in last response — requesting download from container...")
        dl = client.beta.messages.create(
            betas=BETAS,
            model=MODEL,
            max_tokens=4096,
            container=container_id,
            messages=[
                {
                    "role": "user",
                    "content": (
                        "Find the .pptx file in /tmp/ and copy it to a new path "
                        "so it appears as a new output file. "
                        "Run: cp /tmp/presentation.pptx /tmp/output.pptx"
                    ),
                }
            ],
            tools=[TOOL],
        )
        file_ids = extract_file_ids(dl)
        total_in += dl.usage.input_tokens
        total_out += dl.usage.output_tokens

    if not file_ids:
        print("\nERROR: No PPTX file found in response.")
        if last_response:
            for block in last_response.content:
                if hasattr(block, "text") and block.text:
                    print(block.text[:500])
        sys.exit(1)

    output.parent.mkdir(parents=True, exist_ok=True)

    for fid in file_ids:
        meta = client.beta.files.retrieve_metadata(fid)
        print(f"\n[5/5] Downloading: {meta.filename} ({meta.size_bytes:,} bytes)")
        content = client.beta.files.download(fid)
        content.write_to_file(str(output))
        print(f"      Saved: {output}")
        client.beta.files.delete(fid)

    if args.compress:
        print(
            "\nWARN: --compress for PPTX not yet implemented."
            " Use PowerPoint > File > Compress Media."
        )

    print(f"\nDone! Total tokens: in={total_in:,} out={total_out:,}")


if __name__ == "__main__":
    main()
