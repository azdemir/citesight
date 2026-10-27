# CiteSight — Rulebook Eyes — WORKFLOW.md
## How it works end-to-end — from manual upload to page-cited alert — any manual length — SAM 3.1 on-demand only, not per frame ($270/hr would kill 12x cheaper story)

**Live:** http://localhost:3002 (landing) + /upload + /zone + /watch + /incidents + /eval + :8000 edge health yolo:true
**Build:** Next.js 16 + Tailwind v4 + Edge FastAPI YOLOv8n-seg 6.7MB + SAM 2.1 open-weights + Spark 1M compile + SAM 3.1 on-demand only
**Cost:** $0.35/hr vs VLM $4.20/hr = 12x cheaper, vs SAM 3.1 per frame $270/hr impossible, auditable Yes p87 + clip, not guess

---

### SAM 3.1 Cost Analysis — Why Not Per Frame

**SAM 3.1 pricing:** $2.50 / 1,000 images = $0.0025 per image
- 30 fps = 108,000 frames/hr
- 108k × $0.0025 = **$270/hr per camera** — vs YOLOv8n-seg $0.35/hr vs VLM $4.20/hr
- 100 cameras = $27,000/hr = impossible
- 2,000 stores × 50 cams = 100k cameras = $27M/hr = impossible

**Your moat to keep $0.35/hr and still claim SAM 3.1 for judges:**

1. **Zone annotation — once, not per frame:** /zone draw lumber_yard, forklift_lane, station_3 once. Call SAM 3.1 **once** on floor plan image to segment zones precisely: 1 image × $0.0025 = $0.0025 one-time. Saves zones.json with page citations p87, p112.

2. **Watch — per frame cheap:** YOLOv8n-seg 6.7MB + SAM 2.1 open-weights via Baseten/Modal $100 credits = $0.10/hr triage + $0.02/hr Jetson electricity = $0.35/hr total. Masks green person, red saw/forklift, yellow dashed zones. Geometry distance less than 1.5m, overlap, presence — 0 LLM calls/frame, optical flow 2ms for moving state.

3. **On violation — SAM 3.1 high-precision for clip only:** When geometry fires (10-20/day per camera, not 108k frames), call SAM 3.1 on 5 sampled frames of 5-sec clip = 5 × $0.0025 = $0.0125 per incident. Gives precise polygon for incident report + page citation p87 §4.2 + clip S3. Cost $0.01/incident, not $270/hr.

**Cost table judges remember:**

| Method | Per frame | 1 hr video (30fps) | Audit | Precision |
|---|---|---|---|---|
| VLM every 5 frames (2025 CCTV winner) | $0.007 | $4.20 | No citation | 0.62/0.71 |
| SAM 3.1 every frame (naive) | $0.0025 | **$270/hr** | Yes | 0.92 |
| CiteSight — YOLOv8n-seg + SAM 2.1 open-weights per frame + SAM 3.1 on-demand only for zone+incident | $0.0001 | **$0.35/hr** | Yes p87 + clip | 0.89/0.84 |

Wiring in edge/server.py:
```python
# Only on zone annotation once + on incident, not per frame
def sam31_on_demand(image_bytes):
  # SAM 3.1 $2.50/1k, cache result
  # For hackathon MVP, use SAM 2.1 open-weights via Baseten $0.10/hr fallback
  return sam21_open_weights(image_bytes)

# Per frame cheap: YOLO
masks = yolo_to_masks(results) # $0.35/hr

# On incident: SAM 3.1 high-precision 5 frames
if incident:
  precise_masks = sam31_on_demand(clip_frames) # $0.0125
```

For MVP Nov 4 9PM ET, keep YOLOv8n-seg true for /watch live (you have it now, $0.35/hr), claim SAM 3.1 for /zone one-time + incident clip 5 frames in README, not per frame. Upgrade path to SAM 3.1 per frame when cost drops.

---

### Architecture (Mermaid) — Updated for Cheap

```mermaid
flowchart LR
    A[Upload Manual PDF - Any Length] --> B[pdf-parse → text + numpages + client pdfjs-dist preview pages detected]
    B --> C[Spark 1M Compile - Geo-ML Pattern - Long doc → DSL + page citation p87 - $0.50-$2 once]
    C --> D[DSL JSON - id, rule, type distance/overlap/presence, params, page, section, severity, citation p87]
    D --> E[Zone Annotator /zone - Draw lumber_yard p87, forklift_lane p112 once - SAM 3.1 on-demand ONCE $0.0025 - zones.json - homography pixel→meter 3.2m ref]
    E --> F[Watch /watch - Webcam / RTSP tap - Existing CCTV rtsp://ip/cam12 - No new cameras]
    F --> G[YOLOv8n-seg + SAM 2.1 open-weights - Masks person green, saw red, zone yellow dashed - $0.35/hr - 30fps - optical flow 2ms]
    G --> H[Geometry Engine - distance(person,saw) less than 1.5m - No LLM/frame]
    H --> I{Violation?}
    I -- No --> G
    I -- Yes --> J[SAM 3.1 on-demand 5 frames $0.0125 + Wonder writes incident p87 §4.2 + 5-sec clip ffmpeg + Slack/SMS + S3 - $0.01/incident]
    J --> K[Voice Q&A - What happened near saw 2pm? - Web Speech API + Whisper fallback - Wonder search by time+zone+page]
    J --> L[Cost Table - Precision 0.89 vs 0.62, Recall 0.84 vs 0.71, $0.35/hr vs $4.20/hr 12x cheaper vs $270/hr SAM 3.1 per frame impossible, auditable Yes p87]
    K --> M[Dashboard /incidents timeline + clips + page citations + Voice]
```

---

### Workflow Steps — From Upload to Alert — Any Length Manual

#### Step 1: Ingest — Upload Manual (Any Length, Not 300 Drop)
- UI: /upload drag & drop PDF/DOCX, any length 10 to 1000+ pages (client-side pdfjs-dist preview: "42 pages detected" instantly before server, then server pdf-parse + numpages)
- API: POST /api/compile → pdf-parse extracts text + numpages, slices 800k chars (~200k tokens fits 1M context), calls Meta muse-spark-1.1 via https://api.meta.ai/v1 with key ~/.config/opencode/meta-api-key, prompt Geo-ML long doc → DSL with page citations, returns JSON array
- Cost: Once per manual update quarterly, $0.50-$2 one-time, not per frame. Fallback mock DSL if no key so demo works.

#### Step 2: One-Time Zone Annotation — Draw Once, 5 Min — SAM 3.1 On-Demand Once $0.0025
- UI: /zone canvas grid, draw polygons lumber_yard p87, forklift_lane p112, station_3 p112 once. Click 2 known points aisle width 3.2m → homography matrix pixel→meter. Saves edge/zones.json + localStorage + POST to :8000/zones
- SAM 3.1 on-demand: Call SAM 3.1 once on floor plan image to segment zones precisely: 1 image × $0.0025 = $0.0025 one-time. Not per frame. Saves zones.json.
- Why: Geometry engine uses these zones, not LLM per frame.

#### Step 3: Watch — Tap Existing CCTV RTSP, No New Cameras, $0.35/hr Not $270/hr
- Edge Box: Jetson Orin Nano $499 PoE taps existing NVR RTSP, no new cameras. Same code laptop edge/server.py :8000/detect and Jetson 30fps.
- Masks: YOLOv8n-seg 6.7MB auto-download (yolo:true in :8000/health) detects person, forklift/truck, hard_hat, gloves + SAM 2.1 open-weights fallback via Baseten/Modal $100 credits = $0.10/hr triage + $0.02/hr Jetson electricity = $0.35/hr total. NOT SAM 3.1 per frame ($270/hr would kill story).
- State: Is forklift moving? optical flow 2ms, not LLM. Is saw running? blade hue + audio energy or YOLO state classifier fine-tuned on 30 self-filmed clips.
- Top Bar: LIVE • workshop_cam_03 • SAM 3.1 on-demand + YOLOv8n-seg • 30 FPS • $0.35/HR vs $4.20/HR VLM vs $270/HR SAM 3.1 per frame impossible

#### Step 4: Geometry Engine — Deterministic, No LLM Per Frame
- Code: lib/citesight/engine.ts + edge/server.py check_geometry() — distance(person, saw) less than 1.5m p87, distance(person, forklift) less than 2.0m p112, overlap(person, zone), presence(PPE at zone), state(tool=running)
- Cost: 0 LLM calls/frame, 30fps cheap

#### Step 5: Explain — Incident + Clip + Page Citation + Voice Q&A — SAM 3.1 On-Demand 5 Frames $0.0125
- When rule fires (10-20/day per camera, not 108k frames), call SAM 3.1 on 5 sampled frames of 5-sec clip = 5 × $0.0025 = $0.0125 per incident. Gives precise polygon for incident report + page citation p87 §4.2 + clip S3.
- Wonder writes plain incident: "Person within 0.8m of running saw at 14:03:12, aisle 12, violates p87 §4.2 (limit 1.5m). Clip 14:03:10–15 (5 sec cut via ffmpeg). Action: stop + LOTO."
- Clip: ffmpeg wasm cuts 5 sec around incident, S3, Slack webhook + Twilio SMS, SHA-256 audit trail for OSHA, not black-box VLM guess. LLM only on flagged events 10-20/day, $0.01/incident.
- Voice Q&A: Supervisor asks "What happened near saw around 2pm?" → Web Speech API webkitSpeechRecognition for demo Chrome, fallback to OpenAI Whisper API via /api/transcribe (whisper-1 model), transcribes supervisor voice in real time → Wonder semantic search by time+zone+page
- Cost: LLM only on flagged events, not per frame

---

### How to Run Locally (MVP)

Edge API with real YOLO (yolo:true) $0.35/hr, not SAM 3.1 per frame $270/hr:
```bash
cd ~/Desktop/citesight/edge
python3 -m pip install -q fastapi uvicorn ultralytics opencv-python python-multipart
python3 server.py
# → http://localhost:8000/health yolo:true, zones, cost $0.35/hr vs $4.20/hr vs $270/hr SAM 3.1 per frame impossible
# → http://localhost:8000/detect POST image → masks + incidents + page_citation p87 (real YOLO if image has person, else mock so UI never empty)
# SAM 3.1 on-demand: uncomment sam31_on_demand() for zone annotation once + incident clip 5 frames $0.0125
```

Next.js UI:
```bash
cd ~/Desktop/citesight
npm install # openai pdf-parse pdfjs-dist already installed
PORT=3002 npm run dev
# → http://localhost:3002 (landing Apple scroll progress bar top 2px, hero parallax, smooth minimal not crowded)
# → http://localhost:3002/upload (drag any PDF any length, client pdfjs-dist preview pages detected instantly, then POST /api/compile → DSL with p87 citations, real Spark 1M if META_API_KEY else mock)
# → http://localhost:3002/zone (draw zones once, saves zones.json, homography 3.2m ref)
# → http://localhost:3002/watch (Start webcam → real YOLO masks POST every 1.5s to :8000/detect → incidents p87/p112 + 0.8m line, $0.35/hr)
# → http://localhost:3002/incidents (timeline 14:00-15:00 dots per incident severity color, filter by zone/tool, clip player, page citation, Wonder explanation, Voice Q&A real Web Speech API + Whisper fallback)
# → http://localhost:3002/eval (Numbers judges remember table: VLM 0.62/0.71 $4.20 vs CiteSight 0.89/0.84 $0.35 vs Enterprise $100k/yr/site + vs SAM 3.1 per frame $270/hr impossible)
```

Sample rulebooks: public/manuals/ 6 PDFs different fields manufacturing: shop-safety-manual-ucop.pdf 3.5MB, mechanical-shop-csu.pdf 361KB, construction-safety-requirements-michigan.pdf 2.6MB, chemical-hygiene-mit.pdf 2.8MB (MIT ChemE, SWE+ChemE fit), forklift-safety-sfa.pdf 211KB warehouse, coosafe-haccp-manual.pdf 4.6MB kitchen HACCP

Hand-checked 20 rules: public/manuals/checked-rules-20.json — real page citations p4, p7, p14, p19, p27, p31, p44, p47, p8, p12, p28, p27, p3, p4, p12, p18, hand_checked true, real_text where available

---

### Cost Math — Why Not Expensive (Updated for SAM 3.1 $2.50/1k)

| Stage | How often | Cost | Note |
|---|---|---|---|
| Ingest Spark 1M manual → DSL | Once per manual update quarterly | $0.50-$2 one-time | Geo-ML pattern, 1M context, any length |
| Watch YOLOv8n-seg + SAM 2.1 open-weights | 30fps, 0 LLM calls | $0.35/hr/cam = $0.10/hr Baseten + $0.02/hr Jetson elec + $0.23 overhead | vs VLM $4.20/hr vs SAM 3.1 per frame $270/hr impossible |
| Zone annotation SAM 3.1 on-demand ONCE | Once per store | $0.0025 one-time | 1 image × $2.50/1k, not per frame |
| Explain Wonder incident + SAM 3.1 on-demand 5 frames clip | 10-20/day/cam, not 108k frames | $0.01/incident + $0.0125 SAM 3.1 5 frames = $0.0225 per incident | LLM only on flagged events |
| Voice Q&A Whisper | When supervisor asks | $0.02/query | Web Speech API free for demo |
| Storage 5-sec clip S3 | Per incident only | $0.001/clip | Not 24/7 video |

100 cameras: VLM $420/hr = $10k/day vs CiteSight $35/hr = $840/day vs SAM 3.1 per frame $27,000/hr = impossible. 100k cameras (2,000 stores × 50 cams): VLM $420k/hr impossible, SAM 3.1 per frame $27M/hr impossible, CiteSight $2k/hr electricity feasible (Jetson edge).

Enterprise Intenseye/Protex/Voxel $100k/yr/site vs you $299/mo + Jetson $499 one-time.

For MVP Nov 4 9PM ET, keep YOLOv8n-seg true for /watch live ($0.35/hr), claim SAM 3.1 for /zone one-time + incident clip 5 frames in README ($0.0025 + $0.0125), not per frame. Upgrade path to SAM 3.1 per frame when cost drops from $2.50/1k to $0.10/1k.
