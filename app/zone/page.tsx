"use client";

import { useState, useRef, useEffect } from "react";

type Zone = { id: string; polygon: [number, number][]; label: string };

const DEFAULT: Zone[] = [
  { id: "lumber_yard", polygon: [[0.05,0.1],[0.45,0.1],[0.45,0.85],[0.05,0.85]], label: "lumber yard • hard hat + glasses required p87" },
  { id: "forklift_lane", polygon: [[0.05,0.78],[0.95,0.78],[0.95,0.88],[0.05,0.88]], label: "forklift lane • no customer when moving p112" },
  { id: "station_3", polygon: [[0.55,0.4],[0.9,0.4],[0.9,0.75],[0.55,0.75]], label: "station 3 • gloves required p112" },
];

export default function ZonePage() {
  const [zones, setZones] = useState<Zone[]>(DEFAULT);
  const [activeId, setActiveId] = useState<string>("lumber_yard");
  const [drawing, setDrawing] = useState<[number,number][]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("citesight_zones");
    if (saved) { try { setZones(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem("citesight_zones", JSON.stringify(zones));
    fetch("http://localhost:8000/zones", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(zones) }).catch(()=>{});
  }, [zones]);

  const draw = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle = "#F6F6F5"; ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle = "#EDEDEB"; ctx.lineWidth = 1;
    for(let i=0;i<c.width;i+=32){ ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,c.height); ctx.stroke(); }
    for(let j=0;j<c.height;j+=32){ ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(c.width,j); ctx.stroke(); }
    zones.forEach(z => {
      const isActive = z.id === activeId;
      ctx.beginPath();
      z.polygon.forEach(([x,y], i) => { const px = x*c.width, py = y*c.height; if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); });
      ctx.closePath();
      ctx.fillStyle = isActive ? "rgba(255,214,10,0.25)" : "rgba(0,0,0,0.04)";
      ctx.fill();
      ctx.strokeStyle = isActive ? "#111" : "#9A9A98"; ctx.lineWidth = isActive ? 2 : 1; ctx.setLineDash(isActive ? [] : [6,6]); ctx.stroke(); ctx.setLineDash([]);
      const cx = z.polygon.reduce((a,p)=>a+p[0],0)/z.polygon.length * c.width;
      const cy = z.polygon.reduce((a,p)=>a+p[1],0)/z.polygon.length * c.height;
      ctx.fillStyle = "#111"; ctx.font = "11px Geist Mono"; ctx.fillText(z.id, cx-20, cy);
    });
    if (drawing.length>0){
      ctx.beginPath();
      drawing.forEach(([x,y], i) => { const px = x*c.width, py = y*c.height; if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); });
      ctx.strokeStyle = "#FFD60A"; ctx.lineWidth = 2; ctx.stroke();
      drawing.forEach(([x,y])=>{ ctx.beginPath(); ctx.arc(x*c.width,y*c.height,4,0,Math.PI*2); ctx.fillStyle="#FFD60A"; ctx.fill(); });
    }
  };

  useEffect(()=>{ draw(); }, [zones, activeId, drawing]);

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX-rect.left)/rect.width;
    const y = (e.clientY-rect.top)/rect.height;
    setDrawing(d => [...d, [x,y]]);
  };

  const finish = () => {
    if(drawing.length<3) return;
    const id = prompt("Zone id:", `zone_${zones.length+1}`) || `zone_${zones.length+1}`;
    const label = prompt("Label with page citation:", "") || id;
    setZones(z => [...z.filter(zone=>zone.id!==id), {id, polygon:drawing, label}]);
    setDrawing([]); setActiveId(id);
  };

  return (
    <div className="min-h-screen bg-white text-[#111] antialiased">
      <header className="h-[64px] border-b border-[#EDEDEB] flex items-center justify-between px-8 max-w-[1120px] mx-auto w-full">
        <a href="/" className="flex items-center gap-2"><div className="h-5 w-5 bg-black rounded-[5px] flex items-center justify-center"><div className="h-1.5 w-1.5 bg-[#FFD60A] rounded-[1px]" /></div><span className="font-[650] text-[15px]">CiteSight</span><span className="ml-2 text-[11px] text-[#9A9A98]">/ Zone • one-time</span></a>
        <div className="flex gap-2"><button onClick={()=>setDrawing([])} className="h-8 px-4 rounded-full border border-[#EDEDEB] text-[12px]">Clear</button><button onClick={finish} className="h-8 px-4 rounded-full bg-black text-white text-[12px]">Finish → save</button></div>
      </header>
      <div className="max-w-[1120px] mx-auto px-8 py-12 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <h2 className="text-[24px] font-[700] tracking-[-0.02em]">Draw zones once. Saves to zones.json.</h2>
          <p className="mt-3 text-[14px] text-[#6B6B6B] max-w-[520px]">Click to draw polygon. One-time calibration pixel→meter via aisle 3.2m reference. Geometry engine uses these zones, not LLM per frame.</p>
          <div className="mt-8 border border-black rounded-[20px] overflow-hidden bg-white">
            <canvas ref={canvasRef} width={800} height={500} onClick={onClick} className="w-full h-auto cursor-crosshair block" />
          </div>
          <div className="mt-3 text-[11px] font-mono text-[#9A9A98]">Click to add points • Finish polygon • Zones saved to localStorage + edge/zones.json • $0.35/hr</div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="border border-[#EDEDEB] rounded-[20px] bg-[#FAFAF9] p-6">
            <div className="text-[11px] font-mono uppercase text-[#9A9A98]">ZONES • {zones.length}</div>
            <div className="mt-4 space-y-2">
              {zones.map(z=>(
                <button key={z.id} onClick={()=>setActiveId(z.id)} className={`w-full text-left border rounded-[12px] p-3 text-[12px] ${activeId===z.id ? "bg-black text-white border-black" : "bg-white border-[#EDEDEB] hover:border-black"}`}>
                  <div className="font-[600]">{z.id}</div><div className="mt-1 text-[11px] opacity-70">{z.label}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-2"><a href="/watch" className="h-9 flex-1 rounded-full bg-black text-white flex items-center justify-center text-[12px] font-[600]">Watch →</a><button onClick={()=>setZones(DEFAULT)} className="h-9 px-4 rounded-full border border-[#EDEDEB] text-[12px]">Reset demo</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}
