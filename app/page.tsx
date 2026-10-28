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
    <div className="min-h-screen bg-[#05060F] text-white antialiased selection:bg-[#FFD60A] selection:text-black overflow-x-hidden">
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes drift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-30px) scale(1.08); } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
        .rise { animation: rise .9s cubic-bezier(.16,1,.3,1) both; }
        .rise-1 { animation-delay: .08s; } .rise-2 { animation-delay: .16s; } .rise-3 { animation-delay: .26s; } .rise-4 { animation-delay: .38s; }
      `}</style>

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-white/10 pointer-events-none">
        <div className="h-full bg-gradient-to-r from-[#818CF8] via-[#FFD60A] to-[#22D3EE] will-change-transform" style={{ width: `${progress}%` }} />
      </div>

      {/* Floating pill nav — Arbiter style */}
      <div className="sticky top-4 z-40 px-4">
        <header className="mx-auto max-w-[1120px] h-[56px] pl-5 pr-2 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-xl flex items-center justify-between shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
          <a href="/" className="flex items-center gap-2.5">
            <span className="h-6 w-6 bg-white rounded-[7px] flex items-center justify-center">
              <span className="h-2 w-2 bg-[#05060F] rounded-[2px]" />
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.02em]">CiteSight</span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-[13px] text-white/60">
            <a href="/features" className="hover:text-white transition-colors">Features</a>
            <a href="/zone" className="hover:text-white transition-colors">Zone</a>
            <a href="/watch" className="hover:text-white transition-colors">Watch</a>
            <a href="/eval" className="hover:text-white transition-colors">Eval</a>
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>
          <a href="/watch" className="h-10 px-5 rounded-full bg-white text-black text-[13px] font-semibold flex items-center hover:bg-[#FFD60A] transition-colors">Watch live →</a>
        </header>
      </div>

      {/* HERO — bold gradient, grain, retro grid */}
      <section className="relative overflow-hidden">
        {/* Gradient mesh */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-[320px] left-1/2 -translate-x-1/2 h-[640px] w-[900px] rounded-full bg-[#4338CA]/50 blur-[140px]" style={{ animation: "drift 14s ease-in-out infinite" }} />
          <div className="absolute top-[180px] -left-[160px] h-[420px] w-[420px] rounded-full bg-[#0E7490]/40 blur-[120px]" style={{ animation: "drift 18s ease-in-out infinite" }} />
          <div className="absolute top-[240px] -right-[140px] h-[420px] w-[420px] rounded-full bg-[#7C3AED]/40 blur-[120px]" style={{ animation: "drift 16s ease-in-out infinite" }} />
          {/* Retro horizon grid */}
          <div className="absolute bottom-0 left-[-20%] right-[-20%] h-[300px] opacity-[0.13]" style={{ backgroundImage: "linear-gradient(rgba(129,140,248,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,.7) 1px, transparent 1px)", backgroundSize: "56px 56px", transform: "perspective(420px) rotateX(62deg)", transformOrigin: "bottom", maskImage: "linear-gradient(to top, black 30%, transparent 95%)", WebkitMaskImage: "linear-gradient(to top, black 30%, transparent 95%)" }} />
          {/* Grain */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        </div>

        <div className="relative mx-auto max-w-[1120px] px-6 pt-16 md:pt-24 pb-10 text-center">
          <div className="rise inline-flex items-center gap-2 h-8 px-4 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur text-[11px] font-mono uppercase tracking-[0.14em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#30D158]" style={{ animation: "pulse-dot 1.6s ease-in-out infinite" }} />
            Workplace safety, cited by page
          </div>

          <h1 className="rise rise-1 mt-8 text-[52px] md:text-[104px] leading-[0.84] tracking-[-0.05em] font-extrabold uppercase">
            <span className="block">The rulebook</span>
            <span className="block bg-gradient-to-r from-[#A5B4FC] via-[#FFD60A] to-[#67E8F9] bg-clip-text text-transparent">that watches.</span>
          </h1>

          <p className="rise rise-2 mt-7 mx-auto max-w-[540px] text-[16px] md:text-[17px] leading-[1.6] text-white/60">
            Upload a safety manual. CiteSight turns it into checks a camera can run — and every alert cites the exact page it came from, not a guess.
          </p>

          <div className="rise rise-3 mt-9 flex flex-wrap justify-center gap-3">
            <a href="/upload" className="h-[52px] px-8 rounded-full bg-white text-black text-[14px] font-semibold flex items-center hover:bg-[#FFD60A] hover:scale-[1.02] active:scale-[0.98] transition-all">Upload rulebook →</a>
            <a href="/watch" className="h-[52px] px-8 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur text-[14px] font-medium flex items-center hover:bg-white hover:text-black transition-all">Watch it work →</a>
          </div>
        </div>

        {/* Product frame — single, floating, glowing */}
        <div className="rise rise-4 relative mx-auto max-w-[1020px] px-6 pb-16">
          <div aria-hidden className="absolute inset-x-16 top-10 bottom-0 bg-[#6366F1]/25 blur-[90px] rounded-full pointer-events-none" />
          <div className="relative rounded-[24px] border border-white/12 bg-[#0A0C1C]/90 backdrop-blur-xl shadow-[0_48px_120px_rgba(0,0,0,0.55)] overflow-hidden">
            <div className="h-[44px] flex items-center justify-between px-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF3B30]" /><span className="h-2.5 w-2.5 rounded-full bg-[#FFD60A]" /><span className="h-2.5 w-2.5 rounded-full bg-[#30D158]" />
              </div>
              <div className="text-[11px] font-mono text-white/40">safety_manual.pdf — Spark 1M</div>
              <div className="text-[10px] font-mono bg-white text-black px-2.5 py-1 rounded-full font-medium">117 RULES FOUND</div>
            </div>

            <div className="grid md:grid-cols-2">
              <div className="p-6 md:p-7 border-b md:border-b-0 md:border-r border-white/10">
                <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/35">From the manual — p86–88</div>
                <p className="mt-4 text-[15px] leading-[1.6] text-white/85">§4.2 Personnel shall not be within 1.5 m of a running saw. LOTO tag visible during maintenance.</p>
                <div className="mt-5 inline-flex items-center text-[11px] font-mono bg-[#FFD60A] text-black px-3 py-1.5 rounded-full font-medium">→ p87 §4.2 → R-04.2</div>
                <div className="mt-7 space-y-2">
                  {[
                    ["R-04.2", "No person within 1.5 m of a running saw", "p87"],
                    ["R-07.1", "Gloves required at station 3", "p112"],
                    ["R-12.8", "No forklift in a pedestrian lane in use", "p203"],
                  ].map(([id, rule, page]) => (
                    <div key={id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                      <span className="text-[11px] font-mono text-white/40">{id}</span>
                      <span className="flex-1 text-[13px] text-white/80">{rule}</span>
                      <span className="text-[11px] font-mono text-[#FFD60A]">{page}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-7 bg-black/40">
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

                <div className="mt-4 rounded-2xl bg-white text-black p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[13px] font-semibold tracking-[-0.01em]">Person within 0.8 m of a running saw</div>
                    <div className="mt-1 text-[12px] leading-[1.5] text-black/55">Violates R-04.2. Clip 14:03:10–14:03:15 is attached for review.</div>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono font-semibold bg-black text-white px-2.5 py-1 rounded-full">p87 §4.2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div aria-hidden className="relative border-y border-white/10 py-4 overflow-hidden">
          <div className="flex w-max gap-10 whitespace-nowrap text-[12px] font-mono uppercase tracking-[0.22em] text-white/35" style={{ animation: "marquee 28s linear infinite" }}>
            {[0, 1].map((n) => (
              <span key={n} className="flex gap-10">
                <span>Upload</span><span className="text-[#FFD60A]">✦</span><span>Compile</span><span className="text-[#FFD60A]">✦</span><span>Segment</span><span className="text-[#FFD60A]">✦</span><span>Measure</span><span className="text-[#FFD60A]">✦</span><span>Alert with a citation</span><span className="text-[#FFD60A]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-[1120px] px-6 py-20 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[32px] md:text-[40px] leading-[0.95] tracking-[-0.04em] font-bold">How it works</h2>
          <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/35">Auditable • Precise • Efficient at scale</span>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-[20px] border border-white/10 bg-white/[0.04] p-7 hover:bg-white/[0.07] hover:border-white/20 transition-colors">
              <div className="text-[11px] font-mono tracking-[0.14em] text-[#FFD60A]">{s.n}</div>
              <div className="mt-4 text-[17px] font-semibold tracking-[-0.02em] leading-[1.25]">{s.t}</div>
              <p className="mt-3 text-[14px] leading-[1.6] text-white/55">{s.d}</p>
              <div className="mt-6 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[11px] font-mono leading-[1.5] text-white/70 break-words">{s.code}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NUMBERS */}
      <section className="mx-auto max-w-[1120px] px-6 pb-20 md:pb-24">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <h2 className="text-[32px] md:text-[40px] leading-[0.95] tracking-[-0.04em] font-bold">Numbers judges<br /><span className="text-white/35">remember.</span></h2>
            <p className="mt-5 text-[15px] leading-[1.6] text-white/55 max-w-[360px]">Precision and recall per rule on labelled video, plus cost per hour against a model call on every few frames.</p>
            <div className="mt-7 inline-flex h-8 px-4 rounded-full bg-white text-black text-[12px] font-semibold items-center">12x more efficient</div>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 rounded-[20px] overflow-hidden border border-white/10">
            <div className="bg-white/[0.04] p-7">
              <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/35">Vision model, every few frames</div>
              <div className="mt-6 space-y-3 text-[13px]">
                {[["Precision", "0.62"], ["Recall", "0.71"], ["Cost / hr / camera", "$4.20"], ["Audit trail", "None"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3"><span className="text-white/45">{k}</span><span className="font-semibold">{v}</span></div>
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
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-[1120px] px-6 py-20 md:py-24">
          <h2 className="text-[32px] md:text-[40px] leading-[0.95] tracking-[-0.04em] font-bold">How you implement at scale<br /><span className="text-white/35">for any workplace.</span></h2>
          <div className="mt-10 grid md:grid-cols-4 gap-4">
            {IMPLEMENT.map((c) => (
              <div key={c.n} className={`rounded-[20px] p-7 ${c.accent ? "bg-[#FFD60A] text-black" : "border border-white/10 bg-white/[0.04]"}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-bold ${c.accent ? "bg-black text-[#FFD60A]" : "bg-white text-black"}`}>{c.n}</div>
                <div className="mt-5 text-[15px] font-semibold tracking-[-0.01em] leading-[1.3]">{c.t}</div>
                <p className={`mt-3 text-[13px] leading-[1.6] ${c.accent ? "text-black/65" : "text-white/55"}`}>{c.d}</p>
                <div className={`mt-5 inline-flex text-[10px] font-mono px-2.5 py-1 rounded-md ${c.accent ? "bg-black text-white" : "bg-white/10 text-white/70"}`}>{c.badge}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-[360px] left-1/2 -translate-x-1/2 h-[560px] w-[860px] rounded-full bg-[#4338CA]/40 blur-[130px]" />
        </div>
        <div className="relative mx-auto max-w-[1120px] px-6 py-24 text-center">
          <h2 className="text-[40px] md:text-[64px] leading-[0.88] tracking-[-0.05em] font-extrabold uppercase">Your manual.<br /><span className="bg-gradient-to-r from-[#A5B4FC] via-[#FFD60A] to-[#67E8F9] bg-clip-text text-transparent">Enforced.</span></h2>
          <p className="mt-6 mx-auto max-w-[480px] text-[15px] leading-[1.7] text-white/55">From a workshop floor to a warehouse aisle — if it is written in your rulebook, CiteSight can watch for it and cite the page.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="/upload" className="h-[52px] px-8 rounded-full bg-white text-black text-[14px] font-semibold flex items-center hover:bg-[#FFD60A] hover:scale-[1.02] active:scale-[0.98] transition-all">Upload rulebook →</a>
            <a href="/zone" className="h-[52px] px-8 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur text-[14px] font-medium flex items-center hover:bg-white hover:text-black transition-all">Draw zones →</a>
            <a href="/watch" className="h-[52px] px-8 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur text-[14px] font-medium flex items-center hover:bg-white hover:text-black transition-all">Watch live →</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-[1120px] px-6 py-12 grid md:grid-cols-12 gap-8 text-[13px]">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 bg-white rounded-[7px] flex items-center justify-center"><span className="h-2 w-2 bg-[#05060F] rounded-[2px]" /></span>
              <span className="font-semibold tracking-[-0.02em]">CiteSight</span>
            </div>
            <p className="mt-4 text-white/45 leading-[1.6] max-w-[320px]">A long manual, compiled into checks a camera can run — with the page cited on every alert.</p>
          </div>
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            <div><div className="font-semibold">Product</div><div className="mt-3 space-y-2 text-white/45"><a href="/features" className="block hover:text-white transition-colors">Features</a><a href="/pricing" className="block hover:text-white transition-colors">Pricing</a><a href="/watch" className="block hover:text-white transition-colors">Live watch</a><a href="/eval" className="block hover:text-white transition-colors">Eval</a></div></div>
            <div><div className="font-semibold">Workflow</div><div className="mt-3 space-y-2 text-white/45"><a href="/upload" className="block hover:text-white transition-colors">Upload</a><a href="/zone" className="block hover:text-white transition-colors">Zone</a><a href="/incidents" className="block hover:text-white transition-colors">Incidents</a><a href="/checked" className="block hover:text-white transition-colors">Checked rules</a></div></div>
            <div><div className="font-semibold">Legal</div><div className="mt-3 space-y-2 text-white/45"><a href="/privacy" className="block hover:text-white transition-colors">Privacy</a><a href="/terms" className="block hover:text-white transition-colors">Terms</a><a href="/manifesto" className="block hover:text-white transition-colors">Manifesto</a></div></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
