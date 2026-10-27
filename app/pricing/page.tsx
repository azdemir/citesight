"use client";

import { useState } from "react";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  return (
    <div className="min-h-screen bg-white text-[#111] antialiased selection:bg-black selection:text-white">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-[#EDEDEB]">
        <div className="mx-auto max-w-[1120px] px-8 h-[64px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5"><div className="h-6 w-6 bg-black rounded-[6px] flex items-center justify-center"><div className="h-2 w-2 bg-[#FFD60A] rounded-[1px]" /></div><span className="text-[15px] font-[650] tracking-[-0.02em]">CiteSight</span></a>
          <div className="flex items-center gap-6 text-[13px]"><a href="/features" className="text-[#6B6B6B] hover:text-black">Features</a><a href="/pricing" className="font-[600]">Pricing</a><a href="/zone" className="text-[#6B6B6B] hover:text-black">Zone</a><a href="/watch" className="text-[#6B6B6B] hover:text-black">Watch</a></div>
        </div>
      </header>

      <section className="mx-auto max-w-[1120px] px-8 pt-[88px] md:pt-[96px] pb-[48px] text-center">
        <h1 className="text-[48px] md:text-[64px] leading-[0.9] tracking-[-0.05em] font-[800]">Simple pricing for<br /><span className="text-[#9A9A98]">$1B+ operations.</span></h1>
        <p className="mt-6 mx-auto max-w-[560px] text-[16px] leading-[1.6] text-[#6B6B6B]">Built for billion-dollar operations — Americold, Marks & Spencer, Heineken, Bridgestone, Mars, Coca-Cola. Upload any manual, any length. Every alert cites a page p87, not a guess. $0.35/hr vs $4.20/hr VLM vs $270/hr SAM 3.1 per frame impossible.</p>
        <div className="mt-8 inline-flex items-center gap-2 p-1 bg-[#F6F6F5] border border-[#EDEDEB] rounded-full">
          <button onClick={()=>setAnnual(false)} className={`h-8 px-5 rounded-full text-[13px] font-[500] transition-colors ${!annual ? "bg-black text-white" : "text-[#6B6B6B] hover:text-black"}`}>Monthly</button>
          <button onClick={()=>setAnnual(true)} className={`h-8 px-5 rounded-full text-[13px] font-[500] transition-colors ${annual ? "bg-black text-white" : "text-[#6B6B6B] hover:text-black"}`}>Annual • 2 months free</button>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-8 pb-[64px]">
        <div className="text-center">
          <h2 className="text-[22px] font-[700] tracking-[-0.02em]">Who is CiteSight for?</h2>
          <p className="mt-2 mx-auto max-w-[560px] text-[13px] leading-[1.6] text-[#6B6B6B]">Not just small shops — enterprise that needs page citation p87 + clip + $0.35/hr vs $4.20/hr 12x cheaper vs $270/hr SAM 3.1 per frame impossible. Click Details for why $1B+ ops pay vs free AI.</p>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#EDEDEB] rounded-[20px] p-6 hover:border-black transition-colors flex flex-col">
            <div className="flex items-center justify-between"><div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-[12px] font-[700]">C</div><span className="text-[10px] font-mono bg-[#FFD60A] text-black px-2 py-0.5 rounded-full">PRIMARY • $1B+ OPS</span></div>
            <div className="mt-4 text-[16px] font-[650]">Commercial</div>
            <div className="mt-1 text-[12px] text-[#9A9A98]">Warehouses, construction, labs, kitchens, factories</div>
            <div className="mt-3 text-[13px] leading-[1.5] text-[#6B6B6B]">Billion-dollar ops where missed rule costs $1M shutdown, $100k OSHA fine, or a life. Americold 77% injury ↓ $1.1M/yr, M&S 80% incidents ↓ 10 weeks.</div>
            <button onClick={()=>toggle("commercial")} className="mt-5 h-9 w-full rounded-full border border-[#111] text-[12px] font-[600] hover:bg-black hover:text-white transition-colors">{expanded==="commercial" ? "Hide details ↑" : "Details → why $1B+ pays"}</button>
            {expanded==="commercial" && (
              <div className="mt-4 pt-4 border-t border-[#EDEDEB] space-y-2 text-[12px] leading-[1.6] text-[#6B6B6B]">
                <div>• <b className="text-black">Manufacturing</b> — metal, wood, auto, p31 Machine Safety, p44 LOTO, p19 Ergonomics</div>
                <div>• <b className="text-black">Warehouses</b> — forklift ped separation p203, 6ft aisles, horn p4, seatbelt p3, forks lowered greater than 25ft p3</div>
                <div>• <b className="text-black">Construction</b> — hard hat + ANSI Z87.1 + steel toes p4, no short pants p4</div>
                <div>• <b className="text-black">Labs</b> — chemical segregation p28 1ft, flammables yellow cabinet p27, ChemE founder fit</div>
                <div className="mt-2 bg-[#F6F6F5] border border-[#EDEDEB] rounded-[10px] p-3 font-mono text-[11px]">Why $1B+ pays vs free AI: Free invents distance, no SAM masks, no page citation p87, no clip, no $0.35/hr, no OSHA audit trail. Intenseye/Protex $100k/yr/site vs $0.35/hr. Jetson RTSP tap no new cameras.</div>
              </div>
            )}
          </div>

          <div className="bg-[#FAFAF9] border border-[#EDEDEB] rounded-[20px] p-6 hover:border-black transition-colors flex flex-col">
            <div className="flex items-center justify-between"><div className="h-8 w-8 rounded-full bg-[#FFD60A] text-black flex items-center justify-center text-[12px] font-[700]">R</div><span className="text-[10px] font-mono bg-white border border-[#EDEDEB] px-2 py-0.5 rounded-full">SECONDARY</span></div>
            <div className="mt-4 text-[16px] font-[650]">Residential</div>
            <div className="mt-1 text-[12px] text-[#9A9A98]">Homes, elderly fall prevention, child safety</div>
            <div className="mt-3 text-[13px] leading-[1.5] text-[#6B6B6B]">Same SAM+YOLO geometry but emotional closer Image after-fix. $140-350 fix vs $30k hospitalization. 36k deaths/yr US 65+ falls #1 killer.</div>
            <button onClick={()=>toggle("residential")} className="mt-5 h-9 w-full rounded-full border border-[#111] text-[12px] font-[600] hover:bg-black hover:text-white transition-colors">{expanded==="residential" ? "Hide details ↑" : "Details → why home pays"}</button>
            {expanded==="residential" && (
              <div className="mt-4 pt-4 border-t border-[#EDEDEB] space-y-2 text-[12px] leading-[1.6] text-[#6B6B6B]">
                <div>• <b className="text-black">Elderly fall</b> — loose rug, cords, no grab bar, toilet low, step high. Photo → SAM masks → risk p87 → Image after-fix → book handyman via Wavva moat</div>
                <div>• <b className="text-black">Childproofing</b> — unanchored dresser tip-over, open outlet, chemicals low, CPSC</div>
                <div>• <b className="text-black">Home safety</b> — electrical fire 13% home fires 510 deaths/yr, panel double-tap</div>
                <div className="mt-2 bg-white border border-[#EDEDEB] rounded-[10px] p-3 font-mono text-[11px]">Why home pays: $140-350 vs $30k hospitalization. 1 extra job/month covers $299/mo. Competitors $5-$20/report 0 jobs, you book handyman.</div>
              </div>
            )}
          </div>

          <div className="bg-black text-white rounded-[20px] p-6 flex flex-col">
            <div className="flex items-center justify-between"><div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-[12px] font-[700]">B</div><span className="text-[10px] font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded-full">PLATFORM</span></div>
            <div className="mt-4 text-[16px] font-[650]">Both</div>
            <div className="mt-1 text-[12px] opacity-60">Anywhere with rulebook + camera</div>
            <div className="mt-3 text-[13px] leading-[1.5] opacity-80">Same pipeline any manual 10 to 1000+ pages → DSL p87 → zones once → watch $0.35/hr vs $4.20/hr vs $270/hr SAM 3.1 per frame impossible.</div>
            <button onClick={()=>toggle("both")} className="mt-5 h-9 w-full rounded-full bg-white text-black text-[12px] font-[600] hover:bg-[#FFD60A] transition-colors">{expanded==="both" ? "Hide details ↑" : "Details → platform + founder fit"}</button>
            {expanded==="both" && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-[12px] leading-[1.6] opacity-80">
                <div>• <b className="text-white">Primary is $1B+ commercial</b> — Americold, M&S, Heineken, Bridgestone, Mars, Coca-Cola. Real booking engine with write-time revalidation prevents double-book, timezone-safe, buffer-aware</div>
                <div>• <b className="text-white">Secondary is residential</b> — same tech, different rulebook: CDC STEADI fall risk, not OSHA. Reuse availability engine to book handyman, not just PDF</div>
                <div className="mt-2 bg-white/10 border border-white/10 rounded-[10px] p-3 font-mono text-[11px]">Founder SWE+ChemE: built Wavva front-office + availability engine + chemical segregation + coatings + CIP. 20 hand-checked rules p4 p7 p14 etc from 6 manuals.</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-8 pb-[88px]">
        <div className="grid md:grid-cols-3 gap-px bg-[#EDEDEB] border border-[#EDEDEB] rounded-[24px] overflow-hidden">
          <div className="bg-white p-8 flex flex-col">
            <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Free • Demo • For trying</div>
            <div className="mt-4 text-[36px] font-[750] tracking-[-0.03em] leading-none">$0</div>
            <div className="mt-1 text-[13px] text-[#6B6B6B]">Upload any manual, zone annotator, watch mock, 20 hand-checked rules</div>
            <div className="mt-6 space-y-2.5 text-[12px] leading-[1.5]">
              <div className="flex gap-2"><span>✓</span><span>Any manual any length, client pdfjs-dist preview pages detected</span></div>
              <div className="flex gap-2"><span>✓</span><span>Spark 1M compile DSL with page citations p87 §4.2</span></div>
              <div className="flex gap-2"><span>✓</span><span>Zone annotator once, zones.json, homography 3.2m ref</span></div>
              <div className="flex gap-2"><span>✓</span><span>Watch mock masks 0.8m measured, incident p87</span></div>
            </div>
            <div className="mt-auto pt-8"><a href="/upload" className="h-11 w-full rounded-full border border-[#EDEDEB] flex items-center justify-center text-[13px] font-[600] hover:border-black transition-colors">Start free →</a></div>
          </div>

          <div className="bg-[#111] text-white p-8 flex flex-col relative border-2 border-black">
            <div className="absolute -top-3 left-6 h-6 px-3 rounded-full bg-[#FFD60A] text-black text-[11px] font-mono font-[700] flex items-center">MOST POPULAR • $1B+ OPS • 12x CHEAPER</div>
            <div className="text-[11px] font-mono uppercase tracking-[0.08em] opacity-60">Growth • For $1B+ ops • Americold, M&S, Heineken</div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-[36px] font-[750] tracking-[-0.03em] leading-none">${annual ? "2,990" : "2,990"}</span>
              <span className="text-[13px] opacity-60">/mo + $0.35/hr/cam</span>
            </div>
            <div className="mt-1 text-[12px] opacity-60">{annual ? "$29,900/yr • 2 months free • $0.35/hr/cam" : "$2,990/mo • $0.35/hr per camera • $840/day 100 cams • $1B+ ops"}</div>
            <div className="mt-6 space-y-2.5 text-[12px] leading-[1.5]">
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>Real Spark 1M compile any length 10 to 1000+ pages, DSL with page citations p87 p112 p203</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>SAM 3.1 on-demand once $0.0025 zone + incident 5 frames $0.0125, not per frame $270/hr impossible</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>YOLOv8n-seg 6.7MB + SAM 2.1 open-weights $0.10/hr • 30fps • 0 LLM calls/frame • $0.35/hr</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>Geometry distance less than 1.5m p87 less than 2.0m p112 overlap presence, homography 3.2m ref</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>Incident + clip + page citation p87 + Slack/SMS + S3 $0.01/incident, Voice Q&A real Whisper</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>Edge box Jetson Orin Nano $499 PoE taps existing RTSP, no new cameras</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span>Precision 0.89 vs VLM 0.62, Recall 0.84 vs 0.71, auditable Yes p87 + clip</span></div>
            </div>
            <div className="mt-auto pt-8"><a href="/upload" className="h-11 w-full rounded-full bg-white text-black flex items-center justify-center text-[13px] font-[700] hover:bg-[#FFD60A] transition-colors">Upload rulebook → start $0.35/hr</a></div>
          </div>

          <div className="bg-white p-8 flex flex-col">
            <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Enterprise • For $1B+ ops • Custom</div>
            <div className="mt-4 text-[36px] font-[750] tracking-[-0.03em] leading-none">Custom</div>
            <div className="mt-1 text-[13px] text-[#6B6B6B]">$25k-$100k/mo • Americold, M&S, Heineken, Bridgestone, Mars, Coca-Cola • 100+ cams • on-prem • SLA</div>
            <div className="mt-6 space-y-2.5 text-[12px] leading-[1.5] text-[#6B6B6B]">
              <div className="flex gap-2"><span>•</span><span>50+ hazards, custom rules UI, Sentinel edge box, dedicated support, audit trail p87 +clip + SLA, on-prem, SSO</span></div>
              <div className="flex gap-2"><span>•</span><span>Americold 77% injury reduction $1.1M/yr, M&S 80% incidents ↓ 10 weeks — but black-box, no page citation</span></div>
              <div className="flex gap-2"><span>•</span><span>CiteSight alternative: $2,990/mo + Jetson $499 one-time, $0.35/hr, page citation p87 auditable, 12x cheaper vs $4.20/hr VLM vs $270/hr SAM 3.1</span></div>
              <div className="flex gap-2"><span>•</span><span>SAM 3.1 every frame $270/hr impossible vs CiteSight $0.35/hr on-demand only $0.0025 zone + $0.0125 per incident</span></div>
            </div>
            <div className="mt-auto pt-8"><a href="/manifesto" className="h-11 w-full rounded-full border border-[#EDEDEB] flex items-center justify-center text-[13px] font-[600] hover:border-black transition-colors">Contact sales →</a></div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-px bg-[#EDEDEB] border border-[#EDEDEB] rounded-[16px] overflow-hidden">
          <div className="bg-white p-5"><div className="text-[11px] font-mono uppercase text-[#9A9A98]">VLM every 5 frames (2025 winner)</div><div className="mt-2 text-[13px] font-[600]">$4.20/hr/cam • $420/hr 100 cams • $10k/day • No citation</div></div>
          <div className="bg-[#FFD60A] p-5 text-black"><div className="text-[11px] font-mono uppercase opacity-60">CiteSight • SAM geometry + compile-only</div><div className="mt-2 text-[13px] font-[700]">$0.35/hr/cam • $35/hr 100 cams • $840/day • Yes p87 + clip • 12x cheaper • $1B+ ops</div></div>
          <div className="bg-black text-white p-5"><div className="text-[11px] font-mono uppercase opacity-60">SAM 3.1 every frame (naive)</div><div className="mt-2 text-[13px] font-[700]">$270/hr/cam • $27k/hr 100 cams • impossible • $2.50/1k images × 108k frames/hr</div></div>
        </div>
      </section>

      <footer className="border-t border-[#EDEDEB] py-10 text-center text-[11px] font-mono text-[#9A9A98]">
        <a href="/" className="hover:text-black">Home</a> • <a href="/features" className="hover:text-black ml-3">Features</a> • <a href="/privacy" className="hover:text-black ml-3">Privacy</a> • <a href="/terms" className="hover:text-black ml-3">Terms</a> • <a href="/manifesto" className="hover:text-black ml-3">Manifesto</a> • <a href="/zone" className="hover:text-black ml-3">Zone</a> • <a href="/watch" className="hover:text-black ml-3">Watch</a> • <a href="/eval" className="hover:text-black ml-3">Eval</a>
      </footer>
    </div>
  );
}
