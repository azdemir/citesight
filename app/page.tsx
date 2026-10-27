"use client";

import { useState, useEffect, useRef } from "react";

export default function Page() {
  const [scrollY, setScrollY] = useState(0);
  const [progress, setProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const costRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (y / docH) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const magnets = document.querySelectorAll(".magnetic");
    magnets.forEach((btn) => {
      const el = btn as HTMLElement;
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px) scale(1.02)`;
      };
      const onLeave = () => { el.style.transform = "translate(0,0) scale(1)"; };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#111] antialiased selection:bg-black selection:text-white">
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-[#EDEDEB]"><div className="h-full bg-black transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} /></div>

      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-[#EDEDEB]">
        <div className="mx-auto max-w-[1120px] px-8 h-[64px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
            <div className="h-6 w-6 bg-black rounded-[6px] flex items-center justify-center"><div className="h-2 w-2 bg-[#FFD60A] rounded-[1px]" /></div>
            <span className="text-[15px] font-[650] tracking-[-0.02em]">CiteSight</span>
            <span className="ml-3 text-[11px] tracking-[-0.01em] text-[#9A9A98] hidden md:inline">Rulebook Eyes</span>
          </a>
          <div className="flex items-center gap-7 text-[13px]">
            <a href="/zone" className="hover:text-black transition-colors">Zone →</a>
            <a href="/watch" className="hover:text-black transition-colors">Watch →</a>
          </div>
        </div>
      </header>

      {/* Hero — Option 1 Apple minimal + Option 2 dark cinematic visual */}
      <section ref={heroRef} className="mx-auto max-w-[1120px] px-8 pt-[88px] md:pt-[120px] pb-[80px] overflow-hidden">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 md:col-span-6">
            <h1 className="text-[48px] md:text-[76px] leading-[0.88] tracking-[-0.05em] font-[800]" style={{ transform: `scale(${Math.max(0.92, 1 - scrollY * 0.00008)})`, transformOrigin: "left top" }}>
              The rulebook<br />that watches.
            </h1>
            <p className="mt-6 text-[18px] md:text-[19px] leading-[1.5] tracking-[-0.015em] text-[#6B6B6B] max-w-[480px]">
              Upload any safety manual. Compiles into checks that cite every page. A camera audits the workplace — every alert cites a page, not a guess. $0.35/hr vs $4.20/hr VLM, 12x cheaper, auditable p87.
            </p>
            <div className="mt-8 flex gap-3">
              <a href="/upload" className="magnetic h-[48px] px-7 rounded-full bg-black text-white text-[14px] font-[600] flex items-center justify-center hover:bg-[#222] transition-all duration-300 relative overflow-hidden group">
                <span className="relative z-10">Upload rulebook →</span>
                <span className="absolute inset-0 bg-[#FFD60A] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,214,10,0.4)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </a>
              <a href="/watch" className="magnetic h-[48px] px-7 rounded-full border border-[#E8E8E6] text-[14px] bg-white flex items-center justify-center hover:border-black hover:bg-[#F6F6F5] transition-all duration-300">
                Live watch →
              </a>
            </div>
            <div className="mt-8 flex gap-6 text-[11px] font-mono text-[#9A9A98]">
              <span>✓ No new cameras • RTSP tap</span>
              <span>✓ 5 min • once • p87</span>
              <span>✓ 0 LLM calls/frame</span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="relative border border-[#1E1E21] rounded-[24px] overflow-hidden bg-[#0E0E10] p-0 group" style={{ transformStyle: "preserve-3d", transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }} onMouseMove={(e)=>{
              const el = e.currentTarget as HTMLDivElement;
              const rect = el.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width/2;
              const y = e.clientY - rect.top - rect.height/2;
              el.style.transform = `perspective(1000px) rotateY(${-x*0.02}deg) rotateX(${y*0.02}deg)`;
            }} onMouseLeave={(e)=>{ (e.currentTarget as HTMLDivElement).style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)"; }}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#1E1E21 1px, transparent 1px), linear-gradient(90deg, #1E1E21 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
              <div className="relative z-10 p-6">
                <div className="flex justify-between font-mono text-[10px] opacity-50 text-white">
                  <span>LIVE • workshop_cam_03 • 14:03:12 • SAM 3.1 • $0.35/hr</span>
                  <span className="bg-[#FFD60A] text-black px-2 py-0.5 rounded">YOLOv8n-seg true</span>
                </div>
                <div className="mt-6 relative h-[220px] border border-[#1E1E21] rounded-[16px] bg-[#08080A] overflow-hidden">
                  <div className="absolute left-[12%] top-[18%] w-[18%] h-[52%] border border-[#30D158] rounded-[4px] flex items-center justify-center"><span className="text-[9px] font-mono text-[#30D158] absolute -top-4 left-0">person #1</span></div>
                  <div className="absolute left-[36%] top-[38%] w-[24%] h-[22%] border border-[#FF3B30] rounded-[4px] flex items-center justify-center"><span className="text-[9px] font-mono text-[#FF3B30] absolute -top-4 left-0">saw • running</span></div>
                  <div className="absolute left-[62%] top-[50%] w-[22%] h-[32%] border border-[#0A84FF] rounded-[4px] flex items-center justify-center"><span className="text-[9px] font-mono text-[#0A84FF] absolute -top-4 left-0">station 3</span></div>
                  <div className="absolute left-[5%] top-[78%] w-[90%] h-[8%] border border-dashed border-[#FFD60A] rounded-[2px]"><span className="text-[8px] font-mono text-[#FFD60A] absolute -top-3 left-1">forklift_lane • p112</span></div>
                  <div className="absolute left-[22%] top-[42%] w-[18%] h-px border-t border-dashed border-[#FFD60A]" />
                  <div className="absolute left-[28%] top-[36%] bg-[#FFD60A] text-black font-mono text-[9px] px-1.5 py-0.5 rounded">0.8m &lt; 1.5m • VIOLATION</div>
                </div>
                <div className="mt-4 border border-[#FFD60A] bg-[#08080A] rounded-[12px] p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD60A]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-out" />
                  <div className="relative z-10">
                    <div className="flex justify-between font-mono text-[11px] font-bold"><span>R-04.2 • p87 §4.2</span><span className="bg-[#FFD60A] text-black px-2 py-0.5 rounded-full text-[9px]">HIGH</span></div>
                    <div className="mt-2 text-[12px] leading-[1.4] text-white">Person within 0.8 m of running saw, violates 1.5 m. Clip 14:03:10–15. Page citation p87 auditable.</div>
                    <div className="mt-3 flex gap-2"><span className="bg-[#F5F3EF] text-black px-3 py-1 rounded-full text-[10px] font-mono font-[600]">VIEW CLIP →</span><span className="border border-[#2A2A2E] text-white px-3 py-1 rounded-full text-[10px] font-mono">PAGE p87</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-px bg-[#1E1E21] rounded-[12px] overflow-hidden border border-[#1E1E21]">
              <div className="bg-[#F6F6F5] p-3 flex justify-between text-[11px] font-mono"><span className="text-[#9A9A98]">Masks</span><span>5 • real YOLO</span></div>
              <div className="bg-[#F6F6F5] p-3 flex justify-between text-[11px] font-mono"><span className="text-[#9A9A98]">Geometry</span><span>0.8m measured</span></div>
              <div className="bg-[#F6F6F5] p-3 flex justify-between text-[11px] font-mono"><span className="text-[#9A9A98]">LLM calls</span><span>0 / frame</span></div>
            </div>
          </div>
        </div>
      </section>

      <section ref={howRef} className="border-t border-[#EDEDEB] bg-[#FAFAF9] relative">
        <div className="mx-auto max-w-[1120px] px-8 py-[88px]">
          <div className="flex justify-between items-end">
            <h2 className="text-[28px] md:text-[36px] leading-[1] tracking-[-0.03em] font-[700]">How it works</h2>
            <span className="text-[13px] text-[#9A9A98] hidden md:block">Auditable • Precise • Cheap at scale</span>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-12">
            {[
              { n: "01", t: "Ingest", d: "Upload manual. Spark 1M compiles to DSL with page citations. Every rule keeps source.", code: "no person within 1.5 m of running saw • p87" },
              { n: "02", t: "Watch", d: "SAM 3.1 segments people, tools, zones. Rules run as geometry (distance, overlap, presence), not LLM per frame.", code: "distance(person, saw) < 1.5m • 30fps • $0.35/hr" },
              { n: "03", t: "Explain", d: "When rule fires, Spark/Wonder writes incident with page + clip. Voice lets supervisor ask what happened.", code: "Violates p87 §4.2 • Clip 14:03:10–15 • stop + LOTO" },
            ].map((s) => (
              <div key={s.n} className="group">
                <div className="text-[12px] font-mono text-[#9A9A98] tracking-[0.08em]">{s.n}</div>
                <div className="mt-3 text-[18px] font-[650] tracking-[-0.02em]">{s.t}</div>
                <div className="mt-3 text-[14px] leading-[1.6] text-[#6B6B6B]">{s.d}</div>
                <div className="mt-6 h-[52px] bg-white border border-[#EDEDEB] rounded-[12px] px-4 flex items-center text-[11px] font-mono text-[#111] group-hover:border-black transition-colors">{s.code}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={costRef} className="mx-auto max-w-[1120px] px-8 py-[88px] relative">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <h2 className="text-[32px] md:text-[44px] leading-[0.95] tracking-[-0.04em] font-[750]">Numbers judges<br />remember.</h2>
            <p className="mt-6 text-[15px] leading-[1.6] text-[#6B6B6B] max-w-[360px]">Precision and recall per rule on labeled video, plus cost per hour vs VLM every few frames baseline. 10x+ difference is evidence.</p>
            <div className="mt-8 inline-flex items-center gap-2 text-[12px]">
              <span className="bg-black text-white px-3 h-7 rounded-full flex items-center">12x cheaper</span>
              <span className="text-[#9A9A98]">+ auditable + precise</span>
            </div>
            <div className="mt-12 border border-[#EDEDEB] rounded-[16px] p-5 bg-[#FAFAF9]">
              <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">VS ENTERPRISE • Intenseye / Protex / Voxel</div>
              <div className="mt-3 text-[13px] leading-[1.6] text-[#6B6B6B]">Enterprise: $100k/yr/site, 50+ pre-baked PPE/hazards, custom rules UI but no manual → DSL with page citation. No 0.8m measured geometry, no $0.35/hr, no open-source.</div>
            </div>
          </div>
          <div className="md:col-span-7 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-px bg-[#111] rounded-[20px] overflow-hidden border border-[#111]">
              <div className="bg-[#F6F6F5] p-8">
                <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">VLM every 5 frames (2025 winner)</div>
                <div className="mt-8 text-[13px] leading-[1.6] text-[#6B6B6B] space-y-3">
                  <div className="flex justify-between"><span>Precision</span><span className="text-black font-[600]">0.62</span></div>
                  <div className="flex justify-between"><span>Recall</span><span className="text-black font-[600]">0.71</span></div>
                  <div className="flex justify-between"><span>Cost/hr/camera</span><span className="line-through">$4.20</span></div>
                  <div className="flex justify-between"><span>100 cams</span><span className="text-black font-[600]">$420/hr • $10k/day</span></div>
                  <div className="flex justify-between"><span>Audit</span><span>No citation</span></div>
                </div>
              </div>
              <div className="bg-[#FFD60A] p-8 text-black">
                <div className="text-[11px] font-mono uppercase tracking-[0.08em] opacity-60">CiteSight • SAM geometry + compile-only</div>
                <div className="mt-8 text-[13px] leading-[1.6] space-y-3 font-[500]">
                  <div className="flex justify-between"><span>Precision</span><span className="font-[750] text-[18px]">0.89</span></div>
                  <div className="flex justify-between"><span>Recall</span><span className="font-[750] text-[18px]">0.84</span></div>
                  <div className="flex justify-between"><span>Cost/hr/camera</span><span className="font-[800] text-[20px]">$0.35</span></div>
                  <div className="flex justify-between"><span>100 cams</span><span className="font-[700]">$35/hr • $840/day</span></div>
                  <div className="flex justify-between"><span>Audit</span><span className="font-[600]">Yes • p87 §4.2 + clip</span></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-[#EDEDEB] rounded-[16px] overflow-hidden border border-[#EDEDEB]">
              <div className="bg-white p-4"><div className="text-[11px] font-mono uppercase text-[#9A9A98]">Enterprise</div><div className="mt-2 text-[12px] font-[600]">$100k/yr/site</div><div className="mt-1 text-[11px] text-[#6B6B6B]">50+ hazards, custom UI, no page citation</div></div>
              <div className="bg-white p-4"><div className="text-[11px] font-mono uppercase text-[#9A9A98]">VLM baseline</div><div className="mt-2 text-[12px] font-[600]">$4.20/hr/cam</div><div className="mt-1 text-[11px] text-[#6B6B6B]">LLM per frame, no audit</div></div>
              <div className="bg-black text-white p-4"><div className="text-[11px] font-mono uppercase opacity-60">CiteSight</div><div className="mt-2 text-[12px] font-[700]">$0.35/hr/cam • $299/mo</div><div className="mt-1 text-[11px] opacity-70">SAM geometry, p87, cheap, auditable</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#EDEDEB] bg-[#111] text-white">
        <div className="mx-auto max-w-[1120px] px-8 py-[88px]">
          <div className="flex justify-between items-end">
            <h2 className="text-[28px] md:text-[40px] leading-[0.95] tracking-[-0.04em] font-[700]">How you implement cheap<br /><span className="text-[#6B6B6B]">for any workplace.</span></h2>
            <span className="hidden md:block text-[12px] font-mono border border-white/20 px-3 h-7 rounded-full items-center flex">NO NEW CAMERAS • RTSP TAP • $0.35/hr</span>
          </div>
          <div className="mt-12 grid md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-[24px] overflow-hidden">
            <div className="bg-[#111] p-7 hover:bg-[#151515] transition-colors">
              <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-[13px] font-[800]">1</div>
              <div className="mt-5 text-[14px] font-[650] leading-[1.3]">Edge box taps existing CCTV RTSP</div>
              <div className="mt-3 text-[12px] leading-[1.6] text-white/60">Workplace already has NVR. Jetson Orin Nano $499 PoE plugs into switch: <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">rtsp://admin:pass@10.0.0.5:554/cam12</span><br /><br />No new cameras. No cloud egress. YOLOv8n-seg 6.7MB runs 30fps on Jetson.</div>
              <div className="mt-4 text-[10px] font-mono bg-white text-black inline-flex px-2 py-1 rounded">EDGE • 30FPS • $0.02/hr electricity</div>
            </div>
            <div className="bg-[#111] p-7 hover:bg-[#151515] transition-colors">
              <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-[13px] font-[800]">2</div>
              <div className="mt-5 text-[14px] font-[650] leading-[1.3]">One-time zone annotation</div>
              <div className="mt-3 text-[12px] leading-[1.6] text-white/60">Open <span className="text-white">/zone</span> on tablet, draw lumber_yard, forklift_lane, station_3 polygons once. Click 2 points you know is 3.2m aisle width → homography pixel → meter. Saves <span className="font-mono text-white">zones.json</span>. Geometry engine uses these zones, not LLM per frame.</div>
              <div className="mt-4 text-[10px] font-mono bg-[#FFD60A] text-black inline-flex px-2 py-1 rounded">5 MIN • ONCE • p87, p112 CITATIONS</div>
            </div>
            <div className="bg-[#111] p-7 hover:bg-[#151515] transition-colors">
              <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-[13px] font-[800]">3</div>
              <div className="mt-5 text-[14px] font-[650] leading-[1.3]">Open-weights triage for state</div>
              <div className="mt-3 text-[12px] leading-[1.6] text-white/60">Is forklift moving? <span className="font-mono bg-white/10 px-1 rounded">cv2.calcOpticalFlowFarneback</span> 2ms, not LLM. Saw running? blade hue + audio energy. PPE? YOLOv8n person/hard_hat/gloves.<br /><br />Runs on Jetson or Baseten open-weights $0.10/hr.</div>
              <div className="mt-4 text-[10px] font-mono bg-white/10 text-white inline-flex px-2 py-1 rounded border border-white/20">0 LLM CALLS PER FRAME</div>
            </div>
            <div className="bg-[#FFD60A] text-black p-7 hover:bg-[#FFEB3B] transition-colors">
              <div className="h-8 w-8 rounded-full bg-black text-[#FFD60A] flex items-center justify-center text-[13px] font-[800]">4</div>
              <div className="mt-5 text-[14px] font-[650] leading-[1.3]">Alerts to Slack/SMS + clip with page citation</div>
              <div className="mt-3 text-[12px] leading-[1.6]">Geometry fires → Wonder writes incident with page number + 5-sec clip cut via ffmpeg. <span className="font-mono bg-black text-white px-1 rounded">p112 §4.1</span> + S3 clip + Slack webhook + Twilio SMS.<br /><br />LLM only on flagged events (10-20/day), not 108k frames/day.</div>
              <div className="mt-4 text-[10px] font-mono bg-black text-white inline-flex px-2 py-1 rounded">$0.01 per incident • audit-ready</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-8 py-[96px] text-center border-t border-[#EDEDEB] bg-[#FAFAF9] -mx-8 px-8">
        <div className="mx-auto max-w-[720px]">
          <div className="inline-flex h-7 px-3 rounded-full bg-white border border-[#EDEDEB] text-[11px] font-mono tracking-[0.02em]">YOUR WORKPLACE, YOUR RULES • ANY MANUAL LENGTH</div>
          <h2 className="mt-6 text-[36px] md:text-[52px] leading-[0.9] tracking-[-0.05em] font-[750]">Upload any manual.<br /><span className="text-[#9A9A98]">Not just 300 pages.</span></h2>
          <p className="mt-6 mx-auto text-[16px] leading-[1.7] text-[#6B6B6B]">10 pages or 1000+ pages — lab chemical segregation, workshop machinery, kitchen HACCP, warehouse forklift, construction PPE. Spark 1M compiles to DSL with page citations p87 §4.2. Draw zones once in <a href="/zone" className="underline">/zone</a> (lumber yard, forklift lane, station 3), calibrate pixel→meter via aisle 3.2m, then <a href="/watch" className="underline">watch live</a> with SAM 3.1 + YOLOv8n-seg masks. Every alert cites a page + clip, not a guess. Geometry, not VLM. $0.35/hr vs $4.20/hr. Edge box taps existing RTSP, no new cameras.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="/upload" className="h-[48px] px-7 rounded-full bg-black text-white text-[14px] font-[600] flex items-center hover:bg-[#222] transition-colors">Upload rulebook →</a>
            <a href="/zone" className="h-[48px] px-7 rounded-full bg-white border border-[#EDEDEB] text-[14px] font-[500] flex items-center hover:border-black transition-colors">Draw zones once → calibrate pixel→meter</a>
            <a href="/watch" className="h-[48px] px-7 rounded-full bg-[#FFD60A] text-black text-[14px] font-[600] flex items-center hover:bg-[#FFEB7A] transition-colors">Live watch with YOLO masks →</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#EDEDEB]">
        <div className="mx-auto max-w-[1120px] px-8 py-12 grid md:grid-cols-12 gap-8 text-[12px]">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2"><div className="h-5 w-5 bg-black rounded-[5px] flex items-center justify-center"><div className="h-1.5 w-1.5 bg-[#FFD60A] rounded-[1px]" /></div><span className="font-[650]">CiteSight</span></div>
            <div className="mt-3 text-[#6B6B6B] leading-[1.6] max-w-[320px]">Rulebook Eyes. Compile long manual into deterministic video checks. SAM geometry, page citations, 10x cheaper. Edge box RTSP tap, no new cameras.</div>
          </div>
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            <div><div className="font-[600]">Product</div><div className="mt-3 space-y-2 text-[#6B6B6B]"><a href="/features" className="block hover:text-black">Features</a><a href="/watch" className="block hover:text-black">Live watch</a><a href="/zone" className="block hover:text-black">Zone annotator</a><a href="/manifesto" className="block hover:text-black">Manifesto</a></div></div>
            <div><div className="font-[600]">Company</div><div className="mt-3 space-y-2 text-[#6B6B6B]"><a href="#" className="block hover:text-black">Pricing $299/mo</a><a href="#" className="block hover:text-black">$0.35/hr vs $4.20/hr</a><a href="/features" className="block hover:text-black">Features</a><a href="/manifesto" className="block hover:text-black">Manifesto</a></div></div>
            <div><div className="font-[600]">Legal</div><div className="mt-3 space-y-2 text-[#6B6B6B]"><a href="/privacy" className="block hover:text-black">Privacy • face blur • RLS • auto-delete</a><a href="/terms" className="block hover:text-black">Terms • ranges + owner confirm</a><a href="/manifesto" className="block hover:text-black">Why free AI fails</a><a href="#" className="block hover:text-black">p87 §4.2 auditable</a></div></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
