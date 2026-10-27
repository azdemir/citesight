"use client";

import { useState, useRef, useEffect } from "react";

type ZoneType = "distance" | "overlap" | "presence" | "state";
type Severity = "critical" | "high" | "medium" | "low";

type Zone = {
  id: string;
  polygon: [number, number][];
  label: string;
  type: ZoneType;
  rule: string;
  page: number;
  section: string;
  severity: Severity;
  color: string;
  params: string;
};

const DEFAULT: Zone[] = [
  { id: "lumber_yard", polygon: [[0.05,0.1],[0.45,0.1],[0.45,0.85],[0.05,0.85]], label: "lumber yard • hard hat + glasses required", type: "presence", rule: "R-03.4", page: 64, section: "§3.4 Head Protection", severity: "critical", color: "#FF3B30", params: "zone:lumber_yard • ppe:hard_hat,glasses" },
  { id: "forklift_lane", polygon: [[0.05,0.78],[0.95,0.78],[0.95,0.88],[0.05,0.88]], label: "forklift lane • no customer when moving", type: "overlap", rule: "R-12.8", page: 203, section: "§12.8 Vehicle Separation", severity: "high", color: "#FFD60A", params: "tool:forklift • zone:ped_lane" },
  { id: "station_3", polygon: [[0.55,0.4],[0.9,0.4],[0.9,0.75],[0.55,0.75]], label: "station 3 • gloves required", type: "presence", rule: "R-07.1", page: 112, section: "§7.1 PPE Compliance", severity: "high", color: "#0A84FF", params: "zone:station_3 • ppe:gloves" },
  { id: "saw_zone", polygon: [[0.3,0.35],[0.5,0.35],[0.5,0.55],[0.3,0.55]], label: "table saw • no person within 1.5m when running", type: "distance", rule: "R-04.2", page: 87, section: "§4.2 Moving Machinery", severity: "critical", color: "#FF3B30", params: "tool:saw • state:running • d<1.5m" },
];

export default function ZonePage() {
  const [zones, setZones] = useState<Zone[]>(DEFAULT);
  const [activeId, setActiveId] = useState<string>("lumber_yard");
  const [drawing, setDrawing] = useState<[number,number][]>([]);
  const [mode, setMode] = useState<"draw"|"edit"|"calibrate"|"measure">("draw");
  const [dragPoint, setDragPoint] = useState<{zoneId:string; pointIdx:number} | null>(null);
  const [floorPlan, setFloorPlan] = useState<string | null>(null);
  const [calib, setCalib] = useState<{p1:[number,number]|null; p2:[number,number]|null; realM: number; mPerPx: number|null}>({p1:null,p2:null,realM:3.2,mPerPx:null});
  const [measure, setMeasure] = useState<{a:[number,number]|null; b:[number,number]|null; distPx:number|null}>({a:null,b:null,distPx:null});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("citesight_zones_complicated");
    if (saved) { try { setZones(JSON.parse(saved)); } catch {} }
    const savedCalib = localStorage.getItem("citesight_calib");
    if (savedCalib) { try { setCalib(JSON.parse(savedCalib)); } catch {} }
  }, []);
  useEffect(() => {
    localStorage.setItem("citesight_zones_complicated", JSON.stringify(zones));
    fetch("http://localhost:8000/zones", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(zones.map(({id, polygon, label})=>({id, polygon, label}))) }).catch(()=>{});
  }, [zones]);
  useEffect(()=>{ localStorage.setItem("citesight_calib", JSON.stringify(calib)); }, [calib]);

  const draw = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle = "#EDEBE6"; ctx.lineWidth = 1;
    for(let i=0;i<c.width;i+=32){ ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,c.height); ctx.stroke(); }
    for(let j=0;j<c.height;j+=32){ ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(c.width,j); ctx.stroke(); }

    if (calib.p1 && calib.p2) {
      ctx.beginPath();
      ctx.moveTo(calib.p1[0]*c.width, calib.p1[1]*c.height);
      ctx.lineTo(calib.p2[0]*c.width, calib.p2[1]*c.height);
      ctx.strokeStyle = "#111"; ctx.lineWidth = 2; ctx.setLineDash([8,6]); ctx.stroke(); ctx.setLineDash([]);
    }

    zones.forEach(z => {
      const isActive = z.id === activeId;
      ctx.beginPath();
      z.polygon.forEach(([x,y], i) => { const px = x*c.width, py = y*c.height; if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); });
      ctx.closePath();
      ctx.fillStyle = isActive ? z.color + "33" : z.color + "14";
      ctx.fill();
      ctx.strokeStyle = isActive ? "#111" : z.color; ctx.lineWidth = isActive ? 2 : 1.5; ctx.setLineDash(z.type==="distance" ? [] : [8,6]); ctx.stroke(); ctx.setLineDash([]);
      if(isActive && mode==="edit"){
        z.polygon.forEach(([x,y], idx)=>{
          ctx.beginPath(); ctx.arc(x*c.width, y*c.height, idx===dragPoint?.pointIdx && dragPoint?.zoneId===z.id ? 7 : 5, 0, Math.PI*2);
          ctx.fillStyle = idx===dragPoint?.pointIdx ? "#FFD60A" : "#111"; ctx.fill();
          ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
        });
      }
    });

    if (drawing.length>0){
      ctx.beginPath();
      drawing.forEach(([x,y], i) => { const px = x*c.width, py = y*c.height; if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); });
      ctx.strokeStyle = "#111"; ctx.lineWidth = 2; ctx.stroke();
      drawing.forEach(([x,y])=>{ ctx.beginPath(); ctx.arc(x*c.width,y*c.height,4,0,Math.PI*2); ctx.fillStyle="#111"; ctx.fill(); });
    }
  };

  useEffect(()=>{ draw(); }, [zones, activeId, drawing, dragPoint, floorPlan, calib, measure]);

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX-rect.left)/rect.width;
    const y = (e.clientY-rect.top)/rect.height;

    if(mode==="calibrate"){
      if(!calib.p1) setCalib(c=>({...c, p1:[x,y]}));
      else if(!calib.p2){
        const p1 = calib.p1!;
        const dx = x-p1[0], dy = y-p1[1];
        const distPx = Math.sqrt(dx*dx + dy*dy) * c.width;
        const mPerPx = calib.realM / distPx;
        setCalib(c=>({...c, p2:[x,y], mPerPx}));
      } else {
        setCalib({p1:[x,y], p2:null, realM:calib.realM, mPerPx:null});
      }
      return;
    }
    if(mode==="measure"){
      if(!measure.a) setMeasure({a:[x,y], b:null, distPx:null});
      else if(!measure.b){
        const dx = x-measure.a![0], dy = y-measure.a![1];
        const distPx = Math.sqrt(dx*dx+dy*dy) * c.width;
        setMeasure({a:measure.a, b:[x,y], distPx});
      } else {
        setMeasure({a:[x,y], b:null, distPx:null});
      }
      return;
    }
    if(mode==="edit" && activeId){
      const activeZone = zones.find(z=>z.id===activeId);
      if(activeZone){
        const closest = activeZone.polygon.findIndex(([px,py])=>{
          const dx = (px - x)*c.width, dy = (py - y)*c.height;
          return Math.sqrt(dx*dx+dy*dy) < 14;
        });
        if(closest>=0){ setDragPoint({zoneId:activeId, pointIdx:closest}); return; }
      }
    }
    if(mode==="draw"){ setDrawing(d => [...d, [x,y]]); }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>)=>{
    if(!dragPoint) return;
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX-rect.left)/rect.width;
    const y = (e.clientY-rect.top)/rect.height;
    setZones(zs=>zs.map(z=>{
      if(z.id!==dragPoint.zoneId) return z;
      const newPoly = [...z.polygon];
      newPoly[dragPoint.pointIdx] = [x,y];
      return {...z, polygon:newPoly};
    }));
  };

  const onMouseUp = ()=> setDragPoint(null);

  const finish = () => {
    if(drawing.length<3) return;
    const id = prompt("Zone id (e.g. lumber_yard):", `zone_${zones.length+1}`) || `zone_${zones.length+1}`;
    const rule = prompt("Rule (e.g. R-04.2):", "R-04.2") || "R-04.2";
    const page = parseInt(prompt("Page citation (e.g. 87):", "87") || "87");
    setZones(z => [...z.filter(zone=>zone.id!==id), {id, polygon:drawing, label:`${id} • ${rule} p${page}`, type:"distance", rule, page, section:`§${page}`, severity:"high", color:"#111", params:`zone:${id} • p${page}`, visible:true} as any]);
    setDrawing([]); setActiveId(id);
  };

  const deleteZone = (id:string)=> setZones(z=>z.filter(zone=>zone.id!==id));
  const duplicateZone = (id:string)=>{
    const z = zones.find(zone=>zone.id===id);
    if(!z) return;
    const newId = `${z.id}_copy`;
    setZones([...zones, {...z, id:newId, polygon: z.polygon.map(([x,y])=>[x+0.02,y+0.02] as [number,number])}]);
    setActiveId(newId);
  };

  const exportZones = ()=>{
    const blob = new Blob([JSON.stringify(zones, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="zones.json"; a.click();
  };

  const onFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const f = e.target.files?.[0];
    if(!f) return;
    const url = URL.createObjectURL(f);
    setFloorPlan(url);
  };

  const activeZone = zones.find(z=>z.id===activeId);

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-[#111] antialiased selection:bg-black selection:text-white">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-[#EDEBE6]">
        <div className="mx-auto max-w-[1440px] px-8 h-[64px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="h-6 w-6 bg-black rounded-[7px] flex items-center justify-center"><div className="h-2 w-2 bg-[#FFD60A] rounded-[1px]" /></div>
            <span className="text-[15px] font-[650] tracking-[-0.02em]">CiteSight</span>
            <span className="ml-2 text-[11px] text-[#9A9A98]">/ Zone</span>
          </a>
          <div className="flex items-center gap-2">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onFloorPlanUpload} />
            <button onClick={()=>fileInputRef.current?.click()} className="h-8 px-3 rounded-full bg-white border border-[#EDEDEB] text-[12px] font-[500] hover:border-black transition-colors">Upload floor plan</button>
            <div className="h-6 w-px bg-[#EDEDEB]" />
            <button onClick={()=>setMode("draw")} className={`h-8 px-4 rounded-full text-[12px] font-[500] border transition-colors ${mode==="draw" ? "bg-black text-white border-black" : "bg-white border-[#EDEDEB] hover:border-black"}`}>Draw</button>
            <button onClick={()=>setMode("edit")} className={`h-8 px-4 rounded-full text-[12px] font-[500] border transition-colors ${mode==="edit" ? "bg-black text-white border-black" : "bg-white border-[#EDEDEB] hover:border-black"}`}>Edit</button>
            <button onClick={()=>setMode("calibrate")} className={`h-8 px-4 rounded-full text-[12px] font-[500] border transition-colors ${mode==="calibrate" ? "bg-[#FFD60A] text-black border-black" : "bg-white border-[#EDEDEB] hover:border-black"}`}>Calibrate</button>
            <button onClick={()=>setMode("measure")} className={`h-8 px-4 rounded-full text-[12px] font-[500] border transition-colors ${mode==="measure" ? "bg-[#0A84FF] text-white border-[#0A84FF]" : "bg-white border-[#EDEDEB] hover:border-black"}`}>Measure</button>
            <div className="h-6 w-px bg-[#EDEDEB]" />
            <button onClick={()=>setDrawing([])} className="h-8 px-3 rounded-full bg-white border border-[#EDEDEB] text-[12px] hover:border-black transition-colors">Clear</button>
            <button onClick={finish} className="h-8 px-4 rounded-full bg-black text-white text-[12px] font-[600] hover:bg-[#222] transition-colors">Finish</button>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-8 py-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-[700] tracking-[-0.02em]">Draw zones once — saves to zones.json</h2>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="bg-black text-white px-2.5 py-1 rounded-full">{zones.length} zones</span>
              <span className="bg-white border border-[#EDEDEB] px-2.5 py-1 rounded-full">{drawing.length} points</span>
              {calib.mPerPx && <span className="bg-[#FFD60A] text-black px-2.5 py-1 rounded-full">{calib.mPerPx.toExponential(2)} m/px • {calib.realM}m real</span>}
            </div>
          </div>
          <p className="mt-2 text-[13px] leading-[1.6] text-[#6B6B6B] max-w-[560px]">Click to add points. One-time calibration pixel → meter via aisle width. Geometry engine uses zones, not LLM per frame. Drag points in Edit mode to adjust.</p>

          <div className="mt-6 border border-black rounded-[16px] overflow-hidden bg-white relative">
            <canvas ref={canvasRef} width={1200} height={750} onClick={onCanvasClick} onMouseMove={onMouseMove} onMouseUp={onMouseUp} className="w-full h-auto cursor-crosshair block" />
            {floorPlan && <img src={floorPlan} alt="floor plan" className="absolute inset-0 w-full h-full object-cover opacity-[0.15] pointer-events-none" />}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-white border border-[#EDEDEB] rounded-[12px] p-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Mode</div>
              <div className="mt-1 text-[12px] font-[500]">{mode} • {mode==="draw" ? "Click to add points" : mode==="edit" ? "Drag points to edit" : mode==="calibrate" ? "Set A then B for known distance" : "Set A then B to measure"}</div>
            </div>
            <div className="bg-white border border-[#EDEDEB] rounded-[12px] p-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Calibration</div>
              <div className="mt-1 flex items-center gap-2 text-[12px]">
                <span>{calib.p1 ? "A set" : "A not set"}</span>
                <span className="text-[#9A9A98]">•</span>
                <span>{calib.p2 ? `B set • ${calib.mPerPx?.toExponential(2)} m/px` : "B not set"}</span>
                <input type="number" value={calib.realM} onChange={e=>setCalib(c=>({...c, realM: parseFloat(e.target.value)||3.2, mPerPx: c.p1 && c.p2 ? parseFloat(e.target.value) / (Math.hypot((c.p2[0]-c.p1[0])*1200, (c.p2[1]-c.p1[1])*750)) : null}))} className="ml-2 w-14 h-6 bg-[#F6F6F5] border border-[#EDEDEB] rounded px-2 text-[11px]" />
                <span className="text-[11px]">m real</span>
              </div>
            </div>
            <div className="bg-white border border-[#EDEDEB] rounded-[12px] p-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Storage</div>
              <div className="mt-1 text-[12px]">Zones saved to localStorage + edge/zones.json • $0.35/hr • SAM 3.1 on-demand once $0.0025</div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="border border-[#EDEDEB] rounded-[20px] bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-[600] tracking-[-0.01em]">Zones • {zones.length}</div>
              <div className="flex gap-1.5">
                <button onClick={exportZones} className="h-7 px-3 rounded-full bg-[#F6F6F5] border border-[#EDEDEB] text-[11px] font-[500] hover:border-black transition-colors">Export JSON</button>
                <button onClick={()=>{ if(confirm("Reset to default 4 zones?")) { localStorage.removeItem("citesight_zones_complicated"); setZones(DEFAULT); } }} className="h-7 px-3 rounded-full bg-white border border-[#EDEDEB] text-[11px] font-[500] hover:border-black transition-colors">Reset</button>
              </div>
            </div>

            <div className="mt-4 space-y-3 max-h-[640px] overflow-auto pr-1">
              {zones.map(z=>(
                <div key={z.id} className={`border rounded-[14px] p-4 transition-colors ${activeId===z.id ? "bg-[#111] text-white border-black" : "bg-[#FAFAF9] border-[#EDEDEB] hover:border-black"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <button onClick={()=>setActiveId(z.id)} className="text-left flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{background:z.color}} />
                        <span className="text-[13px] font-[600] tracking-[-0.01em] truncate">{z.id}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 border border-white/10">{z.rule} p{z.page}</span>
                      </div>
                      <div className="mt-2 text-[12px] leading-[1.4] opacity-80 line-clamp-2">{z.label} • {z.section}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded-full">{z.type}</span>
                        <span className="text-[10px] font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded-full">{z.severity}</span>
                        <span className="text-[10px] font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded-full">{z.polygon.length} points</span>
                      </div>
                    </button>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button onClick={()=>setActiveId(z.id)} className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] border transition-colors ${activeId===z.id ? "bg-white text-black border-white" : "bg-white border-[#EDEDEB] hover:border-black"}`}>✎</button>
                      <button onClick={()=>duplicateZone(z.id)} className="h-7 w-7 rounded-full bg-white border border-[#EDEDEB] flex items-center justify-center text-[11px] hover:border-black transition-colors">⎘</button>
                      <button onClick={()=>deleteZone(z.id)} className="h-7 w-7 rounded-full bg-[#FF3B30] text-white flex items-center justify-center text-[11px] hover:bg-[#E03028] transition-colors">✕</button>
                    </div>
                  </div>

                  {activeId===z.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <label className="text-[11px]">
                          <span className="opacity-60">Type</span>
                          <select value={z.type} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, type:e.target.value as ZoneType}:zz))} className="mt-1 w-full h-8 bg-white text-black border border-[#EDEDEB] rounded-[8px] px-2 text-[12px] font-[500]">
                            <option value="distance">distance</option><option value="overlap">overlap</option><option value="presence">presence</option><option value="state">state</option>
                          </select>
                        </label>
                        <label className="text-[11px]">
                          <span className="opacity-60">Severity</span>
                          <select value={z.severity} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, severity:e.target.value as Severity}:zz))} className="mt-1 w-full h-8 bg-white text-black border border-[#EDEDEB] rounded-[8px] px-2 text-[12px] font-[500]">
                            <option value="critical">critical</option><option value="high">high</option><option value="medium">medium</option><option value="low">low</option>
                          </select>
                        </label>
                        <label className="text-[11px] col-span-2">
                          <span className="opacity-60">Rule • Page • Section</span>
                          <div className="mt-1 grid grid-cols-12 gap-2">
                            <input value={z.rule} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, rule:e.target.value}:zz))} className="col-span-3 h-8 bg-white text-black border border-[#EDEDEB] rounded-[8px] px-2 text-[12px] font-mono" placeholder="R-04.2" />
                            <input type="number" value={z.page} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, page:parseInt(e.target.value)||0}:zz))} className="col-span-2 h-8 bg-white text-black border border-[#EDEDEB] rounded-[8px] px-2 text-[12px] font-mono" placeholder="87" />
                            <input value={z.section} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, section:e.target.value}:zz))} className="col-span-7 h-8 bg-white text-black border border-[#EDEDEB] rounded-[8px] px-2 text-[12px]" placeholder="§4.2 Moving Machinery" />
                          </div>
                        </label>
                        <label className="text-[11px] col-span-2">
                          <span className="opacity-60">Params (DSL)</span>
                          <input value={z.params} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, params:e.target.value}:zz))} className="mt-1 w-full h-8 bg-white text-black border border-[#EDEDEB] rounded-[8px] px-2 text-[11px] font-mono" placeholder="zone:lumber_yard • ppe:hard_hat" />
                        </label>
                        <label className="text-[11px] col-span-2 flex items-center gap-2">
                          <span className="opacity-60">Color</span>
                          <input type="color" value={z.color} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, color:e.target.value}:zz))} className="h-8 w-12 rounded-[8px] border border-[#EDEDEB] bg-white" />
                          <span className="text-[11px] font-mono">{z.color}</span>
                          <span className="ml-auto text-[10px] font-mono opacity-50">{(z.polygon.reduce((acc,_,i,arr)=>{ const [x1,y1]=arr[i]; const [x2,y2]=arr[(i+1)%arr.length]; return acc + (x1*y2 - x2*y1); },0)*0.5).toFixed(3)} area normalized</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href="/watch" className="h-10 flex items-center justify-center rounded-full bg-black text-white text-[12px] font-[600] hover:bg-[#222] transition-colors">Watch → real YOLO</a>
              <button onClick={exportZones} className="h-10 rounded-full border border-[#EDEDEB] bg-white text-[12px] font-[500] hover:border-black transition-colors">Export zones.json • $0.35/hr</button>
            </div>

            <div className="mt-4 text-[10px] leading-[1.5] text-[#9A9A98] font-mono">Floor plan upload (tint 20% opacity), edit points drag 14px threshold, add/delete, duplicate, lock/visible toggle, color by severity critical red #FF3B30 high yellow #FFD60A presence blue #0A84FF, type distance/overlap/presence/state, rule R-04.2 p87, params zone, area shoelace, calibration px→m via aisle 3.2m, measure A-B, import/export JSON, localStorage + edge/zones.json, SAM 3.1 on-demand once $0.0025 + incident 5 frames $0.0125 not per frame $270/hr, geometry uses zones not LLM per frame, edge box RTSP tap no new cameras.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
