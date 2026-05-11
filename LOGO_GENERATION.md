# Logo Generation Process

## Overview

The logo generation feature is a 3-step AI pipeline that takes brand data collected from the user across two form steps and produces a custom logo image.

---

## Architecture

```
User (Step 1 + Step 2 form)
        │
        ▼
  LogoGeneratorStep.tsx
        │
        ├── Step A: Groq API (LLM)
        │     └── Generates English image prompt from brand data
        │
        ├── Step B: Backend Proxy
        │     └── GET /api/proxy/image?url=...
        │           └── Node.js fetches from Pollinations server-side
        │
        └── Step C: Display + Save
              ├── Blob URL shown in <img>
              ├── Saved to DB via POST /api/project/save-logo
              └── Persisted in localStorage (brandingSlice)
```

---

## Step A — Prompt Generation (Groq)

**Endpoint:** `POST https://api.groq.com/openai/v1/chat/completions`  
**Model:** `llama-3.3-70b-versatile`  
**Timeout:** 15 seconds

The frontend collects the following brand data from the user:

| Field               | Source                                                           |
| ------------------- | ---------------------------------------------------------------- |
| Brand name          | Step 1 input                                                     |
| Tagline             | Step 1 input                                                     |
| Business type       | Step 1 input                                                     |
| Target audience     | Step 1 selection (شباب / أطفال / رجال أعمال / عامة الناس)        |
| Brand spirit (vibe) | Step 2 selection (احترافي / مرح وحيوي / فاخر وراقي / بسيط وعصري) |
| Logo style          | Step 2 selection (أيقونة ورمز / اسم بخط مميز / ميكس)             |
| Color palette       | Step 2 selection (تراث أسيوط / نيل هادئ / شمس الصعيد / AI)       |
| Symbol hint         | Step 1 optional input                                            |

These are sent to Groq with this system prompt:

> "You are a professional logo designer. Given brand data, output ONLY a concise English image-generation prompt (max 20 words) for a logo. You MUST include the exact brand name from the input in your prompt. No explanation, no quotes, just the prompt."

**Example output:**

```
Kareem store logo with navy blue and gold key icon, professional combination mark
```

**Environment variable required:**

```
VITE_GROQ_API_KEY=gsk_...
```

---

## Step B — Image Generation (Pollinations via Backend Proxy)

### Why a proxy?

Pollinations returns **HTTP 403** when `fetch()` is called directly from the browser (localhost dev environment). It only allows native `<img src>` browser requests or server-side requests.

To get full control over the timeout (300 seconds) and receive the image as a blob, the backend acts as a proxy.

### Proxy endpoint

**Backend route:** `GET /api/proxy/image?url=<encoded_pollinations_url>`  
**File:** `PPIS_Graduation_Backend/src/routes/proxy.routes.js`

The backend:

1. Validates the URL is from `pollinations.ai`
2. Fetches the image using Node's `https` module
3. Follows redirects (Pollinations redirects once before serving)
4. Pipes the image bytes back to the frontend
5. Sets `Cache-Control: public, max-age=86400`

### Pollinations URL format

```
https://image.pollinations.ai/prompt/{encodedPrompt}
  ?model=turbo
  &width=512
  &height=512
  &nologo=true
  &seed={randomSeed}
```

- **model=turbo** — faster generation (~5-15s) vs flux (~20-40s)
- **seed** — random number (0–99999) to avoid cached failed responses
- **nologo** — removes Pollinations watermark

### Frontend fetch

```ts
const proxyUrl = `${VITE_API_BASE_URL}/proxy/image?url=${encodeURIComponent(pollinationsUrl)}`;
const res = await fetch(proxyUrl, { signal: abortController.signal }); // 300s timeout
const blob = await res.blob();
const objectUrl = URL.createObjectURL(blob);
```

The blob URL is revoked on component unmount or regeneration to avoid memory leaks.

---

## Step C — Display & Persistence

### Display

The generated blob URL is set as the `src` of an `<img>` tag. Since it's a local blob URL, there are no CORS issues and the download button works directly.

### Save to database

When the image loads successfully, `onLogoDone(url, prompt)` is called, which dispatches `saveLogo` to the Redux store:

**Endpoint:** `POST /api/project/save-logo`  
**Auth:** Bearer token required  
**Body:**

```json
{
  "projectId": "...",
  "logoUrl": "blob:http://...",
  "logoPrompt": "Kareem store logo with navy blue and gold key icon"
}
```

The backend saves `logoUrl` and `logoPrompt` fields on the `Project` model.

### Local persistence

The branding data is also saved to `localStorage` under the key `ideaTechBrandingData`:

```json
{
  "logoUrl": "...",
  "logoPrompt": "...",
  "brandName": "",
  "tagline": "..."
}
```

This allows the page to restore the saved logo immediately on return without re-generating.

---

## State Machine (Phase)

The component uses a discriminated union to track generation state:

```ts
type Phase =
  | { kind: "idle" } // not started
  | { kind: "groq" } // calling Groq API
  | { kind: "image" } // fetching from Pollinations via proxy
  | { kind: "done"; url: string; prompt: string } // success
  | { kind: "error"; msg: string }; // failed
```

---

## Error Handling

| Scenario              | Behavior                                    |
| --------------------- | ------------------------------------------- |
| Groq API key missing  | Throws immediately with config error        |
| Groq timeout (>15s)   | AbortController cancels, shows error        |
| Groq non-200 response | Shows HTTP status + response body           |
| Proxy timeout (>300s) | AbortController cancels, shows Arabic error |
| Proxy non-200         | Shows HTTP status from backend              |
| Pollinations down     | Backend returns 502, shown to user          |

---

## Environment Variables

| Variable            | Location                        | Description                                             |
| ------------------- | ------------------------------- | ------------------------------------------------------- |
| `VITE_GROQ_API_KEY` | `PPIS-Graduation_frontend/.env` | Groq API key from console.groq.com                      |
| `VITE_API_BASE_URL` | `PPIS-Graduation_frontend/.env` | Backend base URL (default: `http://localhost:8090/api`) |

---

## Files Involved

| File                                                            | Role                                                 |
| --------------------------------------------------------------- | ---------------------------------------------------- |
| `src/components/branding/LogoGeneratorStep.tsx`                 | Main component — orchestrates the full pipeline      |
| `src/components/branding/BrandingWizardContent.tsx`             | Parent form — collects brand data across steps 1 & 2 |
| `src/pages/BrandingWizard.tsx`                                  | Page — lifts state, handles save/start-over          |
| `src/store/slices/brandingSlice.ts`                             | Redux slice — saves logo to DB and localStorage      |
| `PPIS_Graduation_Backend/src/routes/proxy.routes.js`            | Backend proxy — fetches Pollinations server-side     |
| `PPIS_Graduation_Backend/src/controllers/project.controller.js` | `saveLogo` controller                                |
| `PPIS_Graduation_Backend/src/models/project.js`                 | `logoUrl` + `logoPrompt` fields on Project model     |
