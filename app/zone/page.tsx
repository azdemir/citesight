"use client";

import { useState, useRef, useEffect, useCallback } from "react";

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

  // Load saved
  useEffect(() => {
    try {
      const saved = localStorage.getItem("citesight_zones_complicated");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length>0) setZones(parsed);
      }
      const savedCalib = localStorage.getItem("citesight_calib");
      if (savedCalib) setCalib(JSON.parse(savedCalib));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("citesight_zones_complicated", JSON.stringify(zones)); } catch {}
    fetch("http://localhost:8000/zones", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(zones.map(({id, polygon, label})=>({id, polygon, label}))) }).catch(()=>{});
  }, [zones]);
  useEffect(()=>{ try{ localStorage.setItem("citesight_calib", JSON.stringify(calib)); }catch{} }, [calib]);

  const canvasWH = { w: 1200, h: 750 };

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle = "#EDEBE6"; ctx.lineWidth = 1;
    for(let i=0;i<c.width;i+=32){ ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,c.height); ctx.stroke(); }
    for(let j=0;j<c.height;j+=32){ ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(c.width,j); ctx.stroke(); }

    // calibration line
    if (calib.p1 && calib.p2) {
      ctx.beginPath();
      ctx.moveTo(calib.p1[0]*c.width, calib.p1[1]*c.height);
      ctx.lineTo(calib.p2[0]*c.width, calib.p2[1]*c.height);
      ctx.strokeStyle = "#111"; ctx.lineWidth = 2.5; ctx.setLineDash([8,6]); ctx.stroke(); ctx.setLineDash([]);
      // dots
      [calib.p1, calib.p2].forEach(p=>{
        ctx.beginPath(); ctx.arc(p[0]*c.width, p[1]*c.height, 6,0,Math.PI*2); ctx.fillStyle="#FFD60A"; ctx.fill(); ctx.strokeStyle="#111"; ctx.lineWidth=2; ctx.stroke();
      });
    }
    if (calib.p1 && !calib.p2) {
      ctx.beginPath(); ctx.arc(calib.p1[0]*c.width, calib.p1[1]*c.height, 6,0,Math.PI*2); ctx.fillStyle="#FFD60A"; ctx.fill(); ctx.strokeStyle="#111"; ctx.lineWidth=2; ctx.stroke();
    }

    // measure
    if (measure.a && measure.b) {
      ctx.beginPath();
      ctx.moveTo(measure.a[0]*c.width, measure.a[1]*c.height);
      ctx.lineTo(measure.b[0]*c.width, measure.b[1]*c.height);
      ctx.strokeStyle = "#0A84FF"; ctx.lineWidth = 2.5; ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
      [measure.a, measure.b].forEach(p=>{
        ctx.beginPath(); ctx.arc(p[0]*c.width, p[1]*c.height, 6,0,Math.PI*2); ctx.fillStyle="#0A84FF"; ctx.fill(); ctx.strokeStyle="#fff"; ctx.lineWidth=2; ctx.stroke();
      });
    }
    if (measure.a && !measure.b) {
      ctx.beginPath(); ctx.arc(measure.a[0]*c.width, measure.a[1]*c.height, 6,0,Math.PI*2); ctx.fillStyle="#0A84FF"; ctx.fill();
    }

    zones.forEach(z => {
      const isActive = z.id === activeId;
      if (!z.polygon || z.polygon.length<2) return;
      ctx.beginPath();
      z.polygon.forEach(([x,y], i) => { const px = x*c.width, py = y*c.height; if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); });
      ctx.closePath();
      ctx.fillStyle = isActive ? z.color + "33" : z.color + "18";
      ctx.fill();
      ctx.strokeStyle = isActive ? "#111" : z.color; ctx.lineWidth = isActive ? 2.2 : 1.5; ctx.setLineDash(z.type==="distance" ? [] : [8,6]); ctx.stroke(); ctx.setLineDash([]);
      if(isActive && mode==="edit"){
        z.polygon.forEach(([x,y], idx)=>{
          const active = idx===dragPoint?.pointIdx && dragPoint?.zoneId===z.id;
          ctx.beginPath(); ctx.arc(x*c.width, y*c.height, active ? 8 : 5.5, 0, Math.PI*2);
          ctx.fillStyle = active ? "#FFD60A" : "#111"; ctx.fill();
          ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
        });
      }
    });

    if (drawing.length>0){
      ctx.beginPath();
      drawing.forEach(([x,y], i) => { const px = x*c.width, py = y*c.height; if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); });
      if (drawing.length>=3) ctx.closePath();
      ctx.strokeStyle = "#111"; ctx.lineWidth = 2; ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
      drawing.forEach(([x,y])=>{ ctx.beginPath(); ctx.arc(x*c.width,y*c.height,5,0,Math.PI*2); ctx.fillStyle="#111"; ctx.fill(); ctx.strokeStyle="#fff"; ctx.lineWidth=1.5; ctx.stroke(); });
    }
  }, [zones, activeId, drawing, dragPoint, calib, measure, floorPlan, mode]);

  useEffect(()=>{ draw(); }, [draw]);

  // Window-level mouseup to end drag even outside canvas
  useEffect(()=>{
    const onWinUp = () => setDragPoint(null);
    window.addEventListener("mouseup", onWinUp);
    return () => window.removeEventListener("mouseup", onWinUp);
  }, []);

  const getNormPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return { x: (e.clientX-rect.left)/rect.width, y: (e.clientY-rect.top)/rect.height, rect, c };
  };

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y, c } = getNormPos(e);

    if(mode==="calibrate"){
      if(!calib.p1) setCalib(s=>({...s, p1:[x,y]}));
      else if(!calib.p2){
        const p1 = calib.p1!;
        const dx = x-p1[0], dy = y-p1[1];
        const distPx = Math.sqrt(dx*dx + dy*dy) * c.width;
        const mPerPx = distPx>1 ? calib.realM / distPx : null;
        setCalib(s=>({...s, p2:[x,y], mPerPx}));
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
          return Math.sqrt(dx*dx+dy*dy) < 18;
        });
        if(closest>=0){ setDragPoint({zoneId:activeId, pointIdx:closest}); return; }
      }
    }
    if(mode==="draw"){ setDrawing(d => [...d, [x,y]]); }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if(mode!=="edit") return;
    const { x, y, c } = getNormPos(e);
    const activeZone = zones.find(z=>z.id===activeId);
    if(!activeZone) return;
    const closest = activeZone.polygon.findIndex(([px,py])=>{
      const dx = (px - x)*c.width, dy = (py - y)*c.height;
      return Math.sqrt(dx*dx+dy*dy) < 18;
    });
    if(closest>=0) setDragPoint({zoneId:activeId, pointIdx:closest});
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>)=>{
    if(!dragPoint) return;
    const { x, y } = getNormPos(e);
    setZones(zs=>zs.map(z=>{
      if(z.id!==dragPoint.zoneId) return z;
      const newPoly = [...z.polygon] as [number,number][];
      newPoly[dragPoint.pointIdx] = [x,y];
      return {...z, polygon:newPoly};
    }));
  };

  const finish = () => {
    if(drawing.length<3) {
      alert(`Draw at least 3 points to make a zone. Currently ${drawing.length} points.`);
      return;
    }
    const defaultId = `zone_${zones.length+1}`;
    const idInput = window.prompt("Zone id (e.g. lumber_yard):", defaultId);
    if (idInput===null) return;
    const id = (idInput.trim() || defaultId).replace(/\s+/g,'_').toLowerCase();
    const ruleInput = window.prompt("Rule (e.g. R-04.2):", "R-04.2");
    if (ruleInput===null) return;
    const rule = ruleInput.trim() || "R-04.2";
    const pageInput = window.prompt("Page citation (e.g. 87):", "87");
    if (pageInput===null) return;
    const page = parseInt(pageInput)||87;
    const newZone: Zone = { id, polygon:drawing, label:`${id} • ${rule} p${page}`, type:"distance", rule, page, section:`§${page}`, severity:"high", color:"#111", params:`zone:${id} • p${page}` };
    setZones(z => [...z.filter(zone=>zone.id!==id), newZone]);
    setDrawing([]); 
    setActiveId(id);
    setMode("edit");
  };

  const clearDrawing = () => {
    setDrawing([]);
    if (mode==="calibrate") setCalib(s=>({p1:null,p2:null,realM:s.realM,mPerPx:null}));
    if (mode==="measure") setMeasure({a:null,b:null,distPx:null});
    if (mode==="draw") {} // just points
  };

  const clearAllTemp = () => {
    setDrawing([]);
    setCalib({p1:null,p2:null,realM:3.2,mPerPx:null});
    setMeasure({a:null,b:null,distPx:null});
  };

  const deleteZone = (id:string)=> { setZones(z=>z.filter(zone=>zone.id!==id)); if(activeId===id) setActiveId(zones[0]?.id || ""); };
  const duplicateZone = (id:string)=>{
    const z = zones.find(zone=>zone.id===id);
    if(!z) return;
    const newId = `${z.id}_copy_${Date.now()%1000}`;
    setZones([...zones, {...z, id:newId, polygon: z.polygon.map(([x,y])=>[x+0.02,y+0.02] as [number,number])}]);
    setActiveId(newId);
  };

  const exportZones = ()=>{
    const blob = new Blob([JSON.stringify(zones, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="zones.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const onFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const f = e.target.files?.[0];
    if(!f) return;
    const url = URL.createObjectURL(f);
    setFloorPlan(url);
  };

  const activeZone = zones.find(z=>z.id===activeId);
  const measureText = (() => {
    if (!measure.a || !measure.b || !measure.distPx) return null;
    const px = measure.distPx;
    const m = calib.mPerPx ? (px * calib.mPerPx) : null;
    return { px: px.toFixed(1), m: m ? m.toFixed(2) : null };
  })();

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-[#111] antialiased selection:bg-black selection:text-white">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[#EDEBE6]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 h-[64px] flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-6 w-6 bg-black rounded-[7px] flex items-center justify-center"><div className="h-2 w-2 bg-[#FFD60A] rounded-[1px]" /></div>
            <span className="text-[15px] font-[650] tracking-[-0.02em]">CiteSight</span>
            <span className="ml-2 text-[11px] text-[#9A9A98]">/ Zone</span>
          </a>
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap justify-end">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onFloorPlanUpload} />
            <button type="button" onClick={()=>fileInputRef.current?.click()} className="h-8 px-3 rounded-full bg-white border border-[#EDEBE6] text-[12px] font-[500] hover:border-black transition-colors">Upload floor plan</button>
            <div className="hidden md:block h-6 w-px bg-[#EDEBE6] mx-1" />
            <button type="button" onClick={()=>{ setMode("draw"); }} className={`h-8 px-4 rounded-full text-[12px] font-[600] border transition-all ${mode==="draw" ? "bg-black text-white border-black shadow-[0_2px_8px_rgba(0,0,0,0.15)]" : "bg-white border-[#EDEBE6] hover:border-black hover:bg-[#FAFAF9]"}`}>Draw</button>
            <button type="button" onClick={()=>{ setMode("edit"); }} className={`h-8 px-4 rounded-full text-[12px] font-[600] border transition-all ${mode==="edit" ? "bg-black text-white border-black shadow-[0_2px_8px_rgba(0,0,0,0.15)]" : "bg-white border-[#EDEBE6] hover:border-black hover:bg-[#FAFAF9]"}`}>Edit</button>
            <button type="button" onClick={()=>{ setMode("calibrate"); }} className={`h-8 px-4 rounded-full text-[12px] font-[600] border transition-all ${mode==="calibrate" ? "bg-[#FFD60A] text-black border-black shadow-[0_2px_8px_rgba(255,214,10,0.3)]" : "bg-white border-[#EDEBE6] hover:border-black hover:bg-[#FAFAF9]"}`}>Calibrate</button>
            <button type="button" onClick={()=>{ setMode("measure"); }} className={`h-8 px-4 rounded-full text-[12px] font-[600] border transition-all ${mode==="measure" ? "bg-[#0A84FF] text-white border-[#0A84FF] shadow-[0_2px_8px_rgba(10,132,255,0.3)]" : "bg-white border-[#EDEBE6] hover:border-black hover:bg-[#FAFAF9]"}`}>Measure</button>
            <div className="hidden md:block h-6 w-px bg-[#EDEBE6] mx-1" />
            <button type="button" onClick={clearDrawing} className="h-8 px-3 rounded-full bg-white border border-[#EDEBE6] text-[12px] font-[500] hover:border-black hover:bg-[#FAFAF9] transition-colors">Clear</button>
            <button type="button" onClick={finish} disabled={mode==="draw" && drawing.length>0 && drawing.length<3} title={drawing.length<3 ? `Need 3 points, have ${drawing.length}` : `Finish zone with ${drawing.length} points`} className={`h-8 px-4 rounded-full text-[12px] font-[700] transition-all ${drawing.length>=3 ? "bg-black text-white hover:bg-[#222] shadow-[0_2px_10px_rgba(0,0,0,0.18)]" : "bg-[#EDEBE6] text-[#9A9A98] cursor-not-allowed border border-[#EDEBE6]"}`}>Finish</button>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-6 md:py-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[18px] md:text-[20px] font-[700] tracking-[-0.02em]">Draw zones once — saves to zones.json</h2>
            <div className="flex items-center gap-2 text-[11px] font-mono flex-wrap">
              <span className="bg-black text-white px-2.5 py-1 rounded-full">{zones.length} zones</span>
              <span className={`px-2.5 py-1 rounded-full border ${drawing.length>=3 ? "bg-[#FFD60A] text-black border-black" : "bg-white border-[#EDEBE6]"}`}>{drawing.length} points {drawing.length>=3 ? "✓ ready" : ""}</span>
              {calib.mPerPx && <span className="bg-[#FFD60A] text-black px-2.5 py-1 rounded-full font-mono">{calib.mPerPx.toExponential(2)} m/px • {calib.realM}m real</span>}
              {measureText && <span className="bg-[#0A84FF] text-white px-2.5 py-1 rounded-full font-mono">{measureText.px}px {measureText.m ? `• ${measureText.m}m` : ""}</span>}
            </div>
          </div>
          <p className="mt-2 text-[12px] md:text-[13px] leading-[1.6] text-[#6B6B6B] max-w-[640px]">Draw: click 3+ points → Finish. Edit: drag points (12px handles). Calibrate: click A then B for known aisle width (px→m). Measure: A→B distance. Clear resets temp. All saves to localStorage + edge.</p>

          <div className="mt-5 border border-black rounded-[16px] overflow-hidden bg-white relative shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <canvas 
              ref={canvasRef} 
              width={canvasWH.w} 
              height={canvasWH.h} 
              onClick={onCanvasClick} 
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove} 
              onMouseUp={()=>setDragPoint(null)} 
              className={`w-full h-auto block ${mode==="draw" ? "cursor-crosshair" : mode==="edit" ? "cursor-grab" : mode==="calibrate" ? "cursor-copy" : "cursor-cell"}`} 
            />
            {floorPlan && <img src={floorPlan} alt="floor plan" className="absolute inset-0 w-full h-full object-cover opacity-[0.18] pointer-events-none" />}
            {/* Mode overlay */}
            <div className="pointer-events-none absolute top-3 left-3 bg-black/85 text-white text-[10px] font-mono px-2.5 py-1 rounded-full backdrop-blur">{mode.toUpperCase()} {mode==="draw" ? `• ${drawing.length} PTS • CLICK TO ADD` : mode==="edit" ? "• DRAG POINTS" : mode==="calibrate" ? "• CLICK A THEN B" : "• CLICK A THEN B"}</div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-[#EDEBE6] rounded-[12px] p-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Mode</div>
              <div className="mt-1 text-[12px] font-[600] capitalize">{mode} <span className="font-[400] text-[#6B6B6B]">• {mode==="draw" ? `${drawing.length} points, need 3 minimum` : mode==="edit" ? "Drag points to edit zone shape" : mode==="calibrate" ? `Set A then B for known ${calib.realM}m distance` : "Set A then B to measure distance"}</span></div>
              <div className="mt-2 flex gap-1.5">
                <button type="button" onClick={clearAllTemp} className="h-6 px-2.5 rounded-full bg-[#F6F6F5] border border-[#EDEBE6] text-[10px] font-mono hover:border-black">Reset cal+measure</button>
              </div>
            </div>
            <div className="bg-white border border-[#EDEBE6] rounded-[12px] p-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Calibration px→m</div>
              <div className="mt-2 flex items-center gap-2 text-[12px] flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[11px] ${calib.p1 ? "bg-[#FFD60A] text-black" : "bg-[#F6F6F5] border border-[#EDEBE6]"}`}>{calib.p1 ? "A set" : "A not set"}</span>
                <span className="text-[#9A9A98]">•</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] ${calib.p2 ? "bg-[#FFD60A] text-black" : "bg-[#F6F6F5] border border-[#EDEBE6]"}`}>{calib.p2 ? `B set ${calib.mPerPx ? `• ${calib.mPerPx.toExponential(2)} m/px` : ""}` : "B not set"}</span>
                <div className="flex items-center gap-1">
                  <input type="number" step="0.1" min="0.1" value={Number.isFinite(calib.realM) ? calib.realM : 3.2} onChange={e=>{
                    const v = parseFloat(e.target.value);
                    const real = Number.isFinite(v) && v>0 ? v : 3.2;
                    setCalib(c=>{
                      if(!c.p1 || !c.p2) return {...c, realM: real};
                      const dx = c.p2[0]-c.p1[0], dy = c.p2[1]-c.p1[1];
                      const distPx = Math.sqrt(dx*dx + dy*dy) * canvasWH.w;
                      return {...c, realM: real, mPerPx: distPx>1 ? real/distPx : null};
                    });
                  }} className="w-16 h-7 bg-[#F6F6F5] border border-[#EDEBE6] rounded-[8px] px-2 text-[11px] font-mono" />
                  <span className="text-[11px]">m real</span>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#EDEBE6] rounded-[12px] p-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Storage + Cost</div>
              <div className="mt-1 text-[11px] leading-[1.5] text-[#6B6B6B] font-mono">localStorage • edge/zones.json • {zones.length} zones • $0.35/hr • SAM 3.1 on-demand once $0.0025</div>
              <div className="mt-1 text-[11px] font-mono">{measureText ? `Measure: ${measureText.px}px ${measureText.m ? `= ${measureText.m}m` : ""}` : "Measure: no points"}</div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="border border-[#EDEBE6] rounded-[20px] bg-white p-5 sticky top-[84px]">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-[700] tracking-[-0.01em]">Zones • {zones.length}</div>
              <div className="flex gap-1.5">
                <button type="button" onClick={exportZones} className="h-7 px-3 rounded-full bg-[#F6F6F5] border border-[#EDEBE6] text-[11px] font-[600] hover:border-black transition-colors">Export JSON</button>
                <button type="button" onClick={()=>{ if(confirm("Reset to default 4 zones?")) { localStorage.removeItem("citesight_zones_complicated"); setZones(DEFAULT); setActiveId(DEFAULT[0].id); } }} className="h-7 px-3 rounded-full bg-white border border-[#EDEBE6] text-[11px] font-[600] hover:border-black transition-colors">Reset</button>
              </div>
            </div>

            <div className="mt-4 space-y-3 max-h-[68vh] overflow-auto pr-1">
              {zones.map(z=>(
                <div key={z.id} className={`border rounded-[14px] p-4 transition-all ${activeId===z.id ? "bg-[#111] text-white border-black shadow-[0_4px_16px_rgba(0,0,0,0.15)]" : "bg-[#FAFAF9] border-[#EDEBE6] hover:border-black hover:bg-white"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" onClick={()=>setActiveId(z.id)} className="text-left flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{background:z.color}} />
                        <span className="text-[13px] font-[700] tracking-[-0.01em] truncate">{z.id}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${activeId===z.id ? "bg-white/10 border-white/20 text-white/80" : "bg-white border-[#EDEBE6]"}`}>{z.rule} p{z.page}</span>
                      </div>
                      <div className="mt-2 text-[12px] leading-[1.4] opacity-80 line-clamp-2">{z.label} • {z.section}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${activeId===z.id ? "bg-white/10 border-white/10" : "bg-white border-[#EDEBE6]"}`}>{z.type}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${activeId===z.id ? "bg-white/10 border-white/10" : "bg-white border-[#EDEBE6]"}`}>{z.severity}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${activeId===z.id ? "bg-white/10 border-white/10" : "bg-white border-[#EDEBE6]"}`}>{z.polygon.length} pts</span>
                      </div>
                    </button>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button type="button" onClick={()=>setActiveId(z.id)} className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] border transition-colors ${activeId===z.id ? "bg-white text-black border-white" : "bg-white border-[#EDEBE6] hover:border-black"}`}>✎</button>
                      <button type="button" onClick={()=>duplicateZone(z.id)} className="h-7 w-7 rounded-full bg-white border border-[#EDEBE6] flex items-center justify-center text-[11px] hover:border-black transition-colors">⎘</button>
                      <button type="button" onClick={()=>deleteZone(z.id)} className="h-7 w-7 rounded-full bg-[#FF3B30] text-white flex items-center justify-center text-[11px] hover:bg-[#E03028] transition-colors">✕</button>
                    </div>
                  </div>

                  {activeId===z.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <label className="text-[11px] font-[500]">
                          <span className="opacity-60">Type</span>
                          <select value={z.type} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, type:e.target.value as ZoneType}:zz))} className="mt-1 w-full h-8 bg-white text-black border border-[#EDEBE6] rounded-[8px] px-2 text-[12px] font-[600]">
                            <option value="distance">distance</option><option value="overlap">overlap</option><option value="presence">presence</option><option value="state">state</option>
                          </select>
                        </label>
                        <label className="text-[11px] font-[500]">
                          <span className="opacity-60">Severity</span>
                          <select value={z.severity} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, severity:e.target.value as Severity}:zz))} className="mt-1 w-full h-8 bg-white text-black border border-[#EDEBE6] rounded-[8px] px-2 text-[12px] font-[600]">
                            <option value="critical">critical</option><option value="high">high</option><option value="medium">medium</option><option value="low">low</option>
                          </select>
                        </label>
                        <label className="text-[11px] font-[500] col-span-2">
                          <span className="opacity-60">Rule • Page • Section</span>
                          <div className="mt-1 grid grid-cols-12 gap-2">
                            <input value={z.rule} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, rule:e.target.value}:zz))} className="col-span-3 h-8 bg-white text-black border border-[#EDEBE6] rounded-[8px] px-2 text-[12px] font-mono" placeholder="R-04.2" />
                            <input type="number" value={Number.isFinite(z.page) ? z.page : 0} onChange={e=>{ const v=parseInt(e.target.value); setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, page: Number.isFinite(v)?v:0}:zz)); }} className="col-span-2 h-8 bg-white text-black border border-[#EDEBE6] rounded-[8px] px-2 text-[12px] font-mono" placeholder="87" />
                            <input value={z.section} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, section:e.target.value}:zz))} className="col-span-7 h-8 bg-white text-black border border-[#EDEBE6] rounded-[8px] px-2 text-[12px]" placeholder="§4.2 Moving Machinery" />
                          </div>
                        </label>
                        <label className="text-[11px] font-[500] col-span-2">
                          <span className="opacity-60">Params (DSL)</span>
                          <input value={z.params} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, params:e.target.value}:zz))} className="mt-1 w-full h-8 bg-white text-black border border-[#EDEBE6] rounded-[8px] px-2 text-[11px] font-mono" placeholder="zone:lumber_yard • ppe:hard_hat" />
                        </label>
                        <label className="text-[11px] font-[500] col-span-2 flex items-center gap-2">
                          <span className="opacity-60">Color</span>
                          <input type="color" value={z.color} onChange={e=>setZones(zs=>zs.map(zz=>zz.id===z.id?{...zz, color:e.target.value}:zz))} className="h-8 w-12 rounded-[8px] border border-[#EDEBE6] bg-white" />
                          <span className="text-[11px] font-mono">{z.color}</span>
                          <span className="ml-auto text-[10px] font-mono opacity-50">{(Math.abs(z.polygon.reduce((acc,_,i,arr)=>{ const [x1,y1]=arr[i]; const [x2,y2]=arr[(i+1)%arr.length]; return acc + (x1*y2 - x2*y1); },0))*0.5).toFixed(4)} area</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href="/watch" className="h-10 flex items-center justify-center rounded-full bg-black text-white text-[12px] font-[700] hover:bg-[#222] transition-colors">Watch → YOLO live</a>
              <button type="button" onClick={exportZones} className="h-10 rounded-full border border-[#EDEBE6] bg-white text-[12px] font-[600] hover:border-black transition-colors">Export zones.json</button>
            </div>

            <div className="mt-4 text-[10px] leading-[1.5] text-[#9A9A98] font-mono">Tip: Draw 3+ points → Finish prompts id/rule/page → becomes editable zone. Edit mode drag handles 18px. Calibrate: click A,B for known aisle width (default 3.2m). Measure: A,B distance. Floor plan upload 18% tint. All geometry $0.35/hr not VLM. Edge box RTSP tap no new cameras.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
