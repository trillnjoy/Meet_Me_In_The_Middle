# 📍 Meet Me In The Middle

A PWA that finds the geographic midpoint between 2–4 friends and surfaces real nearby venues — restaurants, bars, cafés, golf courses, day spas, museums, theatres, parks, cinemas, and live music venues — with travel-time fairness scoring and group voting.

## Features

- **Real map** — Leaflet + OpenStreetMap tiles
- **Real venues** — live data from the Overpass API (OpenStreetMap)
- **GPS location** — `navigator.geolocation` with reverse-geocoding via Nominatim
- **Location search** — Nominatim autocomplete as you type
- **Avatar customisation** — emoji picker, colour selector, camera/photo upload
- **Contact import** — name + location search sheet
- **Travel fairness** — per-person time estimates (driving/transit/walking/cycling)
- **Group voting** — 👍/👎 on real venues; shareable link
- **PWA** — installable on iOS & Android home screen, service worker for offline shell

## File structure

```
mmitm-pwa/
├── index.html          ← entire app (HTML + CSS + JS, no build step)
├── manifest.json       ← PWA manifest
├── sw.js               ← service worker
└── icons/
    ├── icon-192.png    ← you must generate this (see below)
    ├── icon-512.png    ← you must generate this (see below)
    └── generate-icons.html  ← open in browser to download both icons
```

## Deployment to GitHub Pages

### 1. Create the repository

```bash
git init
git add .
git commit -m "Initial commit"
```

Create a new **public** repository on GitHub (e.g. `meet-me-in-the-middle`), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/meet-me-in-the-middle.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `/ (root)`
4. Click **Save**

Your app will be live at:
```
https://YOUR_USERNAME.github.io/meet-me-in-the-middle/
```

> If you're deploying into a subdirectory of an existing Pages repo (like `trillnjoy.github.io/Claude_Artifacts/`), update `manifest.json`:
> ```json
> "start_url": "/Claude_Artifacts/mmitm/index.html",
> "scope": "/Claude_Artifacts/mmitm/"
> ```
> and update the service worker cache path for `index.html`.

### 4. Install as PWA on iPhone

1. Open the URL in **Safari** (must be Safari for iOS PWA install)
2. Tap the **Share** button → **Add to Home Screen**
3. Tap **Add** — the app icon appears on your home screen

## API dependencies (all free, no keys required)

| Service | Purpose | Rate limit |
|---------|---------|------------|
| [Nominatim](https://nominatim.openstreetmap.org) | Geocoding & reverse-geocoding | 1 req/sec |
| [Overpass API](https://overpass-api.de) | Real venue data | Fair use |
| [OpenStreetMap tiles](https://tile.openstreetmap.org) | Map tiles | Fair use |

> Nominatim requires a valid `User-Agent` header. The app sends `MMITM-PWA/1.0` — update this to include your contact email for production use per [their policy](https://operations.osmfoundation.org/policies/nominatim/).

## Development

No build step required. Open `index.html` directly in a browser, or serve locally:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Service worker only activates over HTTPS or `localhost`.

## Customisation notes

- **Venue search radius**: change `2000` (metres) in `fetchOverpassVenues()` call inside `loadResults()`
- **Max venues on map**: change `slice(0,30)` in `buildLeafletMap()`
- **Travel speed assumptions**: edit the `speeds` object in `estimateMins()`
- **Colour palette**: edit the `:root` CSS variables at the top of `<style>`
