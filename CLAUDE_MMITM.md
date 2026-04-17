# MMITM — Project Specification
*Last updated: 2026-04-17. Append to CLAUDE_addendum.md or merge into master CLAUDE.md.*

---

## Project

**Meet Me In The Middle** — A PWA that finds a fair meeting point for 2–4 friends
and surfaces real nearby venues. Hosted at:
`https://trillnjoy.github.io/Meet_Me_In_The_Middle/`

Repo: `trillnjoy/Meet_Me_In_The_Middle` — `main` branch is live production.

Primary use context: **LA/OC metro area**, with design generality for other
metro areas, coastal geographies, and eventually weekend destination planning.

---

## Current Architecture

**Files:** `index.html`, `manifest.json`, `sw.js`, `icons/icon-192.png`, `icons/icon-512.png`  
**No build step.** Vanilla HTML/CSS/JS. Edit and deploy directly.  
**Icons:** `icon-192.png` and `icon-512.png` live in repo **root**, not an `icons/` subfolder.
`manifest.json` and `index.html` both reference them as `"icon-192.png"` (no path prefix).

**Location search:** Nominatim geocoding — confirmed working in Safari from GitHub Pages.  
**Venue search:** Nominatim `?q=` keyword search bounded to a viewbox — working as of 2026-04-17.  
**Map:** Leaflet + OpenStreetMap tiles.  
**Midpoint calculation:** Currently geometric centroid — known inadequate, replacement planned (see Phase 1 below).

---

## What Works (as of 2026-04-17)

- GPS auto-detect for first friend slot on page load
- Location search with address-level precision (street, city, state)
- Autocomplete dropdown with full address sublabel for confirmation
- Avatar picker — emoji, color, camera/photo upload
- Friend name editing in location modal
- Venue cards rendering with fairness bar and travel time estimates
- Real Leaflet map with friend pins, midpoint marker, venue pins
- Group voting tab
- PWA installs to iOS home screen

---

## Known Issues / Active Bugs

- **Spa category returns HTTP 400** — `leisure=spa` is not a valid Nominatim
  standalone parameter. Workaround: exclude spa until Phase 1 routing
  implementation replaces the Nominatim venue search approach entirely.
- **Venue pins cluster near one friend, not midpoint** — Nominatim `bounded=1`
  does not strictly enforce the viewbox. Resolved by Phase 1 ORS integration.
- **Midpoint is geometric, not travel-time** — the current haversine centroid
  ignores road networks, coastlines, and actual navigability. A geometric
  midpoint between RPV and Dana Point lands in the Pacific Ocean. Resolved
  by Phase 1 ORS integration.
- **Contact import** — native `ContactsManager` API requires Apple entitlement
  not available to web apps. Not fixable without App Store distribution.
  Current behavior: Safari autofill on the name field is the practical
  equivalent. Documented as a known limitation, not a bug to chase.

---

## Architecture Decisions — Hard Won

- **Overpass API:** Confirmed failing in Safari from GitHub Pages — CORS issue
  with this origin. Do not attempt again without first verifying CORS headers
  from a real Safari session on the deployed domain.
- **Nominatim amenity= / leisure= as standalone params:** Returns HTTP 400.
  Use `?q=keyword` instead. Confirmed in production console 2026-04-17.
- **Geometric midpoint:** Inadequate for real-world use. Fails coastal
  scenarios, road network topology, and fairness when road distances diverge
  from straight-line distances. Replaced by ORS in Phase 1.
- **The `h()` DOM builder:** Must be defensive — check `c instanceof Node`
  before calling `appendChild`. Non-Node, non-string children (numbers,
  undefined) must be handled or silently dropped. TypeError at line 289 was
  caused by passing raw numbers/undefined as children.

---

## Roadmap

### Phase 1 — Next Session (requires ORS API key)

**OpenRouteService (ORS) integration**
- Free tier: 2,000 requests/day, no credit card required
- Sign up at openrouteservice.org
- ORS Matrix API: one request returns travel times from all friends to all
  candidate points — road-network aware, naturally land-constrained, ferry-
  aware where OSM ferry routes exist (Catalina Express, WA State Ferries, etc.)

**Implementation plan:**
1. Generate a grid of ~9 candidate points between friends
2. Single ORS Matrix API call — returns drive/walk/transit times for all
   friends to all candidates
3. Score each candidate by max travel-time deviation across friends
4. Present top 3–5 candidates as **named areas** (reverse-geocoded to
   neighborhood/city names) on a map — not just coordinates
5. Friends select or vote on preferred area
6. Only then search Nominatim venues within the chosen area

This resolves: ocean midpoints, desert hypotenuse problem, venue clustering
near one friend, and gives participants local-knowledge veto over undesirable
candidate areas (nobody wants their date night in Norwalk if Pasadena is
equally fair).

### Phase 2 — Near Term

- Candidate area desirability vote UI (before venue search)
- Venues searched within chosen area only, not a radius around geometric center
- Per-person travel mode (one drives, one takes transit)
- Spa category fix — either via ORS venue search or alternative data source

### Phase 3 — Roadmap

**Meetup Mode vs Weekend Destination Mode toggle**

| | Meetup Mode | Weekend Mode |
|---|---|---|
| Radius | ~15–30 min drive | 1–3 hours |
| Ferry routes | Incidental | Intentional |
| Venue types | Restaurants, bars, cafés | Hotels, attractions, experiences |
| Candidate areas | Local neighborhoods | Destination cities |

Weekend mode unlocks: Catalina Island, Avalon (historic destination, ferry
from Long Beach/San Pedro), coastal Long Beach to OC corridor for RPV/Dana
Point scenarios, Puget Sound crossings, Atlantic seaboard, Great Lakes.

Note: Avalon (Santa Catalina Island) is a specific known use case — Troy's
mother-in-law's family has a historic home there. Ferry travel time from
San Pedro/Long Beach should be surfaced as a valid travel mode when Catalina
appears as a candidate.

---

## Co-Developer Notes

- Troy is a Board Certified Clinical Informaticist and executive physician.
  He communicates vision and requirements; Claude implements and verifies.
  When Troy is debugging APIs or reading console errors across a room, the
  division of labor has broken down.
- Primary test device: iPhone, Safari, iOS WebKit. All API choices must be
  verified against WebKit CORS behavior, not just Chrome/desktop.
- Console debugging from iPhone requires Mac + cable + Web Inspector.
  This is not always available. Do not design a debugging workflow that
  depends on it.
- Diagnose and report before implementing. Wait for greenlight.
- Do not push code to GitHub that has not been verified or clearly labeled
  as unverified with explicit confidence level stated.
