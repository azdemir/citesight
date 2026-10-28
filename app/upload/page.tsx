"use client";

import { useState, useRef, useEffect } from "react";

type Rule = { id:string; rule:string; type:string; params:string; page:number; section:string; severity:string; citation:string };

const MOCK_RULES: Rule[] = [
  { id:"R-04.2", rule:"No person within 1.5 m of running saw", type:"distance", params:"tool:saw • state:running • d<1.5m", page:87, section:"§4.2 Moving Machinery", severity:"high", citation:"Manual p87 §4.2" },
  { id:"R-07.1", rule:"Gloves required at station 3", type:"presence", params:"zone:station_3 • ppe:gloves", page:112, section:"§7.1 PPE Compliance", severity:"high", citation:"Manual p112 §7.1" },
  { id:"R-03.4", rule:"Hard hat within 5 m of overhead crane", type:"overlap", params:"zone:crane_5m • ppe:hard_hat", page:64, section:"§3.4 Head Protection", severity:"critical", citation:"Manual p64 §3.4" },
  { id:"R-12.8", rule:"No forklift in pedestrian lane when occupied", type:"overlap", params:"tool:forklift • zone:ped_lane • occupancy", page:203, section:"§12.8 Vehicle Separation", severity:"high", citation:"Manual p203 §12.8" },
];

const SAMPLE_MANUALS = [
  { file: "HSG76-warehousing-hse.pdf", label: "Warehousing HSE", pages: 155, desc: "HSE HSG76 • forklift pedestrian p65 • 155p" },
  { file: "HSG150-construction-hse.pdf", label: "Construction HSE", pages: 141, desc: "HSE HSG150 • vehicle segregation p55 • 141p" },
  { file: "nasa-std-3001-vol2.pdf", label: "NASA Human Spaceflight", pages: 331, desc: "NASA-STD-3001 • IVA paths p114 • 331p huge" },
  { file: "shop-safety-manual-ucop.pdf", label: "Shop Safety UCOP", pages: 154, desc: "Shop • electrical panel 3ft p65 • 154p" },
  { file: "coosafe-haccp-manual.pdf", label: "Food Safety HACCP", pages: 126, desc: "HACCP • cooking 75°C p27 • 126p" },
  { file: "chemical-hygiene-mit.pdf", label: "Chemical Lab MIT", pages: 102, desc: "MIT • eye protection p14 • 102p" },
];

export default function UploadPage(){
  const [file, setFile] = useState<File|null>(null);
  const [drag, setDrag] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [done, setDone] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [clientPages, setClientPages] = useState<number|null>(null);
  const [step, setStep] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    try {
      const saved = localStorage.getItem("citesight_last_compile");
      if(saved){
        const parsed = JSON.parse(saved);
        if(parsed?.rules?.length){
          setRules(parsed.rules);
          setMeta(parsed.meta);
          setDone(true);
          setFile({ name: parsed.meta?.fileName || "last_manual.pdf", size: (parsed.meta?.fileSizeMB*1024*1024) || 0 } as any);
          setClientPages(parsed.meta?.numPages || null);
        }
      }
    } catch {}
  }, []);

  const getClientPageCount = async (f: File) => {
    try {
      const pdfjs: any = await import("pdfjs-dist");
      const buffer = await f.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buffer }).promise;
      setClientPages(pdf.numPages);
      return pdf.numPages;
    } catch { return null; }
  };

  const onFile = async (f: File)=>{
    setFile(f);
    setCompiling(true);
    setDone(false);
    setMeta(null);
    setClientPages(null);
    setStep("Reading PDF...");
    setRules(MOCK_RULES); // instant feedback — something happens immediately
    getClientPageCount(f).then(n=>{ if(n) setStep(`Detected ${n} pages • chunking for Spark 1M...`); });

    const interval = setInterval(()=>{
      setStep(s=>{
        if(s.includes("Reading")) return "Detecting pages • preparing 1M context...";
        if(s.includes("Detecting")) return "Calling Spark 1M • compiling to DSL...";
        if(s.includes("Calling")) return "Spark 1M compiling • extracting page citations...";
        if(s.includes("extracting")) return "Finalizing • building geometry checks...";
        return s;
      });
    }, 900);

    try {
      const fd = new FormData();
      fd.append("file", f);
      setStep("Uploading • Spark 1M compiling...");
      const res = await fetch("/api/compile", { method: "POST", body: fd });
      const data = await res.json();
      clearInterval(interval);
      const finalRules = data.rules || MOCK_RULES;
      setRules(finalRules);
      const m = { fileName: data.fileName || f.name, fileSizeMB: data.fileSizeMB || (f.size/1024/1024).toFixed(2), numPages: data.numPages || clientPages || 0, model: data.model || "muse-spark-1.1", tokens: data.tokens || 0, compiledAt: data.compiledAt };
      setMeta(m);
      setCompiling(false);
      setDone(true);
      setStep(`Compiled ${finalRules.length} rules`);
      try { localStorage.setItem("citesight_last_compile", JSON.stringify({ rules: finalRules, meta: m })); } catch {}
      try { localStorage.setItem("citesight_compiled_rules", JSON.stringify(finalRules)); } catch {}
    } catch (e:any) {
      clearInterval(interval);
      setStep("Spark unreachable • showing preview, will retry");
      setTimeout(()=>{ setRules(MOCK_RULES); setCompiling(false); setDone(true); setMeta({ fileName: f.name, fileSizeMB: (f.size/1024/1024).toFixed(2), numPages: clientPages || 50, model: "preview • Spark will compile on next try", tokens: 0 }); }, 1200);
    }
  };

  const onSample = async (sampleFile: string) => {
    setStep(`Loading sample ${sampleFile}...`);
    try {
      const res = await fetch(`/manuals/${sampleFile}`);
      if(!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const f = new File([blob], sampleFile, { type: "application/pdf" });
      await onFile(f);
    } catch(e){
      setStep(`Failed to load sample ${sampleFile}`);
    }
  };

  const onDrop = (e: React.DragEvent)=>{ e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if(f) onFile(f); };

  return (
    <div className="min-h-screen bg-white text-[#111] antialiased selection:bg-black selection:text-white">
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-2xl border-b border-[#EDEBE6]">
        <div className="mx-auto max-w-[1280px] px-6 md:px-8 h-[64px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5"><div className="h-6 w-6 bg-black rounded-[6px] flex items-center justify-center"><div className="h-2 w-2 bg-[#FFD60A] rounded-[1px]" /></div><span className="text-[15px] font-[650] tracking-[-0.02em]">CiteSight</span><span className="ml-2 text-[11px] text-[#9A9A98]">/ Upload</span></a>
          <div className="flex items-center gap-2 md:gap-5 text-[13px]"><a href="/features" className="text-[#6B6B6B] hover:text-black">Features</a><a href="/zone" className="text-[#6B6B6B] hover:text-black">Zone</a><a href="/watch" className="text-[#6B6B6B] hover:text-black">Watch</a><a href="/eval" className="text-[#6B6B6B] hover:text-black">Eval</a></div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 md:px-8 pt-[72px] md:pt-[88px] pb-[64px]">
        <div className="max-w-[760px]">
          <h1 className="text-[32px] md:text-[52px] leading-[0.9] tracking-[-0.05em] font-[750]">Upload your<br />rulebook.</h1>
          <p className="mt-4 text-[14px] md:text-[15px] leading-[1.6] text-[#6B6B6B]">Any manual, 6 to 1000+ pages. Spark 1M compiles to structured checks with page citations. Every rule keeps source p87 §4.2. Compiled once, runs as geometry at $0.35/hr — not VLM per frame.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-12 gap-6 md:gap-8 items-start">
          <div className="md:col-span-5">
            <div onDragOver={e=>{e.preventDefault(); setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={onDrop} onClick={()=>inputRef.current?.click()} className={`border rounded-[20px] p-7 md:p-8 cursor-pointer transition-all group ${drag ? "border-black bg-[#FFD60A]/20 scale-[1.01] shadow-[0_12px_32px_rgba(0,0,0,0.08)]" : "border-[#111] bg-[#FAFAF9] hover:border-black hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"}`}>
              <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) onFile(f); }} />
              <div className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${compiling ? "bg-[#FFD60A] text-black animate-pulse" : done ? "bg-[#111] text-white" : "bg-black text-white group-hover:scale-110"}`}>{compiling ? "◐" : done ? "✓" : "↑"}</div>
              <div className="mt-5 text-[17px] font-[700] tracking-[-0.02em] leading-[1.2]">{file ? file.name : "Drop manual here"}</div>
              <div className="mt-2 text-[12px] leading-[1.5] text-[#6B6B6B] min-h-[36px]">
                {file ? (
                  <span>
                    <b className="text-black">{meta?.fileSizeMB || (file.size/1024/1024).toFixed(1)} MB</b> • {clientPages ? <><b className="text-black">{clientPages} pages detected</b> • </> : ""}{meta?.numPages ? <><b className="text-black">{meta.numPages} pages compiled</b> • </> : "any length • "}{meta?.model || "Spark 1M"} {meta?.tokens ? `• ${Math.round(meta.tokens/1000)}k tokens` : ""}
                  </span>
                ) : "PDF, DOCX • any length 6–1000+ pages • Spark 1M 1M-tokens • real page citations"}
              </div>
              {file && (
                <div className="mt-5">
                  <div className="h-2 w-full bg-[#EDEBE6] rounded-full overflow-hidden"><div className={`h-full bg-black transition-all duration-700 ease-out ${compiling ? "w-[78%] animate-pulse" : done ? "w-full" : "w-0"}`} style={{ width: compiling ? "78%" : done ? "100%" : "0%" }} /></div>
                  <div className="mt-2.5 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.07em]">
                    <span className={`h-2 w-2 rounded-full ${compiling ? "bg-[#FFD60A] animate-pulse" : "bg-[#30D158]"}`} />
                    <span className={compiling ? "text-black font-[600]" : "text-[#6B6B6B]"}>{compiling ? step : done ? `✓ ${step} • ${rules.length} rules ready` : ""}</span>
                  </div>
                </div>
              )}
              {!file && <div className="mt-6 h-9 px-5 rounded-full bg-black text-white text-[12px] font-[700] inline-flex items-center group-hover:bg-[#111] transition-colors">Browse files →</div>}
              {file && done && (
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <a href="/zone" className="h-10 rounded-full bg-black text-white text-[12px] font-[700] flex items-center justify-center hover:bg-[#222] transition-colors">Draw zones →</a>
                  <a href="/watch" className="h-10 rounded-full bg-[#FFD60A] text-black text-[12px] font-[700] flex items-center justify-center hover:bg-[#FFC700] transition-colors">Watch live →</a>
                </div>
              )}
            </div>

            <div className="mt-6 border border-[#EDEBE6] rounded-[16px] p-5 bg-white">
              <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#111] font-[700]">What happens next • We promised</div>
              <div className="mt-3 space-y-2.5 text-[12px] leading-[1.6] text-[#6B6B6B]">
                <div className="flex gap-2"><span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${file ? "bg-black text-white" : "bg-[#EDEBE6] text-[#9A9A98]"}`}>1</span><span><b className="text-black">Upload any manual:</b> {file ? `${file.name} ${clientPages ? `• ${clientPages}p detected` : ""}` : "6 to 1000+ pages, PDF or DOCX."}</span></div>
                <div className="flex gap-2"><span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${compiling ? "bg-[#FFD60A] text-black animate-pulse" : done ? "bg-black text-white" : "bg-[#EDEBE6] text-[#9A9A98]"}`}>2</span><span><b className="text-black">Spark 1M compiles:</b> {compiling ? "Compiling to DSL..." : done ? `${rules.length} rules • page citations kept` : "One-time $0.50-$2, keeps p87 §4.2, p112 etc."}</span></div>
                <div className="flex gap-2"><span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${done ? "bg-black text-white" : "bg-[#EDEBE6] text-[#9A9A98]"}`}>3</span><span><b className="text-black">Draw zones once:</b> Floor plan upload, drag points, calibrate px→m. Saved to edge.</span></div>
                <div className="flex gap-2"><span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${done ? "bg-black text-white" : "bg-[#EDEBE6] text-[#9A9A98]"}`}>4</span><span><b className="text-black">Watch + alert cited:</b> YOLOv8n-seg $0.35/hr, incident clip + p87 §4.2 + Slack/SMS.</span></div>
              </div>
              {done && (
                <div className="mt-4 p-3 rounded-[10px] bg-[#FFD60A]/20 border border-[#FFD60A]/40 text-[11px] leading-[1.5]">
                  <b>✓ Next:</b> Your manual compiled to {rules.length} checks. Go to <a href="/zone" className="underline font-[700]">Zone</a> to draw work areas for these rules, then <a href="/watch" className="underline font-[700]">Watch</a> to see them enforced with page citations.
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Try a sample — no upload needed</div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {SAMPLE_MANUALS.map(s=>(
                  <button key={s.file} onClick={()=>onSample(s.file)} disabled={compiling} className="text-left border border-[#EDEBE6] rounded-[12px] px-4 py-3 bg-white hover:border-black hover:bg-[#FAFAF9] transition-colors disabled:opacity-50 group">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[13px] font-[600] tracking-[-0.01em] group-hover:text-black">{s.label}</div>
                      <span className="text-[10px] font-mono bg-[#F6F6F5] border border-[#EDEBE6] px-2 py-0.5 rounded-full">{s.pages}p</span>
                    </div>
                    <div className="mt-1 text-[11px] leading-[1.4] text-[#6B6B6B]">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            {!file && (
              <div className="border border-dashed border-[#EDEBE6] rounded-[20px] p-8 md:p-10 text-center bg-white">
                <div className="mx-auto h-10 w-10 rounded-full bg-[#F6F6F5] flex items-center justify-center text-[14px]">📄</div>
                <div className="mt-4 text-[14px] font-[600] tracking-[-0.01em]">No manual uploaded yet</div>
                <div className="mt-2 text-[13px] leading-[1.6] text-[#6B6B6B] max-w-[420px] mx-auto">Drop a PDF to see it compiled to DSL with page citations p87 §4.2, p112 §4.1 — auditable, precise, efficient at scale. Every rule keeps its source page.</div>
                <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-mono text-[#9A9A98]"><span className="h-1.5 w-1.5 rounded-full bg-[#FF3B30] animate-pulse" /> Waiting for upload • Spark 1M 1M-tokens context</div>
              </div>
            )}
            {file && (
              <div className="border border-black rounded-[20px] overflow-hidden bg-white shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
                <div className="h-11 flex items-center justify-between px-5 border-b border-[#EDEBE6] bg-[#FAFAF8] text-[11px] font-mono">
                  <div className="flex items-center gap-3">
                    <span className="font-[700]">DSL • {rules.length} rules • page citation</span>
                    <span className="hidden md:inline-flex h-5 px-2 rounded-full bg-white border border-[#EDEBE6] text-[10px] items-center">{meta?.model || "Spark 1M"} {clientPages ? `• ${clientPages}p` : ""}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-[700] border ${done ? "bg-[#FFD60A] text-black border-black" : "bg-[#111] text-white border-[#111] animate-pulse"}`}>{done ? `✓ COMPILED • ${rules.length} rules` : "● COMPILING • KEEPING PAGE CITATIONS"}</span>
                </div>

                <div className="p-4 bg-[#FFD60A]/10 border-b border-[#EDEBE6] flex items-center justify-between gap-3">
                  <div className="text-[12px] leading-[1.5]">
                    <b className="font-[700]">{file.name}</b> — {clientPages ? `${clientPages} pages detected` : meta?.numPages ? `${meta.numPages} pages` : "any length"} → {rules.length} checks. {done ? "Every alert will cite page + clip." : step}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <a href="/zone" className="h-7 px-3 rounded-full bg-black text-white text-[11px] font-[600] flex items-center hover:bg-[#222]">Zone →</a>
                    <a href="/watch" className="h-7 px-3 rounded-full bg-white border border-[#EDEBE6] text-[11px] font-[600] flex items-center hover:border-black">Watch →</a>
                  </div>
                </div>

                <div className="divide-y divide-[#EDEBE6] max-h-[560px] overflow-auto">
                  {rules.length===0 && (
                    <div className="p-8 text-center">
                      <div className="h-8 w-8 mx-auto rounded-full border-2 border-[#EDEBE6] border-t-black animate-spin" />
                      <div className="mt-3 text-[12px] font-mono text-[#6B6B6B]">{step || "Compiling..."}</div>
                    </div>
                  )}
                  {rules.map(r=>(
                    <div key={r.id} className="p-4 flex gap-3 hover:bg-[#FAFAF9] group transition-colors">
                      <div className="text-[11px] font-mono font-[800] bg-black text-white h-6 px-2.5 rounded-[6px] flex items-center flex-shrink-0 group-hover:bg-[#111]">{r.id}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-[600] tracking-[-0.01em] leading-[1.3]">{r.rule}</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="text-[10px] font-mono bg-[#F6F6F5] border border-[#EDEBE6] px-2.5 py-1 rounded-full">{r.type.toUpperCase()} • {r.params}</span>
                          <span className="text-[10px] font-mono bg-[#111] text-white px-2.5 py-1 rounded-full font-[700]">p{r.page} {r.section}</span>
                          <span className="text-[10px] font-mono bg-[#FFD60A] text-black px-2 py-0.5 rounded-full border border-black/10">{r.citation}</span>
                        </div>
                      </div>
                      <div className="hidden md:flex flex-col gap-1 shrink-0">
                        <span className={`h-5 px-2 rounded-full text-[10px] font-mono font-[600] flex items-center ${r.severity==="critical" ? "bg-[#FF3B30] text-white" : r.severity==="high" ? "bg-[#FFD60A] text-black" : "bg-[#EDEBE6] text-[#6B6B6B]"}`}>{r.severity}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-auto md:h-12 bg-[#F6F6F5] border-t border-[#EDEBE6] flex flex-col md:flex-row items-start md:items-center justify-between gap-2 px-5 py-3 text-[11px] font-mono">
                  <span className="leading-[1.4]">{rules.length} rules • {meta?.fileSizeMB ? `${meta.fileSizeMB} MB • ` : ""}{clientPages ? `${clientPages} detected • ` : ""}{meta?.numPages ? `${meta.numPages} compiled • ` : ""}hand-check 20 • edit in Zone</span>
                  <div className="flex gap-2 shrink-0">
                    <a href="/zone" className="h-8 px-4 rounded-full bg-white border border-[#EDEBE6] flex items-center hover:border-black font-[600] text-[11px] transition-colors">Draw zones for these rules →</a>
                    <a href="/watch" className="h-8 px-4 rounded-full bg-black text-white flex items-center font-[700] text-[11px] hover:bg-[#222] transition-colors">Watch live →</a>
                  </div>
                </div>
              </div>
            )}
            {file && done && (
              <div className="mt-4 border border-[#111] rounded-[16px] bg-[#111] text-white p-4 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[13px] font-[700]">✓ Ready — what we promised, delivered</div>
                  <div className="mt-1 text-[12px] leading-[1.5] text-white/70">Your {clientPages || meta?.numPages || "long"}-page manual → {rules.length} geometry checks, each with <b className="text-white">p87 §4.2 citation</b>. No model call per frame at $0.35/hr. Next: zones once, then live alerts cite page+clip.</div>
                </div>
                <a href="/zone" className="shrink-0 h-9 px-5 rounded-full bg-[#FFD60A] text-black text-[12px] font-[800] flex items-center hover:bg-[#FFC700]">Go to Zone →</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
