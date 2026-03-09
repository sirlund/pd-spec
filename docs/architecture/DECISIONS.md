# Architectural Decisions

Cross-cutting engineering decisions for PD-Spec. Each entry is atomic — one decision, one rationale. Referenced from `CLAUDE.md` so any agent finds it.

## Format

```
### DEC-## — Title
**Context:** Why this came up.
**Decision:** What we decided.
**Rationale:** Why.
```

---

### DEC-01 — DEV guards for debug globals

**Context:** Adding `window.__pdDebug` for QA observability via Playwright MCP. Question of whether to gate it behind a QA-only flag.
**Decision:** Use `import.meta.env.DEV` (Vite built-in). No custom flags, no runtime conditionals.
**Rationale:** Vite tree-shakes the block in production builds — zero bytes, zero runtime cost. Simpler than a custom `--qa` flag and covers any future debug surface.

### DEC-02 — Don't design for production, don't prevent it

**Context:** The Live Research App is localhost-only today. Future may include deployment.
**Decision:** Don't add auth, HTTPS, multi-tenant, or deployment infra now. But don't take decisions that make them impossible later.
**Rationale:** Homer's Car — premature production hardening for a local tool is waste. When production becomes real, it gets its own BL with proper scope. Until then, keep it simple.

### DEC-03 — Repo is the only portable source of truth

**Context:** Auto-memory (`~/.claude/`) is machine-local. Claude web, mobile, other laptops, other agents don't see it.
**Decision:** Any decision, convention, or constraint that future agents need must live in the repo (`CLAUDE.md`, `docs/`, skill files). Auto-memory is for session optimization only.
**Rationale:** The repo travels. Machine-local state doesn't.
