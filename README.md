# Combo Cats

A portrait mobile rhythm game: the center stage plays the original dancing cat video with audio, while colorful cat notes slide through the timing ring so players can tap to build combo.

## Files

- `index.html`: page structure
- `styles.css`: mobile visuals and interaction styles
- `script.js`: rhythm notes, tap judgement, combo, and results logic
- `assets/cats-dance.mp4`: main gameplay video
- `assets/game-background.png`: provided background image

## Local Preview

Run this from the repository root:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## Deployment

After pushing static files to GitHub, preview with:

- `https://cdn.jsdelivr.net/gh/FangFang-create/game-2@main/index.html`
- `https://fangfang-create.github.io/game-2/`

GitHub Pages can publish this static site directly from the `main` branch root.
