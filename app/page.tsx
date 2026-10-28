"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { n: "01", t: "Ingest — any manual to DSL", d: "Upload a manual of any length. Spark 1M compiles it to structured checks, and every rule keeps its source page.", code: "no person within 1.5 m of running saw • p87" },
  { n: "02", t: "Watch — masks become geometry", d: "People, tools and zones are segmented, then checked as distance, overlap and presence — measured, not guessed.", code: "distance(person, saw) < 1.5m • 30fps • $0.35/hr" },
  { n: "03", t: "Explain — incident, clip, citation", d: "When a rule fires, you get the clip, the plain-language incident and the exact page it came from.", code: "Violates p87 §4.2 • Clip 14:03:10–15" },
];

const IMPLEMENT = [
  { n: "1", t: "Connect the cameras you have", d: "An edge box joins the existing camera network and processes video on site. Nothing new on the wall.", badge: "EDGE • 30 FPS" },
  { n: "2", t: "Draw zones, once", d: "Mark work areas on the floor plan in /zone and calibrate pixels to metres with one known distance.", badge: "5 MIN • ONCE" },
  { n: "3", t: "Let geometry do the watching", d: "Open-weights models track people, tools and protective equipment. No model call is made on every frame.", badge: "0 MODEL CALLS / FRAME" },
  { n: "4", t: "Act on cited evidence", d: "A violation produces a short clip, the rule text and its page citation for the team to review and act on.", badge: "CLIP + CITATION", accent: true },
];

function FlowNode({ title, badge, sub, active, className, children }: { title: string; badge: string; sub?: string; active: boolean; className: string; children?: React.ReactNode }) {
  return (
    <div className={`absolute w-[190px] rounded-2xl border bg-white p-4 shadow-[0_10px_36px_rgba(0,0,0,0.07)] transition-all duration-700 ${active ? "border-[#2563EB]/60 opacity-100 scale-100" : "border-[#E8E6E1] opacity-45 scale-[0.97]"} ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12.5px] font-semibold tracking-[-0.01em] leading-[1.2]">{title}</span>
        <span className={`shrink-0 text-[9.5px] font-medium px-2 py-0.5 rounded-full transition-colors duration-500 ${active ? "bg-[#E8F7EE] text-[#15803D]" : "bg-[#F1F1EF] text-[#9A9A98]"}`}>{active ? "✓ " : ""}{badge}</span>
      </div>
      {sub && <div className="mt-2 text-[11px] text-[#9A9A98] truncate">{sub}</div>}
      {children}
    </div>
  );
}

function AnimatedWorkflow() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 6), 1250);
    return () => clearInterval(id);
  }, []);

  const passed = step < 2 ? 0 : step === 2 ? 7 : 12;
  const logLines = [
    ["09:41:07", "frame.received", "workshop_cam_03"],
    ["09:41:08", "sam.segmented", "person · saw · zones"],
    ["09:41:08", "rules.evaluated", `${passed}/12 checked`],
    ["09:41:09", "incident.cited", "R-04.2 · p87 §4.2"],
  ].slice(0, Math.min(step + 1, 4));

  const pathCls = (on: boolean) => `fill-none stroke-[2] transition-all duration-700 ${on ? "stroke-[#2563EB]" : "stroke-[#D8D8D3]"}`;

  return (
    <section className="mx-auto max-w-[1120px] px-6 py-20 md:py-24">
      <div className="flex flex-col gap-3 mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <h2 className="text-[32px] md:text-[40px] leading-[0.95] tracking-[-0.04em] font-bold">Watch a rule<br /><span className="text-[#9A9A98]">move through the system</span></h2>
        <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#9A9A98] sm:text-right sm:pb-1">Live simulation · loops</span>
      </div>

      <div className="rounded-[24px] border border-[#E8E6E1] bg-white shadow-[0_32px_90px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* App top bar */}
        <div className="h-[52px] flex items-center justify-between gap-3 px-4 border-b border-[#EDEBE6] bg-[#FCFCF9]">
          <div className="flex items-center gap-2 text-[12px] text-[#6B6B6B] min-w-0">
            <span className="font-semibold text-[#111]">Workflows</span><span className="text-[#D8D8D3]">/</span><span className="truncate">Workshop floor — Lane 3</span><span className="text-[#D8D8D3]">/</span><span className="font-mono">v87</span>
            <span className="text-[10px] font-medium bg-[#E3ECFF] text-[#2563EB] px-2 py-0.5 rounded-full">Live</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:flex h-8 px-3 rounded-lg border border-[#EDEBE6] text-[11px] text-[#9A9A98] items-center">Search incidents&nbsp;&nbsp;⌘K</span>
            <a href="/watch" className="h-8 px-3.5 rounded-lg border border-[#EDEBE6] text-[11.5px] font-medium flex items-center hover:border-[#111] transition-colors">▷ Simulate</a>
            <a href="/upload" className="h-8 px-3.5 rounded-lg bg-[#111] text-white text-[11.5px] font-semibold flex items-center hover:bg-black">Publish</a>
          </div>
        </div>

        <div className="flex">
          {/* Rail */}
          <div className="hidden sm:flex w-[52px] shrink-0 flex-col items-center gap-2 py-4 border-r border-[#EDEBE6] text-[#9A9A98]">
            {["▦", "⌥", "⛁", "✉", "⚙"].map((g, i) => (
              <span key={i} className={`h-9 w-9 rounded-xl flex items-center justify-center text-[14px] ${i === 1 ? "bg-[#F1F1EF] text-[#111]" : ""}`}>{g}</span>
            ))}
          </div>

          <div className="flex-1 min-w-0">
            {/* Canvas */}
            <div className="overflow-x-auto">
              <div className="relative min-w-[920px] h-[480px]" style={{ backgroundImage: "radial-gradient(circle, #E3E3DF 1px, transparent 1px)", backgroundSize: "22px 22px" }}>
                <div className={`absolute left-1/2 top-[22px] -translate-x-1/2 flex items-center gap-2 h-8 px-4 rounded-full border bg-white shadow-sm text-[12px] font-medium transition-all duration-700 ${step >= 4 ? "border-[#2563EB]/50 text-[#111]" : "border-[#E8E6E1] text-[#9A9A98]"}`}>
                  <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] text-white transition-colors duration-500 ${step >= 4 ? "bg-[#2563EB]" : "bg-[#D8D8D3]"}`}>✓</span>
                  {step >= 4 ? "Incident ready — cited to p87" : "Watching…"}
                </div>

                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 920 480" fill="none" aria-hidden>
                  <path id="f1" d="M196 240 C 250 240, 250 105, 306 105" className={pathCls(step >= 1)} />
                  <path id="f2" d="M196 240 C 250 240, 250 235, 306 235" className={pathCls(step >= 1)} />
                  <path id="f3" d="M196 240 C 250 240, 250 365, 306 365" className={pathCls(step >= 1)} />
                  <path id="f4" d="M496 105 C 552 105, 548 165, 596 180" className={pathCls(step >= 2)} />
                  <path id="f5" d="M496 235 C 552 235, 548 205, 596 195" className={pathCls(step >= 2)} />
                  <path id="f6" d="M496 365 C 552 365, 548 290, 596 260" className={pathCls(step >= 3)} />
                  <path id="f7" d="M756 195 C 800 185, 800 130, 826 118" className={pathCls(step >= 4)} />
                  {step >= 1 && ["f1", "f2", "f3"].map((p) => (
                    <circle key={p} r="4" fill="#2563EB"><animateMotion dur="2.6s" repeatCount="indefinite"><mpath href={`#${p}`} /></animateMotion></circle>
                  ))}
                  {step >= 2 && ["f4", "f5", "f6"].map((p) => (
                    <circle key={p} r="4" fill="#2563EB"><animateMotion dur="2.6s" repeatCount="indefinite"><mpath href={`#${p}`} /></animateMotion></circle>
                  ))}
                  {step >= 4 && (
                    <circle r="4.5" fill="#2563EB"><animateMotion dur="2.2s" repeatCount="indefinite"><mpath href="#f7" /></animateMotion></circle>
                  )}
                </svg>

                <FlowNode title="Safety manual" badge="Received" sub="Workshop Line 3 · 117 rules" active={step >= 0} className="left-[16px] top-[176px]">
                  <div className="mt-3 flex items-center gap-2.5">
                    <span className="h-9 w-9 rounded-lg bg-[#111] text-white flex items-center justify-center text-[10px] font-mono font-semibold">PDF</span>
                    <span className="text-[11px] leading-[1.4] text-[#6B6B6B]">Compiled by Spark 1M<br />with page citations</span>
                  </div>
                </FlowNode>

                <FlowNode title="SAM segmentation" badge="Segmented" sub="person · saw · zones" active={step >= 1} className="left-[306px] top-[52px]" />
                <FlowNode title="Zone check" badge="Matched" sub="station_3 polygon" active={step >= 1} className="left-[306px] top-[182px]" />
                <FlowNode title="PPE check" badge="Synced" sub="gloves · hard hat" active={step >= 1} className="left-[306px] top-[312px]" />

                <FlowNode title="Rule engine" badge="v87" sub="" active={step >= 2} className="left-[596px] top-[118px] w-[160px]">
                  <div className="mt-2.5 space-y-1.5">
                    {[["Distance ≥ 1.5 m", true], ["Pedestrian lane clear", true], ["Gloves at station 3", true], ["LOTO tag visible", step >= 3]].map(([label, on]) => (
                      <div key={label as string} className="flex items-center gap-2 text-[11px]">
                        <span className={`h-3.5 w-3.5 rounded flex items-center justify-center text-[8px] text-white transition-colors duration-500 ${on && step >= 2 ? "bg-[#2563EB]" : "bg-[#D8D8D3]"}`}>✓</span>
                        <span className="text-[#555] truncate">{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#F1F1EF] flex justify-between text-[10.5px] text-[#9A9A98]"><span>Rules passed</span><span className="font-mono font-semibold text-[#111]">{passed} / 12</span></div>
                </FlowNode>

                <FlowNode title="Geometry model" badge="0.8 m" sub="" active={step >= 3} className="left-[596px] top-[268px] w-[160px]">
                  <div className="mt-1 flex items-end justify-between">
                    <span className="text-[24px] font-semibold tracking-[-0.03em] leading-none">0.8<span className="text-[13px] text-[#9A9A98] font-normal"> m</span></span>
                    <svg width="52" height="22" viewBox="0 0 52 22" className="mb-0.5"><polyline points="0,17 10,14 20,15 30,9 40,10 52,3" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinejoin="round" /></svg>
                  </div>
                  <div className="mt-1 text-[10.5px] text-[#9A9A98]">Measured distance to saw — limit 1.5 m</div>
                </FlowNode>

                <div className={`absolute right-[14px] top-[52px] w-[196px] rounded-2xl border bg-white p-4 shadow-[0_10px_36px_rgba(0,0,0,0.07)] transition-all duration-700 ${step >= 4 ? "border-[#2563EB]/60 opacity-100 scale-100" : "border-[#E8E6E1] opacity-45 scale-[0.97]"}`}>
                  <div className="text-[12.5px] font-semibold">Decision</div>
                  <div className="mt-3 flex items-center gap-3">
                    <span className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-[15px] transition-colors duration-500 ${step >= 4 ? "bg-[#2563EB]" : "bg-[#D8D8D3]"}`}>✓</span>
                    <span>
                      <span className="block text-[16px] font-semibold leading-[1.15]">{step >= 4 ? "Alert — cited" : "Watching"}</span>
                      <span className="block text-[10.5px] text-[#9A9A98] mt-0.5">Confidence 96%</span>
                    </span>
                  </div>
                  <div className="mt-3 h-1 rounded-full bg-[#F1F1EF] overflow-hidden"><div className="h-full bg-[#2563EB] rounded-full transition-all duration-1000" style={{ width: step >= 4 ? "96%" : "8%" }} /></div>
                  <div className="mt-3 space-y-1.5 text-[10.5px]">
                    {[["Cited alert", "82%", step >= 4 ? "82%" : "0%"], ["Human review", "14%", step >= 4 ? "14%" : "0%"], ["Dismissed", "4%", step >= 4 ? "4%" : "0%"]].map(([k, v, w]) => (
                      <div key={k} className="flex items-center gap-2"><span className="w-[74px] text-[#9A9A98]">{k}</span><span className="flex-1 h-1 rounded-full bg-[#F1F1EF] overflow-hidden"><span className="block h-full bg-[#111] rounded-full transition-all duration-1000" style={{ width: w as string }} /></span><span className="font-mono">{v}</span></div>
                    ))}
                  </div>
                </div>

                <div className={`absolute right-[14px] top-[276px] w-[196px] rounded-2xl border bg-white p-4 shadow-[0_10px_36px_rgba(0,0,0,0.07)] transition-all duration-700 ${step >= 5 ? "border-[#2563EB]/60 opacity-100" : "border-[#E8E6E1] opacity-45"}`}>
                  <div className="flex justify-between text-[9.5px] font-mono uppercase tracking-[0.14em] text-[#9A9A98]"><span>Inspector</span><span>ESC</span></div>
                  <div className="mt-2 text-[12.5px] font-semibold">Rule engine</div>
                  <div className="mt-2.5 space-y-1.5 text-[11px]">
                    {[["Version", "v87 · published"], ["Rules", "12 evaluated"], ["Overrides", "None"], ["Source", "p87 §4.2"]].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2"><span className="text-[#9A9A98]">{k}</span><span className="font-medium truncate">{v}</span></div>
                    ))}
                  </div>
                  <div className="mt-2.5 pt-2.5 border-t border-[#F1F1EF] text-[10.5px] text-[#2563EB]">● Traced to source · 4 records</div>
                </div>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="grid md:grid-cols-3 gap-px bg-[#EDEBE6] border-t border-[#EDEBE6]">
              <div className="bg-white p-5">
                <div className="flex justify-between text-[11.5px]"><span className="font-semibold">Throughput</span><span className="font-mono text-[#9A9A98]">frames / min</span></div>
                <div className="mt-4 flex items-end gap-[5px] h-[52px]">
                  {[16, 24, 13, 30, 20, 36, 18, 28, 15, 33, 22, 38, 19, 26, 31, 17, 34, 23, 40, 27].map((h, i) => (
                    <span key={i} className={`flex-1 rounded-t-[3px] transition-all duration-700 ${i === (step * 3 + 4) % 20 ? "bg-[#2563EB]" : "bg-[#E4E4E0]"}`} style={{ height: `${h + (i === (step * 3 + 4) % 20 ? 10 : 0)}px` }} />
                  ))}
                </div>
              </div>
              <div className="bg-white p-5">
                <div className="flex justify-between text-[11.5px]"><span className="font-semibold">Frame latency</span><span className="font-mono text-[#9A9A98]">24h</span></div>
                <div className="mt-5 flex items-baseline gap-2"><span className="text-[30px] font-semibold tracking-[-0.03em] leading-none">33</span><span className="text-[12px] text-[#9A9A98]">ms</span><span className="ml-auto text-[11px] font-mono text-[#2563EB]">no model call / frame</span></div>
              </div>
              <div className="bg-white p-5">
                <div className="flex justify-between text-[11.5px]"><span className="font-semibold">Event log</span><span className="flex items-center gap-1.5 text-[#2563EB] text-[10.5px] font-mono"><span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" style={{ animation: "pulse-dot 1.2s ease-in-out infinite" }} />live</span></div>
                <div className="mt-3 space-y-1.5 font-mono text-[10.5px] min-h-[62px]">
                  {logLines.map(([t, ev, src]) => (
                    <div key={ev} className="flex gap-2 whitespace-nowrap overflow-hidden"><span className="text-[#9A9A98]">{t}</span><span className={ev === "incident.cited" ? "text-[#2563EB] font-medium" : ""}>{ev}</span><span className="ml-auto text-[#9A9A98] truncate">{src}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-[#111] antialiased selection:bg-[#111] selection:text-white overflow-x-hidden">
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes drift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(32px,-18px) scale(1.05); } }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
        .rise { animation: rise .7s cubic-bezier(.16,1,.3,1) both; }
        .rise-1 { animation-delay: .06s; } .rise-2 { animation-delay: .12s; } .rise-3 { animation-delay: .18s; }
      `}</style>

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-[#EDEBE6] pointer-events-none">
        <div className="h-full bg-gradient-to-r from-[#818CF8] via-[#EAB308] to-[#22D3EE] will-change-transform" style={{ width: `${progress}%` }} />
      </div>

      {/* Floating pill nav */}
      <div className="sticky top-4 z-40 px-4">
        <header className="mx-auto max-w-[1120px] h-[56px] pl-5 pr-2 rounded-full border border-[#E8E6E1] bg-white/80 backdrop-blur-xl flex items-center justify-between shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
          <a href="/" className="flex items-center gap-2.5">
            <span className="h-6 w-6 bg-[#111] rounded-[7px] flex items-center justify-center">
              <span className="h-2 w-2 bg-[#FFD60A] rounded-[2px]" />
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.02em]">CiteSight</span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-[13px] text-[#6B6B6B]">
            <a href="/features" className="hover:text-[#111] transition-colors">Features</a>
            <a href="/zone" className="hover:text-[#111] transition-colors">Zone</a>
            <a href="/watch" className="hover:text-[#111] transition-colors">Watch</a>
            <a href="/eval" className="hover:text-[#111] transition-colors">Eval</a>
            <a href="/pricing" className="hover:text-[#111] transition-colors">Pricing</a>
          </nav>
          <a href="/watch" className="h-10 px-5 rounded-full bg-[#111] text-white text-[13px] font-semibold flex items-center hover:bg-black transition-colors">Watch live →</a>
        </header>
      </div>

      {/* HERO */}
      <section className="relative">
        {/* Soft wash that fades to page bg — no hard bottom edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[-100px] h-[840px]"
          style={{
            background:
              "radial-gradient(820px 480px at 50% 0%, rgba(129,140,248,0.20), transparent 72%)," +
              "radial-gradient(520px 400px at 14% 22%, rgba(34,211,238,0.12), transparent 74%)," +
              "radial-gradient(520px 400px at 86% 18%, rgba(167,139,250,0.14), transparent 74%)",
            WebkitMaskImage: "linear-gradient(180deg, black 0%, black 42%, transparent 88%)",
            maskImage: "linear-gradient(180deg, black 0%, black 42%, transparent 88%)",
          }}
        />

        <div className="relative mx-auto max-w-[1120px] px-6 pt-14 md:pt-[84px] pb-8 text-center">
          <h1 className="rise text-[48px] md:text-[96px] leading-[0.86] tracking-[-0.05em] font-extrabold">
            <span className="block">The rulebook</span>
            <span className="block bg-gradient-to-r from-[#6366F1] via-[#D97706] to-[#0891B2] bg-clip-text text-transparent">That watches.</span>
          </h1>
          <p className="rise rise-1 mt-6 mx-auto max-w-[520px] text-[15.5px] md:text-[16.5px] leading-[1.6] text-[#6B6B6B]">
            Upload a safety manual. CiteSight turns it into checks a camera can run — and every alert cites the exact page it came from, not a guess.
          </p>
          <div className="rise rise-2 mt-8 flex flex-wrap justify-center gap-3">
            <a href="/upload" className="h-[48px] px-7 rounded-full bg-[#111] text-white text-[13.5px] font-semibold flex items-center hover:bg-black transition-all">Upload rulebook →</a>
            <a href="/watch" className="h-[48px] px-7 rounded-full border border-[#E8E6E1] bg-white text-[13.5px] font-medium flex items-center hover:border-[#111] transition-all">Watch it work →</a>
          </div>
        </div>

        <div className="relative mx-auto max-w-[1020px] px-6 pb-12 md:pb-16">
          <div className="relative rounded-[24px] border border-[#E8E6E1] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="h-[44px] flex items-center justify-between px-5 border-b border-[#EDEBE6] bg-[#FAFAF8]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF3B30]" /><span className="h-2.5 w-2.5 rounded-full bg-[#FFD60A]" /><span className="h-2.5 w-2.5 rounded-full bg-[#30D158]" />
              </div>
              <div className="text-[11px] font-mono text-[#9A9A98]">safety_manual.pdf — Spark 1M</div>
              <div className="text-[10px] font-mono bg-[#111] text-white px-2.5 py-1 rounded-full font-medium">117 RULES FOUND</div>
            </div>

            <div className="grid md:grid-cols-2">
              <div className="p-6 md:p-7 border-b md:border-b-0 md:border-r border-[#EDEBE6]">
                <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#9A9A98]">From the manual — p86–88</div>
                <p className="mt-4 text-[15px] leading-[1.6] text-[#333]">§4.2 Personnel shall not be within 1.5 m of a running saw. LOTO tag visible during maintenance.</p>
                <div className="mt-5 inline-flex items-center text-[11px] font-mono bg-[#111] text-white px-3 py-1.5 rounded-full font-medium">→ p87 §4.2 → R-04.2</div>
                <div className="mt-7 space-y-2">
                  {[
                    ["R-04.2", "No person within 1.5 m of a running saw", "p87"],
                    ["R-07.1", "Gloves required at station 3", "p112"],
                    ["R-12.8", "No forklift in a pedestrian lane in use", "p203"],
                  ].map(([id, rule, page]) => (
                    <div key={id} className="flex items-center justify-between gap-3 rounded-xl border border-[#EDEBE6] bg-[#FAFAF9] px-4 py-3">
                      <span className="text-[11px] font-mono text-[#9A9A98]">{id}</span>
                      <span className="flex-1 text-[13px] text-[#333]">{rule}</span>
                      <span className="text-[11px] font-mono font-medium text-[#B45309]">{page}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-7 bg-[#0B0C16] text-white">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-white/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B30]" style={{ animation: "pulse-dot 1.2s ease-in-out infinite" }} /> Live — workshop camera
                  </span>
                  <span className="text-[11px] font-mono text-white/40">$0.35/hr</span>
                </div>

                <div className="relative mt-5 h-[190px] rounded-2xl border border-white/10 bg-[#070812] overflow-hidden">
                  <div aria-hidden className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
                  <div className="absolute left-[10%] top-[16%] w-[96px] h-[118px] rounded-xl border-2 border-[#30D158] bg-[#30D158]/10">
                    <span className="absolute -top-6 left-0 text-[10px] font-mono text-[#30D158]">person</span>
                  </div>
                  <div className="absolute left-[38%] top-[34%] w-[104px] h-[52px] rounded-xl border-2 border-[#FF453A] bg-[#FF453A]/10">
                    <span className="absolute -top-6 left-0 text-[10px] font-mono text-[#FF453A]">saw — running</span>
                  </div>
                  <div aria-hidden className="absolute left-[27%] top-[52%] w-[13%] border-t-2 border-dashed border-[#FFD60A]" />
                  <div className="absolute left-[29%] top-[40%] bg-[#FFD60A] text-black text-[10px] font-mono font-semibold px-2 py-1 rounded-md">0.8m &lt; 1.5m</div>
                </div>

                <div className="mt-4 rounded-2xl bg-white text-black p-4 flex items-start justify-between gap-3 overflow-hidden">
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold tracking-[-0.01em]">Person within 0.8 m of a running saw</div>
                    <div className="mt-1 text-[12px] leading-[1.5] text-black/55">Violates R-04.2. Clip 14:03:10–14:03:15 is attached for review.</div>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono font-semibold bg-black text-white px-2.5 py-1 rounded-full whitespace-nowrap">p87 §4.2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* White breathing space between hero and workflow */}
        <div className="h-16 md:h-24 bg-[#FCFCF9]" aria-hidden />
      </section>

      <AnimatedWorkflow />

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-[1120px] px-6 py-20 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[32px] md:text-[40px] leading-[0.95] tracking-[-0.04em] font-bold">How it works</h2>
          <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#9A9A98]">Auditable • Precise • Efficient at scale</span>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-[20px] border border-[#E8E6E1] bg-white p-7 hover:border-[#111] transition-colors">
              <div className="text-[11px] font-mono tracking-[0.14em] text-[#B45309]">{s.n}</div>
              <div className="mt-4 text-[17px] font-semibold tracking-[-0.02em] leading-[1.25]">{s.t}</div>
              <p className="mt-3 text-[14px] leading-[1.6] text-[#6B6B6B]">{s.d}</p>
              <div className="mt-6 rounded-xl border border-[#EDEBE6] bg-[#F6F6F5] px-4 py-3 text-[11px] font-mono leading-[1.5] text-[#333] break-words">{s.code}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NUMBERS */}
      <section className="mx-auto max-w-[1120px] px-6 pb-20 md:pb-24">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <h2 className="text-[32px] md:text-[40px] leading-[0.95] tracking-[-0.04em] font-bold">Numbers judges<br /><span className="text-[#9A9A98]">remember.</span></h2>
            <p className="mt-5 text-[15px] leading-[1.6] text-[#6B6B6B] max-w-[360px]">Precision and recall per rule on labelled video, plus cost per hour against a model call on every few frames.</p>
            <div className="mt-7 inline-flex h-8 px-4 rounded-full bg-[#111] text-white text-[12px] font-semibold items-center">12x more efficient</div>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 rounded-[20px] overflow-hidden border border-[#111]">
            <div className="bg-[#F6F6F5] p-7">
              <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#9A9A98]">Vision model, every few frames</div>
              <div className="mt-6 space-y-3 text-[13px]">
                {[["Precision", "0.62"], ["Recall", "0.71"], ["Cost / hr / camera", "$4.20"], ["Audit trail", "None"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3"><span className="text-[#6B6B6B]">{k}</span><span className="font-semibold">{v}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-[#FFD60A] text-black p-7">
              <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-black/50">CiteSight geometry</div>
              <div className="mt-6 space-y-3 text-[13px]">
                {[["Precision", "0.89"], ["Recall", "0.84"], ["Cost / hr / camera", "$0.35"], ["Audit trail", "Page + clip"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3"><span className="text-black/60">{k}</span><span className="font-bold">{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPLEMENTATION */}
      <section className="border-t border-[#EDEBE6] bg-[#F6F6F5]">
        <div className="mx-auto max-w-[1120px] px-6 py-20 md:py-24">
          <h2 className="text-[32px] md:text-[40px] leading-[0.95] tracking-[-0.04em] font-bold">How you implement at scale<br /><span className="text-[#9A9A98]">for any workplace.</span></h2>
          <div className="mt-10 grid md:grid-cols-4 gap-4">
            {IMPLEMENT.map((c) => (
              <div key={c.n} className={`rounded-[20px] p-7 ${c.accent ? "bg-[#FFD60A] text-black" : "border border-[#E8E6E1] bg-white"}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-bold ${c.accent ? "bg-black text-[#FFD60A]" : "bg-[#111] text-white"}`}>{c.n}</div>
                <div className="mt-5 text-[15px] font-semibold tracking-[-0.01em] leading-[1.3]">{c.t}</div>
                <p className={`mt-3 text-[13px] leading-[1.6] ${c.accent ? "text-black/65" : "text-[#6B6B6B]"}`}>{c.d}</p>
                <div className={`mt-5 inline-flex text-[10px] font-mono px-2.5 py-1 rounded-md ${c.accent ? "bg-black text-white" : "bg-[#F6F6F5] border border-[#EDEBE6] text-[#6B6B6B]"}`}>{c.badge}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-[360px] left-1/2 -translate-x-1/2 h-[560px] w-[860px] rounded-full bg-[#818CF8]/12 blur-[130px]" />
        </div>
        <div className="relative mx-auto max-w-[1120px] px-6 py-24 text-center">
          <h2 className="text-[40px] md:text-[64px] leading-[0.88] tracking-[-0.05em] font-extrabold uppercase">Your manual.<br /><span className="bg-gradient-to-r from-[#6366F1] via-[#D97706] to-[#0891B2] bg-clip-text text-transparent">Enforced.</span></h2>
          <p className="mt-6 mx-auto max-w-[480px] text-[15px] leading-[1.7] text-[#6B6B6B]">From a workshop floor to a warehouse aisle — if it is written in your rulebook, CiteSight can watch for it and cite the page.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="/upload" className="h-[52px] px-8 rounded-full bg-[#111] text-white text-[14px] font-semibold flex items-center hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all">Upload rulebook →</a>
            <a href="/zone" className="h-[52px] px-8 rounded-full border border-[#E8E6E1] bg-white text-[14px] font-medium flex items-center hover:border-[#111] transition-all">Draw zones →</a>
            <a href="/watch" className="h-[52px] px-8 rounded-full border border-[#E8E6E1] bg-white text-[14px] font-medium flex items-center hover:border-[#111] transition-all">Watch live →</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#EDEBE6]">
        <div className="mx-auto max-w-[1120px] px-6 py-12 grid md:grid-cols-12 gap-8 text-[13px]">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 bg-[#111] rounded-[7px] flex items-center justify-center"><span className="h-2 w-2 bg-[#FFD60A] rounded-[2px]" /></span>
              <span className="font-semibold tracking-[-0.02em]">CiteSight</span>
            </div>
            <p className="mt-4 text-[#6B6B6B] leading-[1.6] max-w-[320px]">A long manual, compiled into checks a camera can run — with the page cited on every alert.</p>
          </div>
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            <div><div className="font-semibold">Product</div><div className="mt-3 space-y-2 text-[#6B6B6B]"><a href="/features" className="block hover:text-[#111] transition-colors">Features</a><a href="/pricing" className="block hover:text-[#111] transition-colors">Pricing</a><a href="/watch" className="block hover:text-[#111] transition-colors">Live watch</a><a href="/eval" className="block hover:text-[#111] transition-colors">Eval</a></div></div>
            <div><div className="font-semibold">Workflow</div><div className="mt-3 space-y-2 text-[#6B6B6B]"><a href="/upload" className="block hover:text-[#111] transition-colors">Upload</a><a href="/zone" className="block hover:text-[#111] transition-colors">Zone</a><a href="/incidents" className="block hover:text-[#111] transition-colors">Incidents</a><a href="/checked" className="block hover:text-[#111] transition-colors">Checked rules</a></div></div>
            <div><div className="font-semibold">Legal</div><div className="mt-3 space-y-2 text-[#6B6B6B]"><a href="/privacy" className="block hover:text-[#111] transition-colors">Privacy</a><a href="/terms" className="block hover:text-[#111] transition-colors">Terms</a><a href="/manifesto" className="block hover:text-[#111] transition-colors">Manifesto</a></div></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
