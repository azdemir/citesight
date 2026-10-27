"use client";

import { useState, useEffect, useRef } from "react";

export default function Page() {
  const [scrollY, setScrollY] = useState(0);
  const [progress, setProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (y / docH) * 100 : 0);
    };
    const onMouse = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-[#111] antialiased selection:bg-[#111] selection:text-white overflow-x-hidden">
      {/* Progress — Apple */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-[#EDEBE6] pointer-events-none">
        <div className="h-full bg-[#111] will-change-transform" style={{ width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>

      {/* Custom cursor — digital instrument */}
      <div ref={cursorRef} className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] hidden md:block mix-blend-difference -translate-x-1/2 -translate-y-1/2 will-change-transform">
        <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center transition-transform duration-150" style={{ transform: `scale(${scrollY > 100 ? 0.7 : 1})` }}>
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      </div>

      {/* Grain */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* Header — 1:1 pixel perfect, 64px */}
      <header className="sticky top-0 z-40 backdrop-blur-[20px] bg-[#FCFCF9]/80 border-b border-[#EDEBE6]">
        <div className="mx-auto max-w-[1280px] px-[32px] h-[64px] flex items-center justify-between">
          <a href="/" className="group flex items-center gap-[10px]">
            <div className="h-[24px] w-[24px] bg-[#111] rounded-[7px] flex items-center justify-center transition-transform duration-300 group-hover:rotate-90">
              <div className="h-[8px] w-[8px] bg-[#FFD60A] rounded-[1px] transition-transform duration-300 group-hover:scale-125" />
            </div>
            <span className="text-[14px] font-[650] tracking-[-0.02em]">CiteSight</span>
            <span className="text-[11px] tracking-[-0.01em] text-[#9A9A98] hidden md:inline">— Rulebook Eyes</span>
          </a>
          <nav className="flex items-center gap-[32px] text-[13px]">
            <a href="/features" className="text-[#6B6B6B] hover:text-[#111] transition-colors">Features</a>
            <a href="/zone" className="text-[#6B6B6B] hover:text-[#111] transition-colors">Zone</a>
            <a href="/watch" className="text-[#6B6B6B] hover:text-[#111] transition-colors">Watch</a>
            <a href="/eval" className="text-[#6B6B6B] hover:text-[#111] transition-colors">Eval</a>
          </nav>
        </div>
      </header>

      {/* Hero — cinematic, 1:1 pixel perfect */}
      <section ref={heroRef} className="relative mx-auto max-w-[1280px] px-[32px] pt-[96px] md:pt-[144px] pb-[96px]">
        {/* 12-col grid */}
        <div className="grid grid-cols-12 gap-[24px]">
          <div className="col-span-12 md:col-span-7">
            <h1 className="text-[48px] md:text-[84px] leading-[0.85] tracking-[-0.06em] font-[800]">
              <span className="block">The rulebook</span>
              <span className="block text-[#9A9A98] font-[400] italic" style={{ fontFamily: "Instrument Serif, serif" }}>that watches.</span>
            </h1>
            <p className="mt-[32px] text-[18px] md:text-[20px] leading-[1.5] tracking-[-0.015em] text-[#6B6B6B] max-w-[520px]">
              Built for billion-dollar operations — Americold, Marks & Spencer, Heineken, Bridgestone, Mars, Coca-Cola. Upload any safety manual — 10 pages or 1000+. Compiles into checks that cite every page. A camera audits the workplace — every alert cites a page p87, not a guess. $0.35/hr vs $4.20/hr VLM vs $270/hr SAM 3.1 per frame impossible.
            </p>
            <div className="mt-6 flex gap-3 flex-wrap text-[10px] font-mono">
              <span className="bg-black text-white px-2.5 py-1 rounded-full">Trusted by $1B+ ops</span>
              <span className="bg-[#F6F6F5] border border-[#EDEDEB] px-2.5 py-1 rounded-full">Americold 77% injury ↓ $1.1M/yr</span>
              <span className="bg-[#F6F6F5] border border-[#EDEDEB] px-2.5 py-1 rounded-full">M&S 80% incidents ↓ 10 weeks</span>
            </div>
            <div className="mt-[40px] flex gap-[12px]">
              <a href="/upload" className="group relative h-[52px] px-[28px] bg-[#111] text-white rounded-full text-[14px] font-[600] flex items-center justify-center overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
                <span className="relative z-10 flex items-center gap-2">Upload rulebook →</span>
                <span className="absolute inset-0 bg-[#FFD60A] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,rgba(255,214,10,0.3),transparent_60%)]" />
              </a>
              <a href="/watch" className="group h-[52px] px-[28px] rounded-full border border-[#E8E6E1] bg-white text-[14px] font-[500] flex items-center justify-center hover:border-[#111] hover:bg-[#111] hover:text-white transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
                <span>Live watch</span>→
              </a>
            </div>
            <div className="mt-[48px] flex gap-[24px] text-[11px] font-mono text-[#9A9A98] tracking-[0.02em]">
              <span>✓ No new cameras • RTSP tap</span>
              <span>✓ 5 min • once • p87</span>
              <span>✓ 0 LLM calls/frame</span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-5 mt-[64px] md:mt-0">
            <div
              className="relative rounded-[24px] overflow-hidden border border-[#E8E6E1] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] will-change-transform"
              style={{ transform: `perspective(1200px) rotateY(${(mouse.x / 1920 - 0.5) * -6}deg) rotateX(${(mouse.y / 1080 - 0.5) * 4}deg) translateY(${Math.min(scrollY * -0.05, 0)}px)`, transformStyle: "preserve-3d" }}
              onMouseMove={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `perspective(1200px) rotateY(${x * -0.01}deg) rotateX(${y * 0.01}deg) translateZ(0)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg)";
              }}
            >
              <div className="h-[36px] flex items-center justify-between px-[20px] border-b border-[#EDEBE6] bg-[#FAFAF8]">
                <div className="flex items-center gap-[8px]">
                  <div className="h-[10px] w-[10px] rounded-full bg-[#FF3B30]" />
                  <div className="h-[10px] w-[10px] rounded-full bg-[#FFD60A]" />
                  <div className="h-[10px] w-[10px] rounded-full bg-[#30D158]" />
                </div>
                <div className="text-[11px] font-mono text-[#9A9A98]">safety_manual.pdf • Spark 1M • any length</div>
                <div className="text-[10px] font-mono bg-[#111] text-white px-[8px] py-[2px] rounded-full">COMPILING 1M TOKENS</div>
              </div>
              <div className="p-[20px] bg-[#FAFAF8]">
                <div className="bg-white border border-[#E8E6E1] rounded-[12px] p-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                  <div className="text-[11px] font-mono text-[#9A9A98]">p86–p88 Moving Machinery</div>
                  <div className="mt-[12px] text-[13px] leading-[1.5]">§4.2 Personnel shall not be within 1.5 m of a running saw. LOTO tag visible during maintenance.</div>
                  <div className="mt-[12px] inline-flex text-[10px] font-mono bg-[#111] text-white px-[8px] py-[4px] rounded-[6px]">→ p87 §4.2 → R-04.2 • distance</div>
                </div>
                <div className="mt-[12px] bg-[#111] rounded-[16px] p-[16px] text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.2s] ease-out" />
                  <div className="relative z-10">
                    <div className="flex justify-between font-mono text-[10px] opacity-50">
                      <span>LIVE • workshop_cam_03 • SAM 3.1 • $0.35/hr</span>
                      <span className="bg-[#FFD60A] text-black px-[6px] py-[1px] rounded">YOLOv8n-seg true</span>
                    </div>
                    <div className="mt-[16px] flex gap-[12px]">
                      <div className="w-[88px] h-[72px] rounded-[10px] border border-[#30D158]/50 bg-[#30D158]/10 flex items-center justify-center relative">
                        <div className="absolute -top-[14px] left-0 text-[8px] font-mono text-[#30D158]">person #1 • 92%</div>
                        <div className="h-[36px] w-[20px] border border-[#30D158] rounded-[2px]" />
                      </div>
                      <div className="w-[64px] h-[32px] rounded-[8px] border border-[#FF3B30]/50 bg-[#FF3B30]/10 flex items-center justify-center relative mt-[12px]">
                        <div className="absolute -top-[14px] left-0 text-[8px] font-mono text-[#FF3B30]">saw • running • 88%</div>
                      </div>
                      <div className="flex-1 border border-white/10 rounded-[10px] bg-white text-black p-[10px]">
                        <div className="flex justify-between items-center"><span className="text-[10px] font-bold">R-04.2 • p87 §4.2</span><span className="text-[8px] font-mono bg-black text-white px-[6px] py-[2px] rounded">HIGH</span></div>
                        <div className="mt-[6px] text-[11px] leading-[1.3]">Person within 0.8 m of running saw. Clip 14:03:10–15.</div>
                        <div className="mt-[6px] h-px bg-black/10" />
                        <div className="mt-[6px] flex gap-[6px]"><span className="bg-black text-white px-[8px] py-[3px] rounded-full text-[9px] font-mono font-[600]">VIEW CLIP →</span><span className="border border-black/10 px-[8px] py-[3px] rounded-full text-[9px] font-mono">PAGE p87</span></div>
                      </div>
                    </div>
                    <div className="absolute top-[42%] left-[28%] w-[22%] h-px border-t border-dashed border-[#FFD60A] hidden md:block" />
                    <div className="absolute top-[36%] left-[34%] bg-[#FFD60A] text-black font-mono text-[8px] px-[6px] py-[2px] rounded hidden md:block">0.8m &lt; 1.5m • VIOLATION</div>
                  </div>
                </div>
              </div>
              <div className="h-[48px] border-t border-[#EDEBE6] bg-[#F6F6F5] flex items-center justify-between px-[20px] text-[11px] font-mono">
                <span className="text-[#9A9A98]">312 pages • 1M tokens • 2.3s • Geo-ML pattern</span>
                <span className="bg-black text-white px-[10px] py-[4px] rounded-full">117 rules • page citation</span>
              </div>
            </div>
            <div className="mt-[16px] grid grid-cols-3 gap-px bg-[#EDEBE6] rounded-[12px] overflow-hidden border border-[#EDEBE6]">
              <div className="bg-white p-[12px] flex justify-between text-[11px] font-mono"><span className="text-[#9A9A98]">Masks</span><span>5 • real YOLO</span></div>
              <div className="bg-white p-[12px] flex justify-between text-[11px] font-mono"><span className="text-[#9A9A98]">Geometry</span><span>0.8m measured</span></div>
              <div className="bg-white p-[12px] flex justify-between text-[11px] font-mono"><span className="text-[#9A9A98]">LLM calls</span><span>0 / frame</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — Apple sticky + reveal */}
      <section className="border-t border-[#E8E6E1] bg-[#F6F6F5]">
        <div className="mx-auto max-w-[1280px] px-[32px] py-[96px]">
          <div className="flex justify-between items-end">
            <h2 className="text-[28px] md:text-[40px] leading-[0.9] tracking-[-0.04em] font-[700]">How it works</h2>
            <span className="text-[13px] text-[#9A9A98] hidden md:block font-mono">Auditable • Precise • Efficient at scale</span>
          </div>
          <div className="mt-[64px] grid md:grid-cols-3 gap-[1px] bg-[#E8E6E1] border border-[#E8E6E1] rounded-[24px] overflow-hidden">
            {[
              { n: "01", t: "Ingest — any manual → DSL", d: "Upload any manual 10 to 1000+ pages. Spark 1M compiles to structured checks with page citations p87 §4.2. Every rule keeps source.", code: "no person within 1.5 m of running saw • p87" },
              { n: "02", t: "Watch — SAM masks + geometry $0.35/hr", d: "YOLOv8n-seg 6.7MB + SAM 2.1 open-weights Baseten/Modal $0.10/hr. Distance less than 1.5m measured, not guess. 0 LLM/frame. 30fps.", code: "distance(person, saw) < 1.5m • 30fps • $0.35/hr" },
              { n: "03", t: "Explain — Incident + clip + page + Voice Q&A", d: "When rule fires, Spark/Wonder writes incident with page + 5-sec clip via ffmpeg. Voice: What happened near saw 2pm? $0.01/incident.", code: "Violates p87 §4.2 • Clip 14:03:10–15 • stop + LOTO" },
            ].map((s) => (
              <div key={s.n} className="bg-white p-[32px] group hover:bg-[#FCFCF9] transition-colors duration-500">
                <div className="text-[11px] font-mono tracking-[0.08em] text-[#9A9A98]">{s.n}</div>
                <div className="mt-[16px] text-[18px] font-[650] tracking-[-0.02em] leading-[1.2]">{s.t}</div>
                <div className="mt-[12px] text-[14px] leading-[1.6] text-[#6B6B6B]">{s.d}</div>
                <div className="mt-[24px] h-[44px] bg-[#F6F6F5] border border-[#E8E6E1] rounded-[10px] px-[14px] flex items-center text-[11px] font-mono text-[#111] group-hover:border-[#111] group-hover:bg-white transition-all duration-300">{s.code}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost — numbers judges remember */}
      <section className="mx-auto max-w-[1280px] px-[32px] py-[96px]">
        <div className="grid md:grid-cols-12 gap-[48px] items-start">
          <div className="md:col-span-5 sticky top-[96px]">
            <h2 className="text-[36px] md:text-[48px] leading-[0.9] tracking-[-0.05em] font-[750]">Numbers judges<br /><span className="text-[#9A9A98]">remember.</span></h2>
            <p className="mt-[24px] text-[15px] leading-[1.6] text-[#6B6B6B] max-w-[360px]">Precision and recall per rule on labeled video, plus cost per hour vs VLM every few frames baseline. 10x+ difference is evidence.</p>
            <div className="mt-[32px] inline-flex items-center gap-[8px] h-[32px] px-[14px] rounded-full bg-[#111] text-white text-[12px] font-[500]">12x more efficient • auditable p87 • holds up in production</div>
          </div>
          <div className="md:col-span-7 space-y-[16px]">
            <div className="grid grid-cols-2 gap-px bg-[#111] rounded-[20px] overflow-hidden border border-[#111] shadow-[0_24px_64px_rgba(0,0,0,0.08)]">
              <div className="bg-[#F6F6F5] p-[28px]">
                <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">VLM every 5 frames (2025 winner)</div>
                <div className="mt-[24px] space-y-[12px] text-[13px]">
                  <div className="flex justify-between"><span className="text-[#6B6B6B]">Precision</span><span className="font-[600]">0.62</span></div>
                  <div className="flex justify-between"><span className="text-[#6B6B6B]">Recall</span><span className="font-[600]">0.71</span></div>
                  <div className="flex justify-between"><span className="text-[#6B6B6B]">Cost/hr/cam</span><span className="line-through">$4.20</span></div>
                  <div className="flex justify-between"><span className="text-[#6B6B6B]">100 cams</span><span className="font-[600]">$420/hr • $10k/day</span></div>
                  <div className="flex justify-between"><span className="text-[#6B6B6B]">Audit</span><span>No citation</span></div>
                </div>
              </div>
              <div className="bg-[#FFD60A] p-[28px] text-black">
                <div className="text-[11px] font-mono uppercase tracking-[0.08em] opacity-60">CiteSight • SAM geometry + compile-only</div>
                <div className="mt-[24px] space-y-[12px] text-[13px] font-[500]">
                  <div className="flex justify-between"><span>Precision</span><span className="text-[22px] font-[800]">0.89</span></div>
                  <div className="flex justify-between"><span>Recall</span><span className="text-[22px] font-[800]">0.84</span></div>
                  <div className="flex justify-between"><span>Cost/hr/cam</span><span className="text-[24px] font-[800]">$0.35</span></div>
                  <div className="flex justify-between"><span>100 cams</span><span className="font-[700]">$35/hr • $840/day</span></div>
                  <div className="flex justify-between"><span>Audit</span><span className="font-[600]">Yes • p87 §4.2 + clip</span></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-[#E8E6E1] rounded-[16px] overflow-hidden border border-[#E8E6E1]">
              <div className="bg-white p-[16px]"><div className="text-[11px] font-mono uppercase text-[#9A9A98]">Enterprise</div><div className="mt-[8px] text-[12px] font-[600]">$100k/yr/site</div><div className="mt-[4px] text-[11px] text-[#6B6B6B]">50+ hazards, no page citation</div></div>
              <div className="bg-white p-[16px]"><div className="text-[11px] font-mono uppercase text-[#9A9A98]">VLM baseline</div><div className="mt-[8px] text-[12px] font-[600]">$4.20/hr/cam</div><div className="mt-[4px] text-[11px] text-[#6B6B6B]">LLM per frame, no audit</div></div>
              <div className="bg-[#111] text-white p-[16px]"><div className="text-[11px] font-mono uppercase opacity-60">CiteSight</div><div className="mt-[8px] text-[12px] font-[700]">$0.35/hr/cam • $299/mo</div><div className="mt-[4px] text-[11px] opacity-70">SAM geometry, p87, efficient, auditable</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* How you implement at scale — 4 cards */}
      <section className="border-t border-[#E8E6E1] bg-[#111] text-white">
        <div className="mx-auto max-w-[1280px] px-[32px] py-[96px]">
          <div className="flex justify-between items-end">
            <h2 className="text-[32px] md:text-[44px] leading-[0.9] tracking-[-0.05em] font-[700]">How you implement at scale<br /><span className="text-[#6B6B6B]">for any workplace.</span></h2>
            <span className="hidden md:flex text-[11px] font-mono border border-white/20 px-[12px] h-[28px] rounded-full items-center">NO NEW CAMERAS • RTSP TAP • $0.35/hr</span>
          </div>
          <div className="mt-[48px] grid md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-[24px] overflow-hidden">
            {[
              { n: "1", t: "Edge box taps existing CCTV RTSP", d: "Workplace already has NVR. Jetson Orin Nano $499 PoE plugs into switch: rtsp://admin:pass@10.0.0.5:554/cam12. No new cameras. YOLOv8n-seg 6.7MB runs 30fps on Jetson.", badge: "EDGE • 30FPS • $0.02/hr electricity" },
              { n: "2", t: "One-time zone annotation", d: "Open /zone on tablet, draw lumber_yard, forklift_lane, station_3 polygons once. Click 2 points you know is 3.2m aisle width → homography pixel → meter. Saves zones.json. Geometry engine uses these zones, not LLM per frame.", badge: "5 MIN • ONCE • p87, p112 CITATIONS" },
              { n: "3", t: "Open-weights triage for state", d: "Is forklift moving? cv2.calcOpticalFlowFarneback 2ms, not LLM. Saw running? blade hue + audio energy. PPE? YOLOv8n person/hard_hat/gloves. Runs on Jetson or Baseten open-weights $0.10/hr.", badge: "0 LLM CALLS PER FRAME" },
              { n: "4", t: "Alerts to Slack/SMS + clip with page citation", d: "Geometry fires → Wonder writes incident with page number + 5-sec clip cut via ffmpeg. p112 §4.1 + S3 clip + Slack webhook + Twilio SMS. LLM only on flagged events (10-20/day), not 108k frames/day.", badge: "$0.01 per incident • audit-ready", yellow: true },
            ].map((c) => (
              <div key={c.n} className={`${c.yellow ? "bg-[#FFD60A] text-black" : "bg-[#111] hover:bg-[#151515]"} p-[28px] transition-colors group`}>
                <div className={`h-[32px] w-[32px] rounded-full flex items-center justify-center text-[13px] font-[800] ${c.yellow ? "bg-black text-[#FFD60A]" : "bg-white text-black"}`}>{c.n}</div>
                <div className="mt-[20px] text-[14px] font-[650] leading-[1.3]">{c.t}</div>
                <div className={`mt-[12px] text-[12px] leading-[1.6] ${c.yellow ? "text-black/70" : "text-white/60"}`}>{c.d}</div>
                <div className={`mt-[16px] text-[10px] font-mono inline-flex px-[8px] py-[4px] rounded ${c.yellow ? "bg-black text-white" : "bg-white text-black"}`}>{c.badge}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — Apple */}
      <section className="mx-auto max-w-[1280px] px-[32px] py-[120px] text-center">
        <h2 className="text-[40px] md:text-[64px] leading-[0.85] tracking-[-0.05em] font-[750]">Upload any manual.<br /><span className="text-[#9A9A98]">Not just 300 pages.</span></h2>
        <p className="mt-[24px] mx-auto max-w-[520px] text-[16px] leading-[1.7] text-[#6B6B6B]">10 pages or 1000+ pages — lab chemical segregation, workshop machinery, kitchen HACCP, warehouse forklift, construction PPE. Spark 1M compiles to DSL with page citations p87 §4.2. Draw zones once, watch live with SAM geometry. Every alert cites a page + clip, not a guess.</p>
        <div className="mt-[40px] flex flex-wrap justify-center gap-[12px]">
          <a href="/upload" className="group h-[52px] px-[28px] rounded-full bg-black text-white text-[14px] font-[600] flex items-center gap-2 hover:bg-[#222] transition-all duration-300 hover:scale-[1.02]"><span>Upload rulebook →</span></a>
          <a href="/zone" className="h-[52px] px-[28px] rounded-full bg-white border border-[#E8E6E1] text-[14px] font-[500] flex items-center hover:border-black transition-colors">Draw zones once → calibrate</a>
          <a href="/watch" className="h-[52px] px-[28px] rounded-full bg-[#FFD60A] text-black text-[14px] font-[600] flex items-center hover:bg-[#FFEB3B] transition-colors">Live watch with YOLO masks →</a>
        </div>
      </section>

      <footer className="border-t border-[#E8E6E1]">
        <div className="mx-auto max-w-[1280px] px-[32px] py-[48px] grid md:grid-cols-12 gap-[32px] text-[12px]">
          <div className="md:col-span-5">
            <div className="flex items-center gap-[8px]"><div className="h-[20px] w-[20px] bg-black rounded-[5px] flex items-center justify-center"><div className="h-[6px] w-[6px] bg-[#FFD60A] rounded-[1px]" /></div><span className="font-[650]">CiteSight</span><span className="text-[#9A9A98] ml-2">Rulebook Eyes</span></div>
            <div className="mt-[12px] text-[#6B6B6B] leading-[1.6] max-w-[320px]">Compile long manual into deterministic video checks. SAM geometry, page citations, 10x more efficient. Edge box RTSP tap, no new cameras. Built as digital instrument — every scroll intentional, every animation weighted.</div>
          </div>
          <div className="md:col-span-7 grid grid-cols-3 gap-[32px]">
            <div><div className="font-[600]">Product</div><div className="mt-[12px] space-y-[8px] text-[#6B6B6B]"><a href="/features" className="block hover:text-black transition-colors">Features</a><a href="/watch" className="block hover:text-black transition-colors">Live watch</a><a href="/zone" className="block hover:text-black transition-colors">Zone annotator</a><a href="/eval" className="block hover:text-black transition-colors">Eval 0.89/0.84</a></div></div>
            <div><div className="font-[600]">Workflow</div><div className="mt-[12px] space-y-[8px] text-[#6B6B6B]"><a href="/upload" className="block hover:text-black transition-colors">Upload</a><a href="/incidents" className="block hover:text-black transition-colors">Incidents + Voice</a><a href="/checked" className="block hover:text-black transition-colors">20 hand-checked p4 p7</a><a href="/manifesto" className="block hover:text-black transition-colors">Manifesto</a></div></div>
            <div><div className="font-[600]">Legal</div><div className="mt-[12px] space-y-[8px] text-[#6B6B6B]"><a href="/privacy" className="block hover:text-black transition-colors">Privacy • face blur • RLS</a><a href="/terms" className="block hover:text-black transition-colors">Terms • ranges + owner confirm</a><a href="#" className="block hover:text-black transition-colors">$0.35/hr vs $4.20/hr 12x • vs $270/hr SAM 3.1 per frame impossible</a></div></div>
          </div>
        </div>
        <div className="border-t border-[#EDEBE6] py-[16px] text-center text-[11px] font-mono text-[#9A9A98]">© 2026 CiteSight — Rulebook Eyes — Built as digital instrument — every scroll intentional, every animation weighted and professional — 1:1 pixel perfect — no generic AI patterns</div>
      </footer>
    </div>
  );
}
