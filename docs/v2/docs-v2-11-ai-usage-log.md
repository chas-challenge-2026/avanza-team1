# AI Usage Log

**Version:** 1.0  
**Date:** 2026-08-26  
**Purpose:** Course goals on using AI as support while keeping ownership, source criticism, and the ability to explain the result.  
**Rule:** if AI changed a decision, a document, a test idea, or code you will submit, add a row the same day.

This is not a guilt log. Empty rows at the end of the course are a grade risk if everyone used AI anyway.

---

## How to write a row

```md
### A-NNN — short title

- Date:
- Person:
- Tool:
- Task:
- What the tool produced:
- What I changed or rejected:
- How I verified it:
- What I can explain without the tool:
- Linked story / file:
```

Keep entries short. Examiners care that you _own_ the output.

---

## Team defaults

| Allowed                              | Not enough on its own                                |
| ------------------------------------ | ---------------------------------------------------- |
| Draft docs, then edit                | “ChatGPT wrote the service”                          |
| Generate a test list, then select    | Pasting unreadable code you cannot walk through      |
| Explain v1 SQL so you can replace it | Blind trust in invented FX rates or legal advice     |
| Review your own PR comments          | Letting the model invent new API fields off-contract |

If a model disagrees with `04-api-contract.md` or `05-native-contract.md`, the contract wins until the team changes it.

---

## Logged entries

### A-001 — v2 planning documentation pack

- **Date:** 2026-08-26
- **Person:** Tomac Jansson (requesting, on behalf of the team)
- **Tool:** Grok / BMAD Fullstack Team (Analyst, PM, Architect, UX, Orchestrator)
- **Task:** Brownfield planning pack under `docs/v2/` so JS, Java, and C/C++ can work in parallel
- **What the tool produced:** drafts of `00`–`11` (and planned `12`–`14`): brief, PRD, architecture, contracts, UX, stories, board, DoR/DoD, decision log, this file
- **What the team must still do:** accept or amend D-015–D-018; put names on issues; reject anything that does not match the repo
- **How we verify:** read against v1 `known-bugs.md`, `seed.sql`, `DRIFT.md`, and the course brief
- **What we must be able to explain:** why asset-class targets replace account-type targets; why 5% is inclusive; why native is optional on the HTTP path
- **Linked:** entire `docs/v2` pack

### A-002 — (next entry)

- **Date:**
- **Person:**
- **Tool:**
- **Task:**
- **What the tool produced:**
- **What I changed or rejected:**
- **How I verified it:**
- **What I can explain without the tool:**
- **Linked story / file:**

---

## Per-person scratchpad (optional)

Use during sprints if you do not want to number yet. Move important rows up.

### Tomac

### Zaida

### Björn

### Erik

### Rasha

### Pär

### Henrik

---

## Questions to ask yourself before you paste AI output

1. Does this match the contract field names?
2. Did it reintroduce `10.45`, MD5, or 7% drift?
3. Did it add a Pension account we explicitly cut?
4. Did it write advice-like Swedish copy?
5. Can I draw what this does on a whiteboard?

If no to 5, do not merge.

---

## Next document

`12-test-status.md`

---

## AI disclosure

Yes — this file was drafted by the same session as A-001.
