# Question bank

Questions live in MongoDB (`questions`). Students only ever see questions whose
review status is `reviewed`.

## File format

A JSON file: either a list of questions, or `{"defaults": {...}, "questions": [...]}`.
Fields in `defaults` apply to every question (the `source` object is merged).

Each question needs: `id`, `subject` (botany | zoology), `unit`, `chapter`, `topic`,
`class_level` (11 | 12), `difficulty` (easy | medium | hard), `type` (mcq |
assertion_reason | statement), `text`, `options` (exactly 4), `correct_index` (0-3),
`explanation`, and `source`. `option_notes` (4 entries or null) can explain each
wrong option.

## Sources

| type | required details |
|---|---|
| `original` | name |
| `ai_drafted` | name |
| `open_licensed` | name, url, license |
| `pyq` | name, year, paper, answer_key_url (the OFFICIAL key), rights_note |

Never label an AI-written question as `pyq`. Only import previous-year questions you
are allowed to reuse, and check each answer against the official key.

## Workflow

```powershell
python -m app.questions.import_questions your_file.json --dry-run   # validate only
python -m app.questions.import_questions your_file.json             # imports as DRAFT
python -m app.questions.cross_check                                 # optional: local model flags suspects
python -m app.questions.review list
python -m app.questions.review show bot-001
python -m app.questions.review approve bot-001 bot-002 --by "Your Name"
python -m app.questions.review reject bot-003
```

Changing a question's text, options, answer or explanation and re-importing resets it
to draft. A cross-check disagreement blocks approval unless you pass `--force`.