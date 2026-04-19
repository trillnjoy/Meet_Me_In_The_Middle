# MMITM — Project Specification
*Last updated: 2026-04-19. Replace previous CLAUDE_MMITM.md entirely.*

---

## Project

**Meet Me In The Middle** — A PWA that finds a fair meeting point for 2–4 friends
and surfaces real nearby venues. Hosted at:
`https://trillnjoy.github.io/Meet_Me_In_The_Middle/`

Repo: `trillnjoy/Meet_Me_In_The_Middle` — `main` branch is live production.

Primary use context: **LA/OC metro area**, with design generality for other
metro areas, coastal geographies, and long-distance corridor planning.

---

## Current Architecture

**Files:** `index.html`, `manifest.json`, `sw.js`, `icons/icon-192.png`, `icons/icon-512.png`
**No build step.** Vanilla HTML/CSS/JS. Edit and deploy directly.
**Icons:** `icon-192.png` and `icon-512.png` live in repo **root**, not an `icons/` subfolder.
`manifest.json` and `index.html` both reference them as `"icon-192.png"` (no path prefix).

**External dependencies (CDN):**
- Leaflet 1.9.4 (map)
- Turf.js 6.5.0 (polygon intersection math)

**APIs:**
- **ORS (OpenRouteService):** Isochrones + Directions. Key stored as `ORS_KEY` constant in index.html. Free tier: 500 isochrone/day, 2000 directions/day.
- **Nominatim:** Geocoding, reverse geocoding, venue search. No key required. Rate limit: 1 req/sec — 350ms delays enforced between calls.

**Location search:** Nominatim geocoding — confirmed working in Safari from GitHub Pages.
**Venue search:** Nominatim `?q=` keyword search bounded to a viewbox — working.
**Map:** Leaflet + OpenStreetMap tiles.

---

## 4-Step Flow

**Step 1 — Who's meeting up?**
- Me slot (slot 0) pre-populated from localStorage profile
- Saved contacts shown as horizontal chip picker above Add Friend button
- Add friend button opens location modal with Safari form-scoped autofill
- Travel mode pills (driving/transit/walking/cycling)
- Allow tolls toggle (default on), Allow ferry toggle (default off)
- Per-session variables — not persisted

**Step 2 — What's the vibe?**
- Mood/vibe selector
- Venue category multi-select (defaults from localStorage)

**Step 3 — Choose a meeting area** (normal, <150km)
- ORS isochrone intersection → commercial density probe → candidate areas
- Multi-select area cards with fairness %, per-person time chips
- Back navigation preserves state

**Step 3 — Choose a meeting city** (long-distance, >150km)
- Detects long-distance by finding farthest friend pair
- Driving: single ORS Directions call → decodes polyline → samples 6 cities → reverse-geocodes at zoom 12
- Second corridor offered: if ORS returns inland route, static coastal (Amtrak) stops offered as alternative tab, and vice versa
- Transit: two static Amtrak corridors (Coast Starlight/Pacific Surfliner + San Joaquins)
- City cards show h:mm + miles per person + equity ratio badge (e.g. "42/58")
- **+ refine button** between each adjacent city pair — taps ORS Directions between those two cities, samples 3 interior points, probes commercial density, inserts best city
- Single-select

**Step 4 — Results**
- Venue search anchored to selected area/city centroid
- 2.5km radius (local) or 8km radius (long-distance)
- Sort: by category group (user's selected order), then fairness descending within group
- Three tabs: List / Map / Share

---

## Fairness Metric

```javascript
function fairnessPct(times) {
  const mx = Math.max(...times), avg = sum/n;
  const spread = Math.max(0, (mx - min) - 5); // sub-5min is noise
  const equity = Math.max(0, 1 - spread / mx);
  const magnitude = Math.max(0, 1 - avg / 30); // 30min ceiling
  return Math.round((equity * 0.6 + magnitude * 0.4) * 100);
}
```
- Joy (2/3/4 min): ~96% — close venues ranked higher than distant equal ones
- Sub-5min spread treated as noise ("travel budget dust")

---

## Share Tab (replaces Vote tab)

- Shows only starred (☆→★) venues from List tab
- "Copy for iMessage Poll" — generates formatted message with:
  - Addressed to "You" contacts by name
  - Each starred venue numbered with address + Apple Maps link
  - `https://maps.apple.com/?q=NAME&ll=LAT,LNG&z=16`
  - Instruction to paste venue names as iMessage poll options
- "Open in Messages" — native share sheet on iOS if `navigator.share` available
- Empty state prompts to star venues first

---

## Persistent Storage (localStorage)

```
mmitm_profile:  { name, avatar, color, photo }  — "Me" profile
mmitm_contacts: [ {id, name, avatar, color, photo, location, coords} ]  — up to 12
mmitm_defaults: { travelMode, categories }  — applied on each new session
```

- Profile photo stored as base64 JPEG at 0.6 quality (300×300px crop)
- Robust saveProfile: falls back to saving without photo if quota exceeded, warns user
- Contacts saved via "Save to My Contacts ⭐" button in location modal (friends i > 0 only)
- Contacts appear as chip picker in Step 1

---

## Photo Crop UI

- Full-screen dark overlay with circular mask
- Drag to reposition, pinch to zoom
- Constrained so image always fills the circle
- Outputs 300×300 circular JPEG at quality 0.6
- Applied in both avatar modal (friend slots) and Me settings tab

---

## Settings (⚙️ on home screen only)

Three tabs:
- **Me** — name, photo (Gallery/Selfie/Clear + crop), color, emoji
- **You** — saved contacts list, coral × remove badge with confirmation, count (n/12)
- **What We Do** — default travel mode, default venue categories

---

## Venue Categories & Search Terms

```javascript
const SEARCH_TERMS = {
  restaurant: ["restaurant"],
  bar:        ["bar"],
  cafe:       ["cafe"],
  golf:       ["golf course"],
  spa:        ["spa", "massage"],      // multi-term
  museum:     ["museum"],
  theatre:    ["theatre"],
  park:       ["park"],
  cinema:     ["cinema"],
  nightclub:  ["nightclub"],
};
```
- Multi-term categories run sequential Nominatim calls with 350ms delay between terms
- Winery/vineyard category NOT YET ADDED — known gap, OSM coverage poor

---

## Known Architecture Decisions & Hard-Won Lessons

**Safari/WebKit:**
- Overpass API: CORS blocked from GitHub Pages on Safari — do not attempt
- Foursquare Places API: CORS blocked on Safari from GitHub Pages
- Google Places: CORS works but billing key exposure unacceptable for public repo
- `await` inside `for...of` inside `try/catch` in classic scripts: use indexed `for` loops
- `async () =>` assigned to `.onclick`: Safari rejects — use `element.onclick = function() { (async function() { ... })(); }`
- `autocomplete="name"` on all name inputs causes cross-contamination — use form-scoped autofill instead: wrap modal content in `<form name="friend_form_N">` with unique N per friend index
- Pull-to-refresh: `overscroll-behavior-y: none` on html/body
- Zoom lock: `maximum-scale=1, user-scalable=no` in viewport meta

**ORS API limits (free tier):**
- Isochrones: 500/day, max 1 hour range for driving
- Directions alternative routes: **hard limit 100km** — returns 400 for longer distances
- Directions single route: works up to 6,000km
- Matrix: 500/day

**Nominatim:**
- `amenity=` / `leisure=` as standalone params: HTTP 400 — use `?q=keyword` only
- Rate limit: 1 req/sec strictly — enforce 350ms delays
- `bounded=1` with viewbox does NOT strictly enforce the box
- zoom 12 = city/town level (Paso Robles vs SLO County)
- zoom 14 = neighborhood level (Highland Park vs Los Angeles)

**Venue geography:**
- Venue search uses 2.5km radius from isochrone centroid (local) or 8km (long-distance)
- Commercial anchor approach (probing density to shift centroid) was attempted and reverted — OSM density in adjacent districts (Burbank, Echo Park) defeats polygon filtering
- Geometric centroid of isochrone intersection works correctly for local meetup cluster

**Function declaration safety:**
- When using `str_replace` to insert code before a function declaration, the anchor text (function signature) gets consumed — always verify all async function declarations survive edits
- Pattern to check: `grep -n "async function" index.html` after any major insertion

---

## Roadmap / Open Items

### Immediate
- [ ] Winery/vineyard category — add with terms `["winery", "wine tasting", "tasting room"]`
- [ ] Profile persistence debugging — photo sticking intermittently (likely localStorage quota)
- [ ] Banner: "Between Oneonta Drive & Oneonta Drive" when same street used by multiple friends
- [ ] "Add friend X of 4" counter — verify fix is working

### Near Term (Phase 2)
- [ ] Keyword search refinement — after area selection, let user type "York Blvd" or "Figueroa" to focus venue search on a specific corridor
- [ ] Per-person travel mode (one drives, one takes transit)
- [ ] Spa/winery results thin in many areas — consider display note when category returns <3 results
- [ ] Weekend Destination Mode toggle (Phase 3 in original spec)

### Long Distance
- [ ] Corridor city naming — Paso Robles/Atascadero still occasionally returning county name; zoom 12 should fix but verify
- [ ] + refine button: test between SLO and Salinas to confirm Paso Robles surfaces
- [ ] Amtrak corridor stops — verify accuracy of static stop coordinates

### Settings
- [ ] "What We Do" defaults: tolls/ferry currently excluded (per-session only) — confirm this is correct
- [ ] Me profile photo not persisting reliably — investigate localStorage quota on iOS Safari

---

## Native iOS Handoff Guide

This PWA is an intermediate deliverable. The intended end state is a native iOS app
submitted to the App Store. This section documents every PWA workaround and its
correct native iOS equivalent for the developer who takes over.

### Architecture Mapping

| PWA (current) | Native iOS equivalent |
|---|---|
| localStorage (profile, contacts) | UserDefaults (profile) + CoreData or CloudKit (contacts) |
| Nominatim geocoding | CoreLocation + MapKit reverse geocoding |
| Leaflet + OpenStreetMap | MapKit (MKMapView) |
| navigator.geolocation | CLLocationManager |
| navigator.share | UIActivityViewController |
| navigator.contacts (blocked) | CNContactPickerViewController |
| Camera via `<input capture>` | UIImagePickerController / PHPickerViewController |
| In-app circular crop UI | UIImagePickerController allowsEditing + custom crop |
| Form-scoped autofill for names | CNContactPickerViewController (direct contact selection) |
| iMessage copy/paste poll | MFMessageComposeViewController with pre-populated body |
| Apple Maps links | MKMapItem openInMaps() or deep link to maps:// scheme |
| Service Worker (PWA offline) | Native app bundle — no equivalent needed |
| ORS API key in client-side JS | Move to backend proxy (required before App Store submission) |
| Nominatim venue search | Replace with MKLocalSearch or a properly credentialed API |
| Turf.js polygon intersection | Native Swift geometry or MapKit polygon math |

### Key Design Decisions to Preserve

- **Form-scoped autofill isolation** — each friend slot must be treated as a separate
  form/scope so contacts suggestions don't cross-contaminate between people.
  In native: present CNContactPickerViewController modally per friend slot.

- **ORS isochrone + commercial density probe** — the core algorithm for finding fair
  meeting areas. Port the logic faithfully; the ORS API calls are straightforward
  URLSession requests. Consider caching isochrone results for repeated sessions.

- **Fairness metric** — the custom `fairnessPct()` formula (equity 60% + magnitude 40%,
  5-minute noise floor) is intentional and validated. Do not replace with simple
  equal-time calculation.

- **Long-distance corridor mode** — triggered at >150km between farthest pair.
  ORS alternative routes are limited to 100km; single-route + static Amtrak fallback
  is the correct architecture. Do not attempt alternative routes for long distance.

- **ORS API key** — currently embedded in client-side JS (acceptable for PWA/GitHub Pages,
  not acceptable for App Store). Must move behind a backend proxy or use
  server-side rendering before submission. The key is a free-tier ORS key; obtain
  a production key and manage rate limits server-side.

- **Venue data source** — Nominatim/OSM is used because it's free and CORS-friendly
  from a browser. A native app should use Google Places API or Foursquare (server-side)
  for dramatically better venue coverage, especially for spas, wineries, and emerging
  neighborhoods with thin OSM data.

- **Share flow** — currently generates formatted text for iMessage poll copy/paste.
  Native replacement: MFMessageComposeViewController with body pre-populated,
  recipients pre-filled from the "You" contacts in the session. This is a significant
  UX improvement over copy/paste.

- **iMessage poll** — the copy/paste instruction exists because web apps cannot
  programmatically create iMessage polls. A native app using iMessage Extensions
  could create polls directly. This is an enhancement opportunity.

### App Store Considerations

- **Privacy:** App requires location (CLLocationManager), contacts (CNContactStore),
  camera (NSCameraUsageDescription), photo library (NSPhotoLibraryUsageDescription).
  All usage strings must explain purpose clearly.
- **Contacts entitlement:** The web ContactsManager API was explicitly avoided because
  it requires an Apple entitlement not available to web apps. A native app gets this
  via standard CNContactPickerViewController — no special entitlement needed.
- **Maps:** Switch from OpenStreetMap tiles to MapKit to comply with App Store
  guidelines and avoid third-party tile hosting costs.
- **API keys:** ORS key, and any future venue API keys, must not be in the app bundle.
  Use a lightweight backend (Cloudflare Worker, AWS Lambda, or similar) as a proxy.
- **Offline mode:** The PWA service worker provides basic offline capability.
  A native app should cache the last session result and profile/contacts locally
  so the app is usable without network for the friends/settings screens.

### What the Native Developer Gets for Free

The PWA validates the full product concept including:
- The 4-step UX flow (proven with real users)
- The fairness algorithm (validated against real LA/OC geography)
- The long-distance corridor concept (Amtrak + ORS)
- The iMessage share flow (validated as the right group consensus mechanism)
- The settings architecture (Me + You + What We Do)
- The shortlist → share pattern replacing in-app voting

The native developer should treat the PWA as a functional spec, not just a wireframe.
Every interaction detail in index.html is intentional.



- Troy is a Board Certified Clinical Informaticist and executive physician/pediatrician.
  Vision and requirements from Troy; implementation from Claude.
- Primary test device: iPhone, Safari, iOS WebKit. ALL choices must be verified against
  WebKit CORS behavior and Safari quirks, not just Chrome/desktop.
- Console debugging from iPhone: Mac + cable + Web Inspector. Not always available.
- **Diagnose and report before implementing. Wait for greenlight.**
- **Archive index.html before significant changes.** Troy maintains rolling archive.
- Do not push code to GitHub that has not been verified or is not clearly labeled
  as unverified with explicit confidence level.
- Troy explicitly flagged: premature closure, anchoring, availability bias in Claude's
  reasoning — maintain competing hypotheses, disconfirm before concluding.
- Prefer honest diagnosis of limitations over consoling oversimplification.
- When str_replace eats a function declaration, own it immediately and fix it.
