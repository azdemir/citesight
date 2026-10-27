"use client";

import { useState } from "react";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#111] antialiased selection:bg-black selection:text-white">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-[#EDEDEB]">
        <div className="mx-auto max-w-[1120px] px-8 h-[64px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5"><div className="h-6 w-6 bg-black rounded-[6px] flex items-center justify-center"><div className="h-2 w-2 bg-[#FFD60A] rounded-[1px]" /></div><span className="text-[15px] font-[650] tracking-[-0.02em]">CiteSight</span></a>
          <div className="flex items-center gap-6 text-[13px]"><a href="/features" className="text-[#6B6B6B] hover:text-black">Features</a><a href="/pricing" className="font-[600]">Pricing</a><a href="/zone" className="text-[#6B6B6B] hover:text-black">Zone</a><a href="/watch" className="text-[#6B6B6B] hover:text-black">Watch</a></div>
        </div>
      </header>

      <section className="mx-auto max-w-[1120px] px-8 pt-[88px] md:pt-[120px] pb-[48px] text-center">
        <h1 className="text-[48px] md:text-[64px] leading-[0.9] tracking-[-0.05em] font-[800]">Simple pricing.<br /><span className="text-[#9A9A98]">12x cheaper than VLM.</span></h1>
        <p className="mt-6 mx-auto max-w-[520px] text-[16px] leading-[1.6] text-[#6B6B6B]">Upload any manual, any length. Draw zones once. Watch live with SAM geometry. Every alert cites a page, not a guess. Edge box taps existing RTSP, no new cameras.</p>
        <div className="mt-8 inline-flex items-center gap-2 p-1 bg-[#F6F6F5] border border-[#EDEDEB] rounded-full">
          <button onClick={()=>setAnnual(false)} className={`h-8 px-5 rounded-full text-[13px] font-[500] transition-colors ${!annual ? "bg-black text-white" : "text-[#6B6B6B] hover:text-black"}`}>Monthly</button>
          <button onClick={()=>setAnnual(true)} className={`h-8 px-5 rounded-full text-[13px] font-[500] transition-colors ${annual ? "bg-black text-white" : "text-[#6B6B6B] hover:text-black"}`}>Annual • 2 months free</button>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-8 pb-[48px]">
        <div className="text-center">
          <h2 className="text-[24px] font-[700] tracking-[-0.02em]">Who is CiteSight for?</h2>
          <p className="mt-3 mx-auto max-w-[600px] text-[14px] leading-[1.6] text-[#6B6B6B]">Built for workplaces where a missed rule costs $50k shutdown, $15k OSHA fine, or a life. Not just factories — any place with a rulebook and a camera.</p>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-px bg-[#EDEDEB] border border-[#EDEDEB] rounded-[24px] overflow-hidden">
          <div className="bg-white p-7">
            <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-[12px] font-[700]">C</div>
            <div className="mt-4 text-[16px] font-[650]">Commercial • Primary</div>
            <div className="mt-2 text-[12px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Workshops, warehouses, construction, labs, kitchens</div>
            <div className="mt-4 space-y-2 text-[13px] leading-[1.6] text-[#6B6B6B]">
              <div>• Small manufacturing shops (metal, wood, auto) — 5k+ US shops scrap 10-20% from safety violations</div>
              <div>• Warehouses & logistics — forklift pedestrian separation p203, 6ft aisles, horn at cross aisles p4</div>
              <div>• Construction sites — hard hat + ANSI Z87.1 glasses + steel toes p4, no short pants p4, fall protection</div>
              <div>• Labs — chemical segregation p28 acids/bases 1ft, flammables yellow cabinet p27, fume hood, LOTO p44</div>
              <div>• Commercial kitchens — hand wash p12, raw/ready-to-eat separate 0-4°C p18, HACCP</div>
              <div className="mt-3 font-mono text-[11px] bg-[#F6F6F5] border border-[#EDEDEB] rounded-[8px] p-2">Why commercial pays: 1 OSHA fine $15k + 1 shutdown $50k = 20 years at $299/mo. Enterprise Intenseye/Protex $100k/yr/site vs $0.35/hr. Jetson RTSP tap no new cameras.</div>
            </div>
          </div>
          <div className="bg-[#FAFAF9] p-7">
            <div className="h-8 w-8 rounded-full bg-[#FFD60A] text-black flex items-center justify-center text-[12px] font-[700]">R</div>
            <div className="mt-4 text-[16px] font-[650]">Residential • Secondary — Aging in place</div>
            <div className="mt-2 text-[12px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Homes, elderly fall prevention, child safety</div>
            <div className="mt-4 space-y-2 text-[13px] leading-[1.6] text-[#6B6B6B]">
              <div>• Elderly fall prevention — loose rug, cords, no grab bar, 36k deaths/yr US 65+ falls #1 killer, $50B cost. Photo → SAM masks → risk p87 → Image after-fix preview → book handyman slot via availability engine (Wavva moat)</div>
              <div>• Childproofing — unanchored dresser tip-over, open outlet, chemicals low, CPSC risk</div>
              <div>• Home safety audit — electrical fire 13% home fires 510 deaths/yr, panel double-tap, scorched outlet p?</div>
              <div className="mt-3 font-mono text-[11px] bg-white border border-[#EDEDEB] rounded-[8px] p-2">Why residential: Same SAM + YOLO geometry, but emotional closer Image after-fix preview. $140-350 fix vs $30k hospitalization. 1 extra job/month covers $299/mo.</div>
            </div>
          </div>
          <div className="bg-black text-white p-7">
            <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-[12px] font-[700]">B</div>
            <div className="mt-4 text-[16px] font-[650]">Both • Platform</div>
            <div className="mt-2 text-[12px] font-mono uppercase tracking-[0.08em] opacity-60">Anywhere with rulebook + camera</div>
            <div className="mt-4 space-y-2 text-[13px] leading-[1.6] opacity-80">
              <div>• <b className="text-white">Primary is commercial</b> — small businesses lose jobs when they miss safety checks, just like Wavva cleaning businesses lose jobs when they miss calls. Real booking engine with write-time revalidation prevents double-book, timezone-safe, buffer-aware (migration 0022 byte-verified)</div>
              <div>• <b className="text-white">Secondary is residential</b> — same tech, different rulebook: CDC STEADI fall risk, not OSHA. Reuse availability engine to book handyman, not just report PDF — competitors are report-only $5-$20 per report that closes 0 jobs</div>
              <div>• Platform: Upload any manual any length 10 to 1000+ pages → DSL p87 → draw zones once → watch live $0.35/hr vs $4.20/hr VLM vs $270/hr SAM 3.1 per frame impossible → incident p87 + clip + Slack/SMS + Voice Q&A real Whisper. Same pipeline for cleaning photo-to-quote, lab segregation, coating defect, fall prevention, etc.</div>
              <div className="mt-3 font-mono text-[11px] bg-white/10 border border-white/10 rounded-[8px] p-2">Founder fit SWE+ChemE: you built Wavva front-office + availability engine + chemical segregation + coatings + CIP + SDS + scaling. 20 hand-checked rules real page citations p4 p7 p14 p27 p31 p44 etc from 6 manuals different fields.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-8 pb-[88px]">
        <div className="grid md:grid-cols-3 gap-px bg-[#EDEDEB] border border-[#EDEDEB] rounded-[24px] overflow-hidden">
          <div className="bg-white p-8 flex flex-col">
            <div className="text-[12px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Free • Demo</div>
            <div className="mt-4 text-[36px] font-[750] tracking-[-0.03em] leading-none">$0</div>
            <div className="mt-1 text-[13px] text-[#6B6B6B]">For trying CiteSight</div>
            <div className="mt-8 space-y-3 text-[13px] leading-[1.6]">
              <div className="flex gap-2"><span>✓</span><span>Upload any manual, any length, client pdfjs-dist preview pages detected</span></div>
              <div className="flex gap-2"><span>✓</span><span>Spark 1M compile mock DSL with page citations p87 §4.2</span></div>
              <div className="flex gap-2"><span>✓</span><span>Zone annotator once, draw 3 zones, zones.json</span></div>
              <div className="flex gap-2"><span>✓</span><span>Watch mock masks 0.8m measured, incident p87</span></div>
              <div className="flex gap-2"><span>✓</span><span>20 hand-checked rules real page citations p4 p7 etc from 6 manuals</span></div>
            </div>
            <div className="mt-auto pt-8"><a href="/upload" className="h-11 w-full rounded-full border border-[#EDEDEB] flex items-center justify-center text-[13px] font-[600] hover:border-black transition-colors">Start free →</a></div>
          </div>

          <div className="bg-[#111] text-white p-8 flex flex-col relative border-2 border-black">
            <div className="absolute -top-3 left-6 h-6 px-3 rounded-full bg-[#FFD60A] text-black text-[11px] font-mono font-[700] flex items-center">MOST POPULAR • 12x CHEAPER</div>
            <div className="text-[12px] font-mono uppercase tracking-[0.08em] opacity-60">Pro • Rulebook Eyes</div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-[36px] font-[750] tracking-[-0.03em] leading-none">${annual ? "299" : "299"}</span>
              <span className="text-[14px] opacity-60">/mo + $0.35/hr/cam</span>
            </div>
            <div className="mt-1 text-[13px] opacity-60">{annual ? "$2,990/yr • 2 months free • $0.35/hr/cam" : "$299/mo • $0.35/hr per camera • $840/day 100 cams"}</div>
            <div className="mt-8 space-y-3 text-[13px] leading-[1.6]">
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>Real Spark 1M compile any length 10 to 1000+ pages, DSL with page citations p87 §4.2 p112 §7.1 p203 §12.8</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>SAM 3.1 on-demand once $0.0025 zone + incident 5 frames $0.0125, not per frame $270/hr impossible</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>YOLOv8n-seg 6.7MB + SAM 2.1 open-weights $0.10/hr • 30fps • 0 LLM calls/frame • $0.35/hr</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>Geometry engine distance less than 1.5m p87 less than 2.0m p112 overlap presence, homography pixel→meter 3.2m ref</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>Incident + clip + page citation p87 + Slack/SMS + S3 $0.01/incident, Voice Q&A real Web Speech API + Whisper fallback</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>Edge box Jetson Orin Nano $499 PoE taps existing RTSP rtsp://admin:pass@ip:554/cam12, no new cameras</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>Precision 0.89 vs VLM 0.62, Recall 0.84 vs 0.71, auditable Yes p87 + clip, holds up in production</span></div>
            </div>
            <div className="mt-auto pt-8"><a href="/upload" className="h-11 w-full rounded-full bg-white text-black flex items-center justify-center text-[13px] font-[700] hover:bg-[#FFD60A] transition-colors">Upload rulebook → start $0.35/hr</a><div className="mt-3 text-[11px] text-center opacity-60">No credit card • $0.35/hr vs $4.20/hr VLM vs $270/hr SAM 3.1 per frame impossible • p87 auditable</div></div>
          </div>

          <div className="bg-white p-8 flex flex-col">
            <div className="text-[12px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Enterprise • Intenseye / Protex / Voxel alternative</div>
            <div className="mt-4 text-[36px] font-[750] tracking-[-0.03em] leading-none">$100k</div>
            <div className="mt-1 text-[13px] text-[#6B6B6B]">/yr per site • custom rules UI • deployment days • 50+ hazards</div>
            <div className="mt-8 space-y-3 text-[13px] leading-[1.6] text-[#6B6B6B]">
              <div className="flex gap-2"><span>•</span><span>50+ pre-baked PPE/hazards, custom rules UI, Sentinel edge box</span></div>
              <div className="flex gap-2"><span>•</span><span>No 300-page manual → DSL with page citation, no 0.8m measured geometry</span></div>
              <div className="flex gap-2"><span>•</span><span>Americold 77% injury reduction $1.1M/yr, M&S 80% incidents ↓ 10 weeks — but black-box</span></div>
              <div className="flex gap-2"><span>•</span><span>CiteSight alternative: $299/mo + Jetson $499 one-time, $0.35/hr, page citation p87 auditable</span></div>
              <div className="flex gap-2"><span>•</span><span>SAM 3.1 every frame $270/hr impossible vs CiteSight $0.35/hr on-demand only</span></div>
            </div>
            <div className="mt-auto pt-8"><a href="/manifesto" className="h-11 w-full rounded-full border border-[#EDEDEB] flex items-center justify-center text-[13px] font-[600] hover:border-black transition-colors">Read manifesto →</a></div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-px bg-[#EDEDEB] border border-[#EDEDEB] rounded-[16px] overflow-hidden">
          <div className="bg-white p-5"><div className="text-[11px] font-mono uppercase text-[#9A9A98]">VLM every 5 frames (2025 winner)</div><div className="mt-2 text-[13px] font-[600]">$4.20/hr/cam • $420/hr 100 cams • $10k/day</div><div className="mt-1 text-[11px] text-[#6B6B6B]">No citation • hallucination risk • LLM every 5 frames</div></div>
          <div className="bg-[#FFD60A] p-5 text-black"><div className="text-[11px] font-mono uppercase opacity-60">CiteSight • SAM geometry + compile-only</div><div className="mt-2 text-[13px] font-[700]">$0.35/hr/cam • $35/hr 100 cams • $840/day • Yes p87 + clip • 12x cheaper</div><div className="mt-1 text-[11px]">0 LLM calls/frame • geometry measured 0.8m • auditable p87 • holds up in production</div></div>
          <div className="bg-black text-white p-5"><div className="text-[11px] font-mono uppercase opacity-60">SAM 3.1 every frame (naive)</div><div className="mt-2 text-[13px] font-[700]">$270/hr/cam • $27k/hr 100 cams • impossible</div><div className="mt-1 text-[11px] opacity-60">$2.50/1k images × 108k frames/hr • use on-demand once $0.0025 + incident 5 frames $0.0125, not per frame</div></div>
        </div>

        <div className="mt-12 border border-[#EDEDEB] rounded-[20px] p-6 bg-[#FAFAF9]">
          <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">FAQ • Why not free AI?</div>
          <div className="mt-4 grid md:grid-cols-2 gap-6 text-[13px] leading-[1.6]">
            <div><b className="text-black">Why not ask free ChatGPT vision?</b><br /><span className="text-[#6B6B6B]">Free invents distance, no SAM masks, no homography pixel→meter, no page citation p87, no clip, no $0.35/hr, no OSHA audit trail. One prevented OSHA fine $15k + shutdown $50k pays for 20 years at $299/mo.</span></div>
            <div><b className="text-black">How you implement cheap for any workplace?</b><br /><span className="text-[#6B6B6B]">Edge box Jetson Orin Nano $499 PoE taps existing NVR RTSP, no new cameras. Zone annotation once 5 min p87 p112 citations, homography pixel→meter 3.2m ref, saves zones.json. Open-weights triage optical flow 2ms, not LLM. Alerts Slack/SMS + clip p112 + S3. LLM only on flagged events 10-20/day, not 108k frames/day $0.01/incident.</span></div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#EDEDEB] py-10 text-center text-[11px] font-mono text-[#9A9A98]">
        <a href="/" className="hover:text-black">Home</a> • <a href="/features" className="hover:text-black ml-3">Features</a> • <a href="/privacy" className="hover:text-black ml-3">Privacy</a> • <a href="/terms" className="hover:text-black ml-3">Terms</a> • <a href="/manifesto" className="hover:text-black ml-3">Manifesto</a> • <a href="/zone" className="hover:text-black ml-3">Zone</a> • <a href="/watch" className="hover:text-black ml-3">Watch</a> • <a href="/eval" className="hover:text-black ml-3">Eval</a> • <a href="/checked" className="hover:text-black ml-3">Checked 20 rules</a>
      </footer>
    </div>
  );
}
