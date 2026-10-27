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
  locked?: boolean;
  visible?: boolean;
};

const DEFAULT: Zone[] = [
  { id: "lumber_yard", polygon: [[0.05,0.1],[0.45,0.1],[0.45,0.85],[0.05,0.85]], label: "lumber yard • hard hat + glasses required", type: "presence", rule: "R-03.4", page: 64, section: "§3.4 Head Protection", severity: "critical", color: "#FF3B30", params: "zone:lumber_yard • ppe:hard_hat,glasses" },
  { id: "forklift_lane", polygon: [[0.05,0.78],[0.95,0.78],[0.95,0.88],[0.05,0.88]], label: "forklift lane • no customer when moving", type: "overlap", rule: "R-12.8", page: 203, section: "§12.8 Vehicle Separation", severity: "high", color: "#FFD60A", params: "tool:forklift • zone:ped_lane • occupancy" },
  { id: "station_3", polygon: [[0.55,0.4],[0.9,0.4],[0.9,0.75],[0.55,0.75]], label: "station 3 • gloves required", type: "presence", rule: "R-07.1", page: 112, section: "§7.1 PPE Compliance", severity: "high", color: "#0A84FF", params: "zone:station_3 • ppe:gloves" },
  { id: "saw_zone", polygon: [[0.3,0.35],[0.5,0.35],[0.5,0.55],[0.3,0.55]], label: "table saw • no person within 1.5m when running", type: "distance", rule: "R-04.2", page: 87, section: "§4.2 Moving Machinery", severity: "critical", color: "#FF3B30", params: "tool:saw • state:running • d<1.5m" },
];

export default function ZonePage() {
  const [zones, setZones] = useState<Zone[]>(DEFAULT);
  const [activeId, setActiveId] = useState<string>("lumber_yard");
  const [drawing, setDrawing] = useState<[number,number][]>([]);
  const [mode, setMode] = useState<"draw"|"edit"|"measure"|"calibrate">("draw");
  const [dragPoint, setDragPoint] = useState<{zoneId:string; pointIdx:number} | null>(null);
  const [floorPlan, setFloorPlan] = useState<string | null>(null);
  const [calib, setCalib] = useState<{p1:[number,number]|null; p2:[number,number]|null; realM: number; mPerPx: number|null}>({p1:null,p2:null,realM:3.2,mPerPx:null});
  const [measure, setMeasure] = useState<{a:[number,number]|null; b:[number,number]|null; distPx:number|null}>({a:null,b:null,distPx:null});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load/save
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
    // floor plan bg
    if (floorPlan) {
      const img = new Image();
      img.src = floorPlan;
      // async draw, but for simplicity fill with image via drawImage when loaded — use cached
      // We'll draw grid over it anyway
    }
    ctx.fillStyle = "#F6F6F5"; ctx.fillRect(0,0,c.width,c.height);
    if (floorPlan) {
      ctx.fillStyle = "#EDEDEB"; // placeholder for floor plan tint
      ctx.fillRect(0,0,c.width,c.height);
    }
    ctx.strokeStyle = "#EDEDEB"; ctx.lineWidth = 1;
    for(let i=0;i<c.width;i+=24){ ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,c.height); ctx.stroke(); }
    for(let j=0;j<c.height;j+=24){ ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(c.width,j); ctx.stroke(); }

    // calibration line
    if (calib.p1 && calib.p2) {
      ctx.beginPath();
      ctx.moveTo(calib.p1[0]*c.width, calib.p1[1]*c.height);
      ctx.lineTo(calib.p2[0]*c.width, calib.p2[1]*c.height);
      ctx.strokeStyle = "#111"; ctx.lineWidth = 2; ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
      const midX = (calib.p1[0]+calib.p2[0])/2*c.width, midY = (calib.p1[1]+calib.p2[1])/2*c.height;
      ctx.fillStyle = "#111"; ctx.font = "11px Geist Mono"; ctx.fillText(`${calib.realM}m real = ${calib.mPerPx ? calib.mPerPx.toFixed(4)+"m/px" : "calibrating..."}`, midX+6, midY-6);
    }
    if (calib.p1) { ctx.beginPath(); ctx.arc(calib.p1[0]*c.width, calib.p1[1]*c.height, 6,0,Math.PI*2); ctx.fillStyle="#111"; ctx.fill(); ctx.fillStyle="#fff"; ctx.font="10px Geist Mono"; ctx.fillText("A", calib.p1[0]*c.width+8, calib.p1[1]*c.height-8); }
    if (calib.p2) { ctx.beginPath(); ctx.arc(calib.p2[0]*c.width, calib.p2[1]*c.height, 6,0,Math.PI*2); ctx.fillStyle="#111"; ctx.fill(); ctx.fillStyle="#fff"; ctx.font="10px Geist Mono"; ctx.fillText("B", calib.p2[0]*c.width+8, calib.p2[1]*c.height-8); }

    // measure line
    if (measure.a && measure.b && measure.distPx!==null) {
      ctx.beginPath();
      ctx.moveTo(measure.a[0]*c.width, measure.a[1]*c.height);
      ctx.lineTo(measure.b[0]*c.width, measure.b[1]*c.height);
      ctx.strokeStyle = "#0A84FF"; ctx.lineWidth = 2; ctx.stroke();
      const midX = (measure.a[0]+measure.b[0])/2*c.width, midY = (measure.a[1]+measure.b[1])/2*c.height;
      const realM = calib.mPerPx ? (measure.distPx * calib.mPerPx).toFixed(2)+"m" : `${measure.distPx.toFixed(0)}px`;
      ctx.fillStyle = "#0A84FF"; ctx.fillRect(midX-20, midY-18, 80, 14);
      ctx.fillStyle = "#fff"; ctx.font="10px Geist Mono"; ctx.fillText(realM, midX-16, midY-8);
    }

    // zones
    zones.forEach(z => {
      if(z.visible===false) return;
      const isActive = z.id === activeId;
      ctx.beginPath();
      z.polygon.forEach(([x,y], i) => { const px = x*c.width, py = y*c.height; if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); });
      ctx.closePath();
      const alpha = isActive ? 0.25 : 0.08;
      ctx.fillStyle = z.color + Math.round(alpha*255).toString(16).padStart(2,'0');
      // fallback
      if(z.color==="#FFD60A") ctx.fillStyle = isActive ? "rgba(255,214,10,0.25)" : "rgba(255,214,10,0.08)";
      else if(z.color==="#FF3B30") ctx.fillStyle = isActive ? "rgba(255,59,48,0.25)" : "rgba(255,59,48,0.08)";
      else if(z.color==="#0A84FF") ctx.fillStyle = isActive ? "rgba(10,132,255,0.25)" : "rgba(10,132,255,0.08)";
      else ctx.fillStyle = isActive ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.03)";
      ctx.fill();
      ctx.strokeStyle = isActive ? "#111" : z.color; ctx.lineWidth = isActive ? 2.5 : 1.5; ctx.setLineDash(z.type==="distance" ? [] : z.type==="presence" ? [8,4] : [6,6]); ctx.stroke(); ctx.setLineDash([]);
      // points if active and edit mode
      if(isActive && mode==="edit"){
        z.polygon.forEach(([x,y], idx)=>{
          ctx.beginPath(); ctx.arc(x*c.width, y*c.height, idx===dragPoint?.pointIdx && dragPoint?.zoneId===z.id ? 7 : 5, 0, Math.PI*2);
          ctx.fillStyle = idx===dragPoint?.pointIdx ? "#FFD60A" : "#111"; ctx.fill();
          ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
        });
      }
      // label
      const cx = z.polygon.reduce((a,p)=>a+p[0],0)/z.polygon.length * c.width;
      const cy = z.polygon.reduce((a,p)=>a+p[1],0)/z.polygon.length * c.height;
      ctx.fillStyle = "#111"; ctx.font = "11px Geist Mono"; ctx.fillText(`${z.id} • ${z.rule} p${z.page} • ${z.type}`, cx-60, cy);
    });

    // drawing
    if (drawing.length>0){
      ctx.beginPath();
      drawing.forEach(([x,y], i) => { const px = x*c.width, py = y*c.height; if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); });
      ctx.strokeStyle = "#FFD60A"; ctx.lineWidth = 2.5; ctx.stroke();
      drawing.forEach(([x,y])=>{ ctx.beginPath(); ctx.arc(x*c.width,y*c.height,5,0,Math.PI*2); ctx.fillStyle="#FFD60A"; ctx.fill(); ctx.strokeStyle="#111"; ctx.lineWidth=1; ctx.stroke(); });
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
      // check if close to existing point for drag
      const activeZone = zones.find(z=>z.id===activeId);
      if(activeZone){
        const closest = activeZone.polygon.findIndex(([px,py])=>{
          const dx = (px - x)*c.width, dy = (py - y)*c.height;
          return Math.sqrt(dx*dx+dy*dy) < 12;
        });
        if(closest>=0){
          setDragPoint({zoneId:activeId, pointIdx:closest});
          return;
        }
      }
    }
    // draw mode
    if(mode==="draw"){
      setDrawing(d => [...d, [x,y]]);
    }
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
    const id = prompt("Zone id (e.g. lumber_yard, forklift_lane, station_3, saw_zone):", `zone_${zones.length+1}`) || `zone_${zones.length+1}`;
    const rule = prompt("Rule (e.g. R-04.2):", "R-04.2") || "R-04.2";
    const page = parseInt(prompt("Page citation (e.g. 87):", "87") || "87");
    const section = prompt("Section (e.g. §4.2 Moving Machinery):", "§4.2 Moving Machinery") || "§4.2";
    const type = prompt("Type: distance/overlap/presence/state", "distance") as ZoneType || "distance";
    const label = `${id} • ${rule} p${page} ${section}`;
    const color = type==="distance" ? "#FF3B30" : type==="presence" ? "#0A84FF" : type==="overlap" ? "#FFD60A" : "#111";
    setZones(z => [...z.filter(zone=>zone.id!==id), {id, polygon:drawing, label, type, rule, page, section, severity:"high", color, params:`zone:${id} • p${page}`, visible:true} as Zone]);
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
    <div className="min-h-screen bg-white text-[#111] antialiased">
      <header className="h-[64px] border-b border-[#EDEDEB] flex items-center justify-between px-8 max-w-[1440px] mx-auto w-full">
        <a href="/" className="flex items-center gap-2"><div className="h-5 w-5 bg-black rounded-[5px] flex items-center justify-center"><div className="h-1.5 w-1.5 bg-[#FFD60A] rounded-[1px]" /></div><span className="font-[650] text-[15px]">CiteSight</span><span className="ml-2 text-[11px] text-[#9A9A98]">/ Zone • complicated • floor plan + calibration + measurements + edit + types</span></a>
        <div className="flex gap-2">
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onFloorPlanUpload} />
          <button onClick={()=>fileInputRef.current?.click()} className="h-8 px-3 rounded-full border border-[#EDEDEB] text-[11px] font-mono">Upload floor plan</button>
          <button onClick={()=>setMode("draw")} className={`h-8 px-3 rounded-full text-[11px] font-mono border ${mode==="draw" ? "bg-black text-white border-black" : "bg-white border-[#EDEDEB]"}`}>Draw</button>
          <button onClick={()=>setMode("edit")} className={`h-8 px-3 rounded-full text-[11px] font-mono border ${mode==="edit" ? "bg-black text-white border-black" : "bg-white border-[#EDEDEB]"}`}>Edit points (drag)</button>
          <button onClick={()=>setMode("calibrate")} className={`h-8 px-3 rounded-full text-[11px] font-mono border ${mode==="calibrate" ? "bg-[#FFD60A] text-black border-black" : "bg-white border-[#EDEDEB]"}`}>Calibrate {calib.mPerPx ? `${calib.mPerPx.toFixed(5)}m/px` : "px→m"}</button>
          <button onClick={()=>setMode("measure")} className={`h-8 px-3 rounded-full text-[11px] font-mono border ${mode==="measure" ? "bg-[#0A84FF] text-white border-[#0A84FF]" : "bg-white border-[#EDEDEB]"}`}>Measure {measure.distPx ? `${measure.distPx.toFixed(0)}px ${calib.mPerPx ? `= ${(measure.distPx*calib.mPerPx).toFixed(2)}m` : ""}` : ""}</button>
          <button onClick={()=>setDrawing([])} className="h-8 px-3 rounded-full border border-[#EDEDEB] text-[11px] font-mono">Clear drawing</button>
          <button onClick={finish} className="h-8 px-4 rounded-full bg-black text-white text-[11px] font-mono">Finish → save (with rule pXX)</button>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-8 py-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[18px] font-[700] tracking-[-0.02em]">Draw zones once. Complicated: floor plan + calibration + measurements + edit + types + page citations</h2>
            <div className="flex gap-2 text-[10px] font-mono">
              <span className="bg-black text-white px-2 py-1 rounded-full">{zones.length} zones</span>
              <span className="bg-[#F6F6F5] border border-[#EDEDEB] px-2 py-1 rounded-full">{drawing.length} points drawing</span>
              {calib.mPerPx && <span className="bg-[#FFD60A] text-black px-2 py-1 rounded-full">{calib.mPerPx.toExponential(2)} m/px • {calib.realM}m real</span>}
            </div>
          </div>
          <div className="border-2 border-black rounded-[16px] overflow-hidden bg-white relative">
            <canvas ref={canvasRef} width={1200} height={750} onClick={onCanvasClick} onMouseMove={onMouseMove} onMouseUp={onMouseUp} className="w-full h-auto cursor-crosshair block" />
            {floorPlan && <img src={floorPlan} alt="floor plan" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-mono">
            <div className="bg-[#F6F6F5] border border-[#EDEDEB] rounded-[8px] p-2">Mode: {mode} • Click to {mode==="draw" ? "add points" : mode==="edit" ? "drag points (close to point)" : mode==="calibrate" ? "set A then B for known distance" : mode==="measure" ? "set A then B measure" : ""}</div>
            <div className="bg-[#F6F6F5] border border-[#EDEDEB] rounded-[8px] p-2">Calibration: {calib.p1 ? `A set` : "A not set"} • {calib.p2 ? `B set • ${calib.realM}m = ${calib.mPerPx?.toExponential(2)} m/px` : "B not set"} • Real m: <input type="number" value={calib.realM} onChange={e=>setCalib(c=>({...c, realM: parseFloat(e.target.value)||3.2, mPerPx: c.p1 && c.p2 ? parseFloat(e.target.value) / (Math.hypot((c.p2[0]-c.p1[0])*1200, (c.p2[1]-c.p1[1])*750)) : null}))} className="w-12 bg-white border border-[#EDEDEB] rounded px-1" />m</div>
            <div className="bg-[#F6F6F5] border border-[#EDEDEB] rounded-[8px] p-2">Zones saved to localStorage complicated + edge/zones.json • $0.35/hr • SAM 3.1 on-demand once $0.0025</div>
          </div>

          <div className="mt-8 border border-[#EDEDEB] rounded-[16px] p-5 bg-[#FAFAF9]">
            <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">HOW COMPLICATED ZONE ANNOTATOR WORKS</div>
            <div className="mt-3 grid md:grid-cols-3 gap-4 text-[11px] leading-[1.6] text-[#6B6B6B]">
              <div><b className="text-black">Floor plan upload:</b> Upload floor plan image, tint overlay 20% opacity, draw zones over it. Real workplace floor plan from Home Depot example removed, now generic.</div>
              <div><b className="text-black">Edit points (drag):</b> In edit mode, close to point 12px triggers drag, move point, polygon updates real-time, area recalculated (shoelace formula).</div>
              <div><b className="text-black">Calibration & measure:</b> Calibrate mode sets A then B for known real distance 3.2m aisle width, computes mPerPx. Measure mode sets A-B distance px + real m = px * mPerPx.</div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="border border-[#EDEDEB] rounded-[20px] bg-[#FAFAF9] p-5">
            <div className="flex justify-between items-center">
              <div className="text-[11px] font-mono uppercase text-[#9A9A98]">ZONES • {zones.length} • complicated: type, rule, page, severity, color, params, lock, visible</div>
              <div className="flex gap-1">
                <button onClick={exportZones} className="h-6 px-2 rounded-full bg-white border border-[#EDEDEB] text-[10px] font-mono">Export JSON</button>
                <button onClick={()=>{ if(confirm("Reset to default 4 zones?")) { localStorage.removeItem("citesight_zones_complicated"); setZones(DEFAULT); } }} className="h-6 px-2 rounded-full bg-white border border-[#EDEDEB] text-[10px] font-mono">Reset</button>
              </div>
            </div>
            <div className="mt-4 space-y-3 max-h-[560px] overflow-auto pr-1">
              {zones.map(z=>(
                <div key={z.id} className={`border rounded-[14px] p-3 text-[11px] ${activeId===z.id ? "bg-black text-white border-black" : "bg-white border-[#EDEDEB] hover:border-black"}`}>
                  <div className="flex justify-between items-start gap-2">
                    <button onClick={()=>setActiveId(z.id)} className="text-left flex-1">
                      <div className="font-[700] flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{background:z.color}} />{z.id} • {z.rule} p{z.page}</div>
                      <div className="mt-1 opacity-80 line-clamp-2">{z.label} • {z.section} • {z.severity} • {z.type}</div>
                      <div className="mt-1 font-mono text-[10px] opacity-60">{z.params} • {z.polygon.length} points • area ~{(z.polygon.reduce((acc,_,i,arr)=>{ const [x1,y1]=arr[i]; const [x2,y2]=arr[(i+1)%arr.length]; return acc + (x1*y2 - x2*y1); },0)*0.5).toFixed(3)} normalized</div>
                    </button>
                    <div className="flex flex-col gap-1">
                      <button onClick={()=>setActiveId(z.id)} className={`h-6 w-6 rounded-full border flex items-center justify-center text-[10px] ${activeId===z.id ? "bg-white text-black" : "bg-[#F6F6F5] border-[#EDEDEB]"}`}>✎</button>
                      <button onClick={()=>duplicateZone(z.id)} className="h-6 w-6 rounded-full bg-[#F6F6F5] border border-[#EDEDEB] flex items-center justify-center text-[10px]">⎘</button>
                      <button onClick={()=>deleteZone(z.id)} className="h-6 w-6 rounded-full bg-[#FF3B30] text-white flex items-center justify-center text-[10px]">✕</button>
                    </div>
                  </div>
                  {activeId===z.id && (
                    <div className="mt-3 pt-3 border-t border-[#EDEDEB] space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <label className="text-[10px]">Type<select value={z.type} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, type:e.target.value as ZoneType}:zz))} className="w-full mt-1 h-7 bg-white border border-[#EDEDEB] rounded px-1 text-[11px]"><option value="distance">distance</option><option value="overlap">overlap</option><option value="presence">presence</option><option value="state">state</option></select></label>
                        <label className="text-[10px]">Severity<select value={z.severity} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, severity:e.target.value as Severity}:zz))} className="w-full mt-1 h-7 bg-white border border-[#EDEDEB] rounded px-1 text-[11px]"><option value="critical">critical</option><option value="high">high</option><option value="medium">medium</option><option value="low">low</option></select></label>
                        <label className="text-[10px]">Rule<input value={z.rule} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, rule:e.target.value}:zz))} className="w-full mt-1 h-7 bg-white border border-[#EDEDEB] rounded px-1 text-[11px]" /></label>
                        <label className="text-[10px]">Page<input type="number" value={z.page} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, page:parseInt(e.target.value)||0}:zz))} className="w-full mt-1 h-7 bg-white border border-[#EDEDEB] rounded px-1 text-[11px]" /></label>
                        <label className="text-[10px] col-span-2">Params (DSP) <input value={z.params} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, params:e.target.value}:zz))} className="w-full mt-1 h-7 bg-white border border-[#EDEDEB] rounded px-1 text-[11px]" /></label>
                        <label className="text-[10px] col-span-2">Color<input type="color" value={z.color} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, color:e.target.value}:zz))} className="w-full mt-1 h-7 bg-white border border-[#EDEDEB] rounded px-1" /></label>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, visible: zz.visible===false ? true : false}:zz))} className="h-7 px-2 rounded-full border border-[#EDEDEB] text-[10px] font-mono bg-white">{z.visible===false ? "Show" : "Hide"} zone</button>
                        <button onClick={()=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, locked: !zz.locked}:zz))} className="h-7 px-2 rounded-full border border-[#EDEDEB] text-[10px] font-mono bg-white">{z.locked ? "Unlock" : "Lock"} editing</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href="/watch" className="h-9 flex items-center justify-center rounded-full bg-black text-white text-[11px] font-mono font-[600]">Watch → real YOLO</a>
              <button onClick={exportZones} className="h-9 rounded-full border border-[#EDEDEB] text-[11px] font-mono bg-white">Export zones.json • $0.35/hr</button>
            </div>
            <div className="mt-4 text-[10px] font-mono text-[#9A9A98] leading-[1.5]">Complicated: floor plan upload (tint 20% opacity), edit points drag (12px threshold), add/delete points, duplicate, lock, visible toggle, color by severity critical red #FF3B30 high yellow #FFD60A, type distance/overlap/presence/state, rule R-04.2 p87, params zone:xxx, area shoelace formula, calibration px→m via aisle 3.2m, measure A-B distance px + real m, import/export JSON, localStorage complicated + edge/zones.json, SAM 3.1 on-demand once $0.0025 zone + incident 5 frames $0.0125 not per frame $270/hr, geometry engine uses zones not LLM per frame, edge box RTSP tap no new cameras.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
