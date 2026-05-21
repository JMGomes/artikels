# German Trainer

A1 German practice: **Artikel** (`der`, `die`, `das`) and **Sentence composition** (word order, questions & answers).

**Live app:** [https://jmgomes.github.io/artikels/](https://jmgomes.github.io/artikels/)

## Exercises

### Artikel

- **Study:** vocabulary table with color-coded articles
- **Practice:** 10 random nouns per round

Data: [`public/words.json`](public/words.json)

### Sentences

- **Study:** one example per sentence pattern (Q/A pairs when available)
- **Practice:** each round randomly shows either a German **question** (you build the answer) or an **answer** (you build the question); 4 pairs per round

Data: [`public/sentences.json`](public/sentences.json)

#### `sentences.json` schema

```json
{
  "id": "unique-card-id",
  "pairId": "groups question + answer",
  "role": "question | answer",
  "pattern": "time_first_v2 | subject_first | w_question_wann | ...",
  "english": "Full meaning for the practice prompt",
  "segments": [
    { "id": "seg-1", "text": "Am Vormittag", "english": "In the morning", "type": "subject | verb | time | questionWord | other" }
  ],
  "correctOrder": ["seg-1", "seg-2"],
  "alternateOrders": [["optional", "valid", "order"]],
  "distractors": ["optional-segment-id-from-another-card"]
}
```

Grading uses **explicit orders in JSON** (option B), not a grammar engine. Questions and answers in the same `pairId` can use different patterns and orders.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173/artikels/](http://localhost:5173/artikels/)

## Deploy to GitHub Pages

Push to `main` on [JMGomes/artikels](https://github.com/JMGomes/artikels). Enable **Settings → Pages → GitHub Actions**. Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Stack

- React + TypeScript + Vite
