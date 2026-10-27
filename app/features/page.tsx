"use client";

import { useState, useEffect } from "react";

export default function FeaturesPage() {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (y / docH) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#111] antialiased selection:bg-black selection:text-white">
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-[#EDEDEB]"><div className="h-full bg-black transition-[width] duration-150" style={{ width: `${progress}%` }} /></div>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-[#EDEDEB]">
        <div className="mx-auto max-w-[1120px] px-8 h-[64px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5"><div className="h-6 w-6 bg-black rounded-[6px] flex items-center justify-center"><div className="h-2 w-2 bg-[#FFD60A] rounded-[1px]" /></div><span className="text-[15px] font-[650] tracking-[-0.02em]">CiteSight</span></a>
          <div className="flex items-center gap-6 text-[13px]"><a href="/features" className="font-[600]">Features</a><a href="/zone" className="text-[#6B6B6B] hover:text-black">Zone</a><a href="/watch" className="text-[#6B6B6B] hover:text-black">Watch</a></div>
        </div>
      </header>

      <section className="mx-auto max-w-[1120px] px-8 pt-[96px] md:pt-[144px] pb-[64px]">
        <div className="max-w-[640px]" style={{ transform: `translateY(${Math.min(scrollY*0.08,16)}px)` }}>
          <h1 className="text-[48px] md:text-[72px] leading-[0.88] tracking-[-0.05em] font-[750]">Every rule<br />with a page number.</h1>
          <p className="mt-8 text-[18px] leading-[1.6] text-[#6B6B6B]">Not a chatbot. Not a dashboard. A rulebook that enforces itself — with citations, clips, and geometry measured in meters, not guesses.</p>
        </div>
      </section>

      <section className="border-t border-[#EDEDEB]">
        <div className="mx-auto max-w-[1120px] px-8 divide-y divide-[#EDEDEB]">
          {[
            { n: "01", title: "Ingest — manual → DSL", desc: "Spark 1M reads it all. Compiles to structured checks with page citations. Every rule keeps source p87 §4.2. Hand-check 20 rules.", meta: "R-04.2 • No person within 1.5 m of running saw • p87 §4.2 • Geo-ML pattern", detail: "Once per manual update, $0.50-$2. JSON: id, rule, type distance/overlap/presence, params, page, severity." },
            { n: "02", title: "Watch — SAM 3.1 + YOLO geometry • 0 LLM/frame", desc: "YOLOv8n-seg 6.7MB detects person, forklift, hard_hat. SAM masks polygon. Homography pixel→meter via aisle 3.2m reference. Distance, overlap, presence at 30fps.", meta: "distance(person, saw) < 1.5m • 30fps • $0.35/hr", detail: "No VLM per frame. Open-weights triage optical flow 2ms for moving state." },
            { n: "03", title: "Explain — Incident + clip + page + Voice Q&A", desc: "When rule fires, Wonder writes plain incident with page + 5-sec clip via ffmpeg. Supervisor asks 'What happened near saw 2pm?' → search by time+zone with citations.", meta: "Violates p87 §4.2 • Clip 14:03:10–15 • stop + LOTO • Slack/SMS + S3", detail: "LLM only on flagged events 10-20/day, not 108k frames/day. $0.01/incident." },
          ].map((f) => (
            <div key={f.n} className="grid md:grid-cols-12 gap-8 py-[56px] group">
              <div className="md:col-span-2 text-[12px] font-mono text-[#9A9A98] tracking-[0.08em]">{f.n}</div>
              <div className="md:col-span-5">
                <div className="text-[22px] font-[650] tracking-[-0.02em] leading-[1.1]">{f.title}</div>
                <div className="mt-4 text-[14px] leading-[1.7] text-[#6B6B6B]">{f.desc}</div>
              </div>
              <div className="md:col-span-5">
                <div className="h-[52px] bg-[#F6F6F5] border border-[#EDEDEB] rounded-[12px] px-4 flex items-center text-[11px] font-mono group-hover:border-black transition-colors">{f.meta}</div>
                <div className="mt-3 text-[12px] text-[#9A9A98] leading-[1.5]">{f.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#FAFAF9] border-y border-[#EDEDEB]">
        <div className="mx-auto max-w-[1120px] px-8 py-[88px] grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5 sticky top-[96px]">
            <h2 className="text-[36px] leading-[0.9] tracking-[-0.04em] font-[750]">12x cheaper.<br />Auditable.</h2>
            <p className="mt-4 text-[14px] leading-[1.6] text-[#6B6B6B]">Precision and recall per rule on labeled video, plus cost per hour vs VLM every few frames baseline.</p>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 gap-px bg-black rounded-[24px] overflow-hidden border border-black">
            <div className="bg-white p-8"><div className="text-[11px] font-mono uppercase text-[#9A9A98]">VLM every 5 frames</div><div className="mt-6 space-y-3 text-[13px] text-[#6B6B6B]"><div className="flex justify-between"><span>Precision</span><span className="text-black font-[600]">0.62</span></div><div className="flex justify-between"><span>Recall</span><span className="text-black font-[600]">0.71</span></div><div className="flex justify-between"><span>Cost/hr</span><span className="line-through">$4.20</span></div><div className="flex justify-between"><span>Audit</span><span>No citation</span></div></div></div>
            <div className="bg-[#FFD60A] p-8 text-black"><div className="text-[11px] font-mono uppercase opacity-60">CiteSight</div><div className="mt-6 space-y-3 font-[500] text-[13px]"><div className="flex justify-between"><span>Precision</span><span className="text-[20px] font-[800]">0.89</span></div><div className="flex justify-between"><span>Recall</span><span className="text-[20px] font-[800]">0.84</span></div><div className="flex justify-between"><span>Cost/hr</span><span className="text-[22px] font-[800]">$0.35</span></div><div className="flex justify-between"><span>Audit</span><span className="font-[600]">Yes p87 + clip</span></div></div></div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#EDEDEB] py-10 text-center text-[11px] font-mono text-[#9A9A98]">
        <a href="/" className="hover:text-black">Home</a> • <a href="/privacy" className="hover:text-black ml-3">Privacy</a> • <a href="/terms" className="hover:text-black ml-3">Terms</a> • <a href="/manifesto" className="hover:text-black ml-3">Manifesto</a> • <a href="/zone" className="hover:text-black ml-3">Zone</a> • <a href="/watch" className="hover:text-black ml-3">Watch</a>
      </footer>
    </div>
  );
}
