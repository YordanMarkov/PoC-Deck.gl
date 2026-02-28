# Pairwise PoC - Explainability + Similarity

Proof of concept for ranking and visualizing company matches against an Ideal Customer Profile (ICP), with transparent score breakdowns and interactive exploration at scale.

## Why this PoC exists

In many matching systems, users get a ranked list but little explanation of:

- why a company ranks where it does
- how strong or weak specific criteria are
- how candidates relate to each other in a broader landscape

This PoC combines a quantitative similarity score with visual and textual explainability so decisions are faster and more defensible.

## What the product demonstrates

- `Ranked matching` of organizations against an ICP
- `Criterion-level explainability` (score, weight, contribution, and explanation text)
- `2D cluster visualization` (Deck.gl scatterplot) for structure and context
- `Cross-highlighting` between list and map (hover/select synchronization)
- `Interactive controls` for filtering and ranking:
  - minimum score threshold
  - sort strategy
  - visible point limit

## Core concept

Each organization receives a total match score from weighted criteria:

- country
- industry
- employees
- revenue
- keywords overlap
- tech stack overlap

For each criterion, the dataset stores:

- `score` (0..1)
- `weight`
- `contribution = score * weight`
- short human-readable explanation

The final score is:

`totalScore = sum(contribution_i)`

This makes the ranking auditable rather than a black box.

## UI overview

- `Left panel`: Deck.gl cluster view
  - points represent organizations in a synthetic 2D embedding
  - hover and selection are visually emphasized
  - selected item from the ranked list is highlighted in the plot
- `Top-right`: ranked matches
  - top matches shown with country, industry, company size, revenue, and score
- `Bottom-right`: explainability panel
  - selected organization details
  - per-criterion breakdown bars
  - natural-language summary

## Reader walkthrough (first 5 minutes)

Use this sequence if you are seeing the prototype for the first time:

1. Open the app and read the ICP title in the top bar. This is the target profile all companies are matched against.
2. Click a company in `Ranked matches`. The same company becomes highlighted in the cluster view.
3. Look at `Explain match` for that company and scan criterion rows from highest to lowest contribution.
4. Compare `score`, `weight`, and `contrib` on each row to understand why the final score is high or low.
5. Raise `Min score` to narrow the candidate set and observe how the ranked list and visible cluster points change together.
6. Switch `Sort` (score up/down, employees down) to test different exploration strategies.
7. Increase `Visible points` to stress-test interaction and understand behavior at higher volume.

## How to interpret the visualization

- `Position`: closer points belong to similar synthetic groups in the 2D embedding.
- `Color`: indicates cluster grouping, not match quality by itself.
- `Circle size`: scales with match score (higher score, larger point).
- `Selection`: list click and map click stay synchronized.
- `Explainability panel`: this is the source of truth for *why* a company scores as it does.

## Tech stack

- React (CRA)
- Deck.gl (`@deck.gl/react`, `@deck.gl/layers`)
- Synthetic dataset generation with Node.js script

## Repository structure

- `README.md` - project overview (this file)
- `poc-deck.gl/` - React application
- `poc-deck.gl/public/pairwise-data.json` - generated PoC dataset
- `poc-deck.gl/src/scripts/generate-pairwise-data.mjs` - data generator
- `poc-deck.gl/src/ClusterPlotDeckGL.jsx` - cluster visualization
- `poc-deck.gl/src/MatchList.jsx` - ranked list
- `poc-deck.gl/src/ExplainPanel.jsx` - explainability panel

## Run locally

1. Install dependencies

```bash
cd poc-deck.gl
npm install
```

2. Start development server

```bash
npm start
```

3. Open:

`http://localhost:3000`

## Regenerate synthetic dataset

From `poc-deck.gl`:

```bash
node src/scripts/generate-pairwise-data.mjs --count 10000 --clusters 8 --seed 7 --out public/pairwise-data.json
```

Example large run:

```bash
node src/scripts/generate-pairwise-data.mjs --count 100000 --clusters 10 --seed 42 --out public/pairwise-data.json
```

## Research alignment

This PoC supports a research narrative around `explainable matching`:

- balancing ranking quality and interpretability
- helping users validate model behavior with transparent criteria
- improving trust through side-by-side list + visual context

Reference document in this workspace:

- [Research document (Google Doc)](https://docs.google.com/document/d/1D9hURBbTHNitPJpY3i1V2G6Ue7WYIyGtNfE1WtDLf2U/edit?usp=sharing)

## Current scope and limitations

- Uses synthetic data and synthetic 2D embedding (UMAP-like clusters)
- Not connected to production sources yet
- Focus is interaction design and explainability UX rather than model optimization

## Next steps

- Integrate real company/profile data pipeline
- Add configurable criterion weights in UI
- Add scenario comparison (multiple ICPs side-by-side)
- Add selection auto-focus in the cluster view
- Track user interactions for explainability UX evaluation

## Author note

Built as a practical proof of concept for demonstrating how similarity ranking and explainability can coexist in one analyst-friendly interface.
