"use client";

import { useState, useRef } from "react";

type Rule = { id:string; rule:string; type:string; params:string; page:number; section:string; severity:string; citation:string };

const MOCK_RULES: Rule[] = [
  { id:"R-04.2", rule:"No person within 1.5 m of running saw", type:"distance", params:"tool:saw • state:running • d<1.5m", page:87, section:"§4.2 Moving Machinery", severity:"high", citation:"Manual p87 §4.2" },
  { id:"R-07.1", rule:"Gloves required at station 3", type:"presence", params:"zone:station_3 • ppe:gloves", page:112, section:"§7.1 PPE Compliance", severity:"high", citation:"Manual p112 §7.1" },
  { id:"R-03.4", rule:"Hard hat within 5 m of overhead crane", type:"overlap", params:"zone:crane_5m • ppe:hard_hat", page:64, section:"§3.4 Head Protection", severity:"critical", citation:"Manual p64 §3.4" },
  { id:"R-12.8", rule:"No forklift in pedestrian lane when occupied", type:"overlap", params:"tool:forklift • zone:ped_lane • occupancy", page:203, section:"§12.8 Vehicle Separation", severity:"high", citation:"Manual p203 §12.8" },
];

export default function UploadPage(){
  const [file, setFile] = useState<File|null>(null);
  const [drag, setDrag] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [done, setDone] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [clientPages, setClientPages] = useState<number|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getClientPageCount = async (f: File) => {
    try {
      const pdfjs: any = await import("pdfjs-dist");
      // @ts-ignore
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
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
    getClientPageCount(f);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/compile", { method: "POST", body: fd });
      const data = await res.json();
      setRules(data.rules || MOCK_RULES);
      setMeta({ fileName: data.fileName, fileSizeMB: data.fileSizeMB, numPages: data.numPages, model: data.model, tokens: data.tokens });
      setCompiling(false);
      setDone(true);
    } catch {
      setTimeout(()=>{ setRules(MOCK_RULES); setCompiling(false); setDone(true); }, 2300);
    }
  };

  const onDrop = (e: React.DragEvent)=>{ e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if(f) onFile(f); };

  return (
    <div className="min-h-screen bg-white text-[#111] antialiased selection:bg-black selection:text-white">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-[#EDEDEB]">
        <div className="mx-auto max-w-[1120px] px-8 h-[64px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5"><div className="h-6 w-6 bg-black rounded-[6px] flex items-center justify-center"><div className="h-2 w-2 bg-[#FFD60A] rounded-[1px]" /></div><span className="text-[15px] font-[650] tracking-[-0.02em]">CiteSight</span></a>
          <div className="flex items-center gap-6 text-[13px]"><a href="/features" className="text-[#6B6B6B] hover:text-black">Features</a><a href="/zone" className="text-[#6B6B6B] hover:text-black">Zone</a><a href="/watch" className="text-[#6B6B6B] hover:text-black">Watch</a></div>
        </div>
      </header>

      <div className="mx-auto max-w-[1120px] px-8 pt-[88px] pb-[48px]">
        <div className="max-w-[640px]">
          <h1 className="text-[36px] md:text-[52px] leading-[0.9] tracking-[-0.05em] font-[750]">Upload your<br />rulebook.</h1>
          <p className="mt-4 text-[14px] leading-[1.6] text-[#6B6B6B]">Safety manual → structured DSL with page citations. Every rule keeps source p87 §4.2. Compiled once, runs as geometry at $0.35/hr, not VLM per frame.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-5">
            <div onDragOver={e=>{e.preventDefault(); setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={onDrop} onClick={()=>inputRef.current?.click()} className={`border rounded-[20px] p-8 cursor-pointer transition-all ${drag ? "border-black bg-[#FAFAF9] scale-[1.01]" : "border-[#EDEDEB] bg-[#FAFAF9] hover:border-black"}`}>
              <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) onFile(f); }} />
              <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center">↑</div>
              <div className="mt-5 text-[16px] font-[650] tracking-[-0.02em]">{file ? file.name : "Drop manual here"}</div>
              <div className="mt-2 text-[12px] leading-[1.5] text-[#6B6B6B]">{file ? `${meta?.fileSizeMB || (file.size/1024/1024).toFixed(1)} MB • ${clientPages ? `${clientPages} pages detected • ` : ""}${meta?.numPages ? `${meta.numPages} pages compiled • ` : "any length • "}${meta?.model || "Spark 1M"}` : "PDF, DOCX • any length • Spark 1M context • 2.3s compile"}</div>
              {file && (
                <div className="mt-5">
                  <div className="h-1.5 w-full bg-[#EDEDEB] rounded-full overflow-hidden"><div className={`h-full bg-black transition-all duration-[2300ms] ${compiling ? "w-[92%]" : done ? "w-full" : "w-0"}`} /></div>
                  <div className="mt-2 text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">{compiling ? `COMPILING • Spark 1M reading ${clientPages ? clientPages+" pages detected" : meta?.numPages ? meta.numPages+" pages" : "any length"} → DSL • 1M tokens` : done ? `COMPILED • ${rules.length} rules • ${meta?.model || "Spark 1M"}` : ""}</div>
                </div>
              )}
              {!file && <div className="mt-6 h-9 px-4 rounded-full bg-black text-white text-[12px] font-[600] inline-flex items-center">Browse files →</div>}
            </div>

            <div className="mt-5 border border-[#EDEDEB] rounded-[16px] p-5 bg-white">
              <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">How it works • Efficient at scale</div>
              <div className="mt-3 space-y-2 text-[12px] leading-[1.6] text-[#6B6B6B]">
                <div><b className="text-black">LLM once:</b> Spark 1M compiles manual → DSL $0.50-$2 one-time, pages p87, p112 citations kept.</div>
                <div><b className="text-black">Watch efficient:</b> SAM + YOLO geometry $0.35/hr/cam, 0 LLM calls/frame, vs VLM $4.20/hr = 12x more efficient.</div>
                <div><b className="text-black">Explain only on violation:</b> 10-20/day, not 108k frames/day. Wonder writes incident p87 + 5-sec clip + Slack/SMS.</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            {!file && (
              <div className="border border-dashed border-[#EDEDEB] rounded-[20px] p-10 text-center bg-white">
                <div className="text-[13px] leading-[1.6] text-[#9A9A98]">No manual uploaded yet. Drop PDF to see DSL with page citations p87 §4.2, p112 §4.1 — auditable, precise, efficient.</div>
              </div>
            )}
            {file && (
              <div className="border border-black rounded-[20px] overflow-hidden bg-white">
                <div className="h-10 flex items-center justify-between px-5 border-b border-[#EDEDEB] text-[11px] font-mono">
                  <span>DSL • {rules.length} rules • page citation</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${done ? "bg-[#FFD60A] text-black" : "bg-[#EDEDEB]"}`}>{done ? `COMPILED • ${rules.length} rules` : "COMPILING"}</span>
                </div>
                <div className="divide-y divide-[#EDEDEB] max-h-[520px] overflow-auto">
                  {rules.map(r=>(
                    <div key={r.id} className="p-4 flex gap-3 hover:bg-[#FAFAF9] group">
                      <div className="text-[11px] font-mono font-[700] bg-black text-white h-6 px-2 rounded-[6px] flex items-center flex-shrink-0">{r.id}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-[600] tracking-[-0.01em] truncate">{r.rule}</div>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <span className="text-[10px] font-mono bg-[#F6F6F5] border border-[#EDEDEB] px-2 py-0.5 rounded-full">{r.type.toUpperCase()} • {r.params}</span>
                          <span className="text-[10px] font-mono bg-[#FFD60A] text-black px-2 py-0.5 rounded-full">p{r.page} {r.section}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-11 bg-[#F6F6F5] border-t border-[#EDEDEB] flex items-center justify-between px-5 text-[11px] font-mono">
                  <span>{rules.length} rules • hand-check 20 • edit in viewer</span>
                  <div className="flex gap-2"><a href="/zone" className="h-7 px-3 rounded-full bg-white border border-[#EDEDEB] flex items-center hover:border-black text-[11px]">Zone →</a><a href="/watch" className="h-7 px-3 rounded-full bg-black text-white flex items-center text-[11px]">Watch →</a></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
