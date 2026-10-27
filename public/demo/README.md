# CiteSight Pro Video — What we try to sell

**Based on competitor research Oct 2026:**

**Protex AI 2-min demo video structure (protex.ai/watch-demo):**
- Use cases for unsafe event capture
- Camera integration (existing CCTV RTSP, edge device handles processing on-site)
- Building custom safety rules
- Digesting event capture
- Reporting & Dashboards
- Event storyboard feature (top-right)
- Headline: "Proactive Safety Powered by AI" / "24/7 unsafe event capture, revolutionizing how enterprise EHS teams make proactive safety decisions" / "Site Intelligence for Smarter, Safer Operations"
- Customers: M&S, Americold
- Key quote: "Protex saves us a lot of time by automatically collecting unsafe observations. It has helped us..." / "We can go to a specific site and know which actions to drive home."

**Intenseye 2-min demo structure (intenseye.com):**
- 50+ high-risk hazards detected out of the box, real-time prevention before SIFs (Serious Injuries and Fatalities)
- See risks, prevent SIFs, 24/7 on every line and cooler, every shift
- ~0.8s to a machine stop at conveyor/auger
- Trusted by: Suntory, Swire, Coca-Cola, Oldcastle, APG, Huhtamaki, Heineken, Bridgestone, Mars, Caterpillar
- "Stop serious injuries before they happen" — computer vision AI to detect SIF precursors in real time, unsafe behaviors, hazardous conditions, worker-equipment interactions

**Voxel AI structure (voxel-ai.com):**
- 95%+ detection accuracy, trained on 5+ billion hours of real-world industrial workplace scenarios
- Privacy-first: no facial recognition, facial blurring, role-based access, hybrid cloud/on-prem
- End-to-End Site Intelligence: Connects detection with recommended actions, task ownership, follow-up, reporting
- 48h deployment on existing cameras, "Reduce safety risk in days, not years"

**CiteSight Pro Video — same structure but with Moat (page citation + geometry + $0.35/hr):**

**Script 90 seconds (not 2-min gated form):**
- 0:00 Upload any safety manual any length, Spark 1M compiles to DSL with page citations p87 §4.2, p112 §7.1, p203 §12.8 — Geo-ML pattern that won Best API (400-page reports → DSL → 3D models)
- 0:20 Zone annotation once: Draw lumber_yard p87, forklift_lane p112, station_3 p112 once. Click 2 points aisle width 3.2m → homography pixel→meter. Saves zones.json. SAM 3.1 on-demand once $0.0025, not per frame
- 0:35 Watch: SAM 3.1 + YOLOv8n-seg 6.7MB masks person green, saw red, zone yellow dashed. Rules run as geometry distance less than 1.5m measured, not VLM guess. 0 LLM calls/frame. 30fps. YOLO true.
- 0:50 Violation: Person within 0.8m of running saw, violates p87 §4.2, clip 14:03:10–15 (5 sec ffmpeg), severity HIGH, action stop + LOTO, Slack/SMS + S3 clip with page citation, Wonder writes incident.
- 1:00 Voice Q&A: Supervisor asks "What happened near saw around 2pm?" → Web Speech API + Whisper fallback → Wonder searches incidents by time+zone+page citation p87 p112 p203 + clips.
- 1:15 Cost table: VLM every 5 frames (2025 winner) 0.62/0.71 $4.20/hr no citation vs CiteSight 0.89/0.84 $0.35/hr Yes p87 + clip 12x more efficient vs SAM 3.1 every frame 0.92/0.90 $270/hr impossible vs Enterprise $100k/yr/site. Built for billion-dollar operations — Americold 77% injury ↓ $1.1M/yr, M&S 80% incidents ↓ 10 weeks, Heineken, Bridgestone, Mars, Coca-Cola.
- 1:30 CTA: Upload any manual → Draw zones once → Watch live with YOLO masks → Incident timeline + clips + Voice Q&A. Same pipeline for any manual any length 10 to 1000+ pages.

**Visual style (match Protex/Intenseye but pro):**
- Apple minimal white #FFFFFF, black #111, paper #F5F3EF, safety yellow #FFD60A accent only for incidents, not crowded, massive whitespace 128px top, 88px sections
- Video: aspect-video rounded 24px, autoPlay muted loop playsInline, poster /designs/hero-video-frame.html
- Top bar red/yellow/green dots, text safety_manual.pdf • Spark 1M • any length, right black pill COMPILING 1M TOKENS
- Left card: p86–p88 Moving Machinery, §4.2 Personnel shall not be within 1.5 m of running saw, chip → p87 §4.2 → R-04.2 • distance
- Right video card: LIVE • workshop_cam_03 • SAM 3.1 • $0.35/hr, YOLO true yellow badge, masks green person red saw, distance dashed line 0.8m < 1.5m violation, incident card R-04.2 • p87 §4.2 HIGH, Person within 0.8 m... Clip 14:03:10–15, VIEW CLIP → PAGE p87
- Bottom bar: Any length • 10 to 1000+ pages • 1M tokens • 2.3s • Geo-ML pattern, right black pill 117 rules • page citation

**Files:**
- public/designs/hero-video-frame.html — static frame
- public/demo/citesight-demo.mp4 — TODO: record via screen capture or generate via Remotion/Runway
- public/demo/citesight-demo.webm — TODO
- Hero video element in app/page.tsx uses aspect-video + autoPlay muted loop playsInline + poster + sources + fallback download link for pro video what we sell: rulebook → DSL p87 → SAM geometry → incident clip p87

See WORKFLOW.md Mermaid end-to-end + PLAN.md + SAM_COST_ANALYSIS.md + COMPARISON.md + PRESENTATION_WORKFLOW.md 213 lines
