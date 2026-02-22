# Context: [Folder Title]

- **Date:** YYYY-MM-DD
- **Type:** interview | brief | technical_doc | workshop | quantitative_data | benchmark
- **Source Type:** interview | workshop | document | benchmark | field-note | transcript | ocr | chat-log
- **Authority:** primary | internal | ai-generated (default: primary)
- **Participants:** [names]
- **Context:** [1 sentence describing why these sources matter]

## Files

| File | Format | Description |
|---|---|---|
| example.png | image | [What this file contains and what to look for] |
| data.xlsx | spreadsheet | [Key data points or tabs relevant to the project] |
| transcript.txt | text | [Summary of content if the agent can't parse the format] |

<!--
  Use this template when a folder contains non-markdown files
  (images, PDFs, spreadsheets, text files) that can't carry
  their own metadata. Markdown files can still use _SOURCE_TEMPLATE.md
  for internal metadata.

  The /extract skill reads this file to understand folder contents
  and apply context to all files in the folder.

  Source Type values (format — what preprocessing to apply):
  - interview, workshop, document, benchmark, field-note — standard sources
  - transcript — speech-to-text output (Granola, Otter, Fireflies, etc.)
    Triggers smart preprocessing in /extract Phase 1.5: speaker detection,
    phonetic correction, and sentence repair before claim extraction.
  - ocr — optical character recognition output (future v2 preprocessing)
  - chat-log — messaging platform export (future v2 preprocessing)

  Authority values (weight — how much trust claims receive):
  - primary (default) — stakeholder interviews, user research, quantitative data.
    Full evidentiary weight. Claims can reach VERIFIED independently.
  - internal — consultant/team sessions, internal ideation, delivery planning.
    Claims tagged [INTERNAL] during extraction. Cannot reach VERIFIED without
    primary corroboration. Action items separated from raw claims.
  - ai-generated — content produced by AI tools (Gemini, ChatGPT, etc.).
    Claims tagged [AI-SOURCE] during extraction. Cannot reach VERIFIED without
    primary corroboration. Voice forced to 'ai', authority forced to 'hypothesis'.

  Authority is per-file (via frontmatter) or per-folder (via _CONTEXT.md).
  Individual file frontmatter overrides folder default.

  Backwards compatibility: Source Type "ai-generated" (old format) is mapped to
  Authority: ai-generated during extraction.
-->
