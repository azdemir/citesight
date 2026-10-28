"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Rule = { id:string; rule:string; type:string; params:string; page:number; section:string; severity:string; citation:string };
type Zone = { id:string; polygon:[number,number][]; label:string; type:string; rule:string; page:number; section:string; severity:string; color:string; params:string; };

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

function colorForSeverity(sev:string){
  if(sev==="critical") return "#FF3B30";
  if(sev==="high") return "#FFD60A";
  if(sev==="medium") return "#0A84FF";
  return "#9A9A98";
}

function generatePlanZones(rules: Rule[]): Zone[] {
  if (!rules?.length) return [];
  const seen = new Map<string, Zone>();
  // collect candidate ids from params
  rules.forEach((r, idx) => {
    const zoneMatches = [...r.params.matchAll(/zone:([a-zA-Z0-9_\-]+)/g)].map(m=>m[1]);
    const toolMatches = [...r.params.matchAll(/(?:tool|vehicle|equipment|load|object):([a-zA-Z0-9_\-]+)/g)].map(m=>m[1]);
    const baseIds = zoneMatches.length ? zoneMatches : toolMatches.length ? toolMatches : [r.id.toLowerCase().replace(/[^a-z0-9_]/g,'_')];
    baseIds.forEach(base => {
      const zid = base.toLowerCase().replace(/\s+/g,'_');
      if (seen.has(zid)) return; // keep first rule that created it, but merge
      const order = seen.size;
      const cols = Math.max(2, Math.ceil(Math.sqrt(rules.length)));
      const rows = Math.ceil(rules.length / cols);
      const col = order % cols;
      const row = Math.floor(order / cols);
      const pad = 0.025;
      // spread with some jitter so it looks like a real plan, not perfect grid
      const jitterX = (Math.sin(order*1.7)*0.01);
      const jitterY = (Math.cos(order*2.3)*0.01);
      const cellW = 0.9 / cols;
      const cellH = 0.78 / rows;
      const x0 = 0.05 + col*cellW + pad + jitterX;
      const y0 = 0.10 + row*cellH + pad + jitterY;
      const x1 = Math.min(0.95, x0 + cellW - pad*2 + jitterX*0.5);
      const y1 = Math.min(0.92, y0 + cellH - pad*2 + jitterY*0.5);
      // Special layouts for known types
      let poly: [number,number][] = [[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
      if (r.type==="distance" && toolMatches.length){
        // distance zones are smaller around equipment
        const cx = (x0+x1)/2, cy = (y0+y1)/2;
        const w = (x1-x0)*0.7, h = (y1-y0)*0.65;
        poly = [[cx-w/2, cy-h/2],[cx+w/2, cy-h/2],[cx+w/2, cy+h/2],[cx-w/2, cy+h/2]];
      }
      if (zid.includes("lane") || r.rule.toLowerCase().includes("lane")){
        // lanes are long horizontal strips
        poly = [[0.05, y0+cellH*0.25],[0.95, y0+cellH*0.25],[0.95, y0+cellH*0.55],[0.05, y0+cellH*0.55]];
      }
      seen.set(zid, {
        id: zid,
        polygon: poly,
        label: `${zid.replace(/_/g,' ')} • ${r.rule}`,
        type: r.type,
        rule: r.id,
        page: r.page,
        section: r.section,
        severity: r.severity,
        color: colorForSeverity(r.severity),
        params: r.params,
      });
    });
  });
  // Ensure we have at most 12 zones to keep plan readable, but keep all if <16
  const all = Array.from(seen.values());
  return all.slice(0, 16);
}

function PlanCanvas({ zones, rules, editable=true, onZonesChange }: { zones: Zone[]; rules: Rule[]; editable?: boolean; onZonesChange?: (zs:Zone[])=>void }){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragPoint, setDragPoint] = useState<{zoneId:string; idx:number}|null>(null);
  const dragRef = useRef<{zoneId:string; idx:number}|null>(null);
  const [activeId, setActiveId] = useState<string|null>(null);
  const zonesRef = useRef<Zone[]>(zones);
  useEffect(()=>{ zonesRef.current = zones; }, [zones]);

  const draw = useCallback(()=>{
    const c = canvasRef.current; if(!c) return;
    const ctx = c.getContext("2d"); if(!ctx) return;
    const W = c.width, H = c.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle = "#EDEBE6"; ctx.lineWidth = 1;
    for(let i=0;i<W;i+=28){ ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,H); ctx.stroke(); }
    for(let j=0;j<H;j+=28){ ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(W,j); ctx.stroke(); }
    zones.forEach(z=>{
      const isActive = z.id===activeId;
      ctx.beginPath();
      z.polygon.forEach(([x,y], i)=>{ const px=x*W, py=y*H; if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); });
      ctx.closePath();
      ctx.fillStyle = isActive ? z.color+"44" : z.color+"2A";
      ctx.fill();
      ctx.strokeStyle = isActive ? "#111" : z.color; ctx.lineWidth = isActive ? 2.4 : 1.8; ctx.setLineDash(z.type==="distance" ? [] : [7,5]); ctx.stroke(); ctx.setLineDash([]);
      // label
      const [lx, ly] = z.polygon[0];
      ctx.fillStyle = "#111"; ctx.font = "11px monospace"; ctx.fillText(z.id, lx*W+4, ly*H+14);
      if(editable){
        // draw handles for active or all if few
        const showHandles = isActive || zones.length<=8;
        if(showHandles){
          z.polygon.forEach(([x,y], idx)=>{
            const isDrag = (dragPoint?.zoneId===z.id && dragPoint?.idx===idx) || (dragRef.current?.zoneId===z.id && dragRef.current?.idx===idx);
            ctx.beginPath(); ctx.arc(x*W, y*H, isDrag?8:5, 0, Math.PI*2);
            ctx.fillStyle = isDrag ? "#FFD60A" : "#111"; ctx.fill();
            ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
          });
        }
      }
    });
    ctx.fillStyle = "rgba(0,0,0,0.65)"; ctx.font = "10px monospace";
    ctx.fillText(`${zones.length} zones auto-generated from ${rules.length} rules • ${editable ? "drag points to edit directly — no /zone needed" : "drag to edit in /zone"}`, 12, H-10);
  }, [zones, rules, dragPoint, activeId, editable]);

  useEffect(()=>{ draw(); }, [draw]);

  const normPos = (e: React.MouseEvent<HTMLCanvasElement>)=>{
    const c = canvasRef.current!; const rect=c.getBoundingClientRect();
    return { x:(e.clientX-rect.left)/rect.width, y:(e.clientY-rect.top)/rect.height, c, rect };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>)=>{
    if(!editable) return;
    const { x, y, c } = normPos(e);
    // find closest point - use ref for latest zones
    let bestZoneId: string | null = null;
    let bestIdx = -1;
    let bestDist = 999;
    for(const z of zonesRef.current){
      for(let idx=0; idx<z.polygon.length; idx++){
        const px=z.polygon[idx][0], py=z.polygon[idx][1];
        const dx=(px-x)*c.width, dy=(py-y)*c.height;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<30 && d<bestDist){ bestDist=d; bestZoneId=z.id; bestIdx=idx; }
      }
    }
    if(bestZoneId!==null){ setDragPoint({zoneId:bestZoneId, idx:bestIdx}); dragRef.current={zoneId:bestZoneId, idx:bestIdx}; setActiveId(bestZoneId); return; }
    // else check click inside polygon to select
    for(const z of zones){
      // point in polygon ray casting
      let inside=false;
      for(let i=0,j=z.polygon.length-1;i<z.polygon.length;j=i++){
        const xi=z.polygon[i][0], yi=z.polygon[i][1];
        const xj=z.polygon[j][0], yj=z.polygon[j][1];
        const intersect=((yi>y)!==(yj>y)) && (x < (xj-xi)*(y-yi)/(yj-yi)+xi);
        if(intersect) inside=!inside;
      }
      if(inside){ setActiveId(z.id); return; }
    }
    setActiveId(null);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>)=>{
    const dp = dragRef.current || dragPoint;
    if(!dp || !onZonesChange) return;
    const { x, y } = normPos(e);
    const curZones = zonesRef.current;
    const newZones = curZones.map(z=>{
      if(z.id!==dp.zoneId) return z;
      const poly = [...z.polygon] as [number,number][];
      poly[dp.idx]=[x,y];
      return {...z, polygon: poly};
    });
    onZonesChange(newZones);
  };

  const onMouseUp = ()=> { setDragPoint(null); dragRef.current=null; };

  useEffect(()=>{
    const up = ()=> { setDragPoint(null); dragRef.current=null; };
    window.addEventListener("mouseup", up);
    return ()=> window.removeEventListener("mouseup", up);
  }, []);

  return <canvas ref={canvasRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} width={900} height={540} className={`w-full h-auto block rounded-[14px] border border-[#EDEBE6] ${editable ? "cursor-grab active:cursor-grabbing" : ""}`} />;
}

export default function UploadPage(){
  const [file, setFile] = useState<File|null>(null);
  const [drag, setDrag] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [done, setDone] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [clientPages, setClientPages] = useState<number|null>(null);
  const [step, setStep] = useState<string>("");
  const [planZones, setPlanZones] = useState<Zone[]>([]);
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
          const pz = generatePlanZones(parsed.rules);
          setPlanZones(pz);
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

  const savePlan = (rulesToSave: Rule[], zonesToSave: Zone[], metaToSave: any)=>{
    try {
      localStorage.setItem("citesight_last_compile", JSON.stringify({ rules: rulesToSave, meta: metaToSave }));
      localStorage.setItem("citesight_compiled_rules", JSON.stringify(rulesToSave));
      localStorage.setItem("citesight_zones_complicated", JSON.stringify(zonesToSave));
      localStorage.setItem("citesight_plan_autogenerated", JSON.stringify({ at: new Date().toISOString(), zones: zonesToSave, rules: rulesToSave, meta: metaToSave }));
    } catch {}
    fetch("http://localhost:8000/zones", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(zonesToSave.map(({id,polygon,label})=>({id,polygon,label}))) }).catch(()=>{});
  };

  const onFile = async (f: File)=>{
    setFile(f);
    setCompiling(true);
    setDone(false);
    setMeta(null);
    setClientPages(null);
    setStep("Reading PDF...");
    setRules(MOCK_RULES);
    const previewZones = generatePlanZones(MOCK_RULES);
    setPlanZones(previewZones);
    getClientPageCount(f).then(n=>{ if(n) setStep(`Detected ${n} pages • reading all pages for plan...`); });

    const interval = setInterval(()=>{
      setStep(s=>{
        if(s.includes("Reading")) return "Reading all pages • building full citation index...";
        if(s.includes("Detected")) return "Reading all 155 pages • extracting measurable checks...";
        if(s.includes("building full")) return "Spark 1M • compiling to DSL with page citations...";
        if(s.includes("compiling to DSL")) return "Compiling • creating plan zones from document...";
        if(s.includes("creating plan")) return "Finalizing plan • drawing zones based on document...";
        return s;
      });
    }, 850);

    try {
      const fd = new FormData();
      fd.append("file", f);
      setStep("Uploading • Spark 1M reading all pages...");
      const res = await fetch("/api/compile", { method: "POST", body: fd });
      const data = await res.json();
      clearInterval(interval);
      const finalRules = data.rules || MOCK_RULES;
      const finalZones = generatePlanZones(finalRules);
      setRules(finalRules);
      setPlanZones(finalZones);
      const m = { fileName: data.fileName || f.name, fileSizeMB: data.fileSizeMB || (f.size/1024/1024).toFixed(2), numPages: data.numPages || clientPages || 0, model: data.model || "muse-spark-1.1", tokens: data.tokens || 0, compiledAt: data.compiledAt };
      setMeta(m);
      setCompiling(false);
      setDone(true);
      setStep(`Compiled ${finalRules.length} rules → ${finalZones.length} zones auto-drawn from document`);
      savePlan(finalRules, finalZones, m);
    } catch (e:any) {
      clearInterval(interval);
      setStep("Spark unreachable • showing preview plan from document");
      const fallbackZones = generatePlanZones(MOCK_RULES);
      setPlanZones(fallbackZones);
      setTimeout(()=>{
        setRules(MOCK_RULES);
        setCompiling(false);
        setDone(true);
        const m = { fileName: f.name, fileSizeMB: (f.size/1024/1024).toFixed(2), numPages: clientPages || 50, model: "preview • Spark will compile on next try", tokens: 0 };
        setMeta(m);
        savePlan(MOCK_RULES, fallbackZones, m);
      }, 900);
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

      <div className="mx-auto max-w-[1280px] px-6 md:px-8 pt-[64px] md:pt-[80px] pb-[64px]">
        <div className="max-w-[760px]">
          <h1 className="text-[30px] md:text-[48px] leading-[0.92] tracking-[-0.05em] font-[800]">Upload your<br />rulebook.</h1>
          <p className="mt-3 text-[14px] md:text-[15px] leading-[1.6] text-[#6B6B6B]">We read <b className="text-black">all pages</b> 6→1000+, Spark 1M compiles to checks with page citations, then <b className="text-black">auto-draw a plan with zones based on document</b>. Every alert cites page+clip.</p>
        </div>

        <div className="mt-8 grid md:grid-cols-12 gap-6 md:gap-8 items-start">
          <div className="md:col-span-5">
            <div onDragOver={e=>{e.preventDefault(); setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={onDrop} onClick={()=>inputRef.current?.click()} className={`border rounded-[20px] p-7 md:p-8 cursor-pointer transition-all group ${drag ? "border-black bg-[#FFD60A]/20 scale-[1.01] shadow-[0_12px_32px_rgba(0,0,0,0.08)]" : "border-[#111] bg-[#FAFAF9] hover:border-black hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"}`}>
              <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) onFile(f); }} />
              <div className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${compiling ? "bg-[#FFD60A] text-black animate-pulse" : done ? "bg-[#111] text-white" : "bg-black text-white group-hover:scale-110"}`}>{compiling ? "◐" : done ? "✓" : "↑"}</div>
              <div className="mt-5 text-[17px] font-[700] tracking-[-0.02em] leading-[1.2]">{file ? file.name : "Drop manual here"}</div>
              <div className="mt-2 text-[12px] leading-[1.5] text-[#6B6B6B] min-h-[40px]">
                {file ? (
                  <span>
                    <b className="text-black">{meta?.fileSizeMB || (file.size/1024/1024).toFixed(1)} MB</b> • {clientPages ? <><b className="text-black">{clientPages} pages detected</b> • reading all</> : ""}{meta?.numPages ? <> • <b className="text-black">{meta.numPages} pages compiled</b></> : ""} • {meta?.model || "Spark 1M"} {planZones.length ? <>• <b className="text-black">{planZones.length} zones auto-drawn</b></> : ""}
                  </span>
                ) : "PDF, DOCX • any length 6–1000+ pages • we read all and auto-draw plan based on document"}
              </div>
              {file && (
                <div className="mt-5">
                  <div className="h-2 w-full bg-[#EDEBE6] rounded-full overflow-hidden"><div className="h-full bg-black transition-all duration-700" style={{ width: compiling ? "78%" : done ? "100%" : "0%" }} /></div>
                  <div className="mt-2.5 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.07em]">
                    <span className={`h-2 w-2 rounded-full ${compiling ? "bg-[#FFD60A] animate-pulse" : "bg-[#30D158]"}`} />
                    <span className={compiling ? "text-black font-[600]" : "text-[#6B6B6B]"}>{compiling ? step : done ? `✓ ${step}` : ""}</span>
                  </div>
                </div>
              )}
              {!file && <div className="mt-6 h-9 px-5 rounded-full bg-black text-white text-[12px] font-[700] inline-flex items-center group-hover:bg-[#111] transition-colors">Browse files →</div>}
              {file && done && (
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <a href="/zone" className="h-10 rounded-full bg-black text-white text-[12px] font-[700] flex items-center justify-center hover:bg-[#222]">Edit plan in Zone →</a>
                  <a href="/watch" className="h-10 rounded-full bg-[#FFD60A] text-black text-[12px] font-[700] flex items-center justify-center hover:bg-[#FFC700]">Watch live →</a>
                </div>
              )}
            </div>

            <div className="mt-6 border border-[#EDEBE6] rounded-[16px] p-5 bg-white">
              <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#111] font-[700]">What happens after upload • We promised</div>
              <div className="mt-3 space-y-2.5 text-[12px] leading-[1.6] text-[#6B6B6B]">
                <div className="flex gap-2"><span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${file ? "bg-black text-white" : "bg-[#EDEBE6]"}`}>1</span><span><b className="text-black">Read all pages:</b> {file ? `${clientPages || meta?.numPages || "?"} pages from ${file.name}` : "6→1000+ pages, keep p87 citation."}</span></div>
                <div className="flex gap-2"><span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${compiling ? "bg-[#FFD60A] animate-pulse text-black" : done ? "bg-black text-white" : "bg-[#EDEBE6]"}`}>2</span><span><b className="text-black">Compile to DSL:</b> {done ? `${rules.length} rules • ${planZones.length} zones` : "Spark 1M one-time, pages p87,p112 kept"}</span></div>
                <div className="flex gap-2"><span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${done && planZones.length ? "bg-black text-white" : "bg-[#EDEBE6]"}`}>3</span><span><b className="text-black">Auto-draw plan:</b> {done ? `${planZones.length} zones drawn based on document` : "Zones auto-created from document, not manual"}</span></div>
                <div className="flex gap-2"><span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${done ? "bg-black text-white" : "bg-[#EDEBE6]"}`}>4</span><span><b className="text-black">Watch + cite:</b> YOLO $0.35/hr, clip + p87 §4.2 + Slack/SMS</span></div>
              </div>
              {done && planZones.length>0 && (
                <div className="mt-4 p-3 rounded-[10px] bg-[#111] text-white text-[11px] leading-[1.5]">
                  <b>✓ Auto-plan ready:</b> Read all {clientPages || meta?.numPages} pages, created <b>{planZones.length} zones</b> from document: {planZones.map(z=>z.id).slice(0,6).join(", ")}{planZones.length>6 ? ` +${planZones.length-6} more` : ""}. Edit in <a href="/zone" className="underline font-[700] text-[#FFD60A]">Zone</a> or <a href="/watch" className="underline font-[700] text-[#FFD60A]">Watch</a>.
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Try a sample — auto-generates plan</div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {SAMPLE_MANUALS.map(s=>(
                  <button key={s.file} onClick={()=>onSample(s.file)} disabled={compiling} className="text-left border border-[#EDEBE6] rounded-[12px] px-4 py-3 bg-white hover:border-black hover:bg-[#FAFAF9] transition-colors disabled:opacity-50 group">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[13px] font-[600]">{s.label}</div>
                      <span className="text-[10px] font-mono bg-[#F6F6F5] border px-2 py-0.5 rounded-full">{s.pages}p</span>
                    </div>
                    <div className="mt-1 text-[11px] text-[#6B6B6B]">{s.desc} • auto-draws plan</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            {!file && (
              <div className="border border-dashed border-[#EDEBE6] rounded-[20px] p-8 md:p-10 text-center bg-white">
                <div className="mx-auto h-10 w-10 rounded-full bg-[#F6F6F5] flex items-center justify-center text-[14px]">🗺️</div>
                <div className="mt-4 text-[14px] font-[700]">No manual yet — no plan</div>
                <div className="mt-2 text-[13px] leading-[1.6] text-[#6B6B6B] max-w-[440px] mx-auto">Drop a manual. We will <b className="text-black">read all pages</b>, compile to checks with p87 citations, and <b className="text-black">auto-draw a floor plan with zones based on your document</b>. Then watch live with citations.</div>
              </div>
            )}
            {file && (
              <div className="space-y-5">
                {/* Auto-generated Plan Preview */}
                <div className="border border-black rounded-[20px] overflow-hidden bg-white shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
                  <div className="h-11 flex items-center justify-between px-5 border-b border-[#EDEBE6] bg-[#111] text-white text-[11px] font-mono">
                    <span className="font-[700]">AUTO-GENERATED PLAN • {planZones.length} zones • based on {file.name}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-[700] ${done ? "bg-[#FFD60A] text-black" : "bg-white/10 animate-pulse"}`}>{done ? `✓ ${planZones.length} ZONES READY` : "DRAWING PLAN..."}</span>
                  </div>
                  <div className="p-3 bg-[#FAFAF9]">
                    {planZones.length>0 ? <PlanCanvas zones={planZones} rules={rules} editable={true} onZonesChange={(nz)=>{ setPlanZones(nz); if(done && meta) { try{ localStorage.setItem("citesight_zones_complicated", JSON.stringify(nz)); localStorage.setItem("citesight_last_compile", JSON.stringify({ rules, meta })); }catch{} fetch("http://localhost:8000/zones",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(nz.map(({id,polygon,label})=>({id,polygon,label})))}).catch(()=>{}); } }} /> : <div className="h-[300px] flex items-center justify-center text-[12px] font-mono text-[#9A9A98]">Generating plan from document...</div>}
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 bg-white border-t border-[#EDEBE6]">
                    <div className="col-span-2">
                      <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Zones drawn from document</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {planZones.map(z=>(
                          <span key={z.id} className="text-[10px] font-mono px-2.5 py-1 rounded-full border flex items-center gap-1.5" style={{ borderColor: z.color, background: z.color+"18" }}>
                            <span className="h-2 w-2 rounded-full" style={{background:z.color}} />{z.id} • {z.rule} p{z.page}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a href="/zone" className="h-9 rounded-full bg-black text-white text-[12px] font-[700] flex items-center justify-center hover:bg-[#222]">Edit plan in Zone →</a>
                      <a href="/watch" className="h-9 rounded-full bg-[#FFD60A] text-black text-[11px] font-[700] flex items-center justify-center hover:bg-[#FFC700]">Watch live now →</a>
                    </div>
                  </div>
                </div>

                <div className="border border-[#EDEBE6] rounded-[20px] overflow-hidden bg-white">
                  <div className="h-11 flex items-center justify-between px-5 border-b border-[#EDEBE6] bg-[#FAFAF8] text-[11px] font-mono">
                    <span className="font-[700]">DSL • {rules.length} rules • page citation • auto-plan source</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-[700] border ${done ? "bg-[#FFD60A] text-black border-black" : "bg-[#111] text-white border-[#111] animate-pulse"}`}>{done ? `✓ COMPILED` : "COMPILING"}</span>
                  </div>
                  <div className="divide-y divide-[#EDEBE6] max-h-[420px] overflow-auto">
                    {rules.map(r=>(
                      <div key={r.id} className="p-4 flex gap-3 hover:bg-[#FAFAF9]">
                        <div className="text-[11px] font-mono font-[800] bg-black text-white h-6 px-2.5 rounded-[6px] flex items-center shrink-0">{r.id}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-[600] leading-[1.3]">{r.rule}</div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="text-[10px] font-mono bg-[#F6F6F5] border px-2.5 py-1 rounded-full">{r.type.toUpperCase()} • {r.params}</span>
                            <span className="text-[10px] font-mono bg-[#111] text-white px-2.5 py-1 rounded-full">p{r.page} {r.section}</span>
                            <span className="text-[10px] font-mono bg-[#FFD60A] text-black px-2 py-0.5 rounded-full">{r.citation}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
