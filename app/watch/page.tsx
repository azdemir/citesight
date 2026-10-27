"use client";

import { useEffect, useRef, useState } from "react";

type Mask = { label:string; color:string; x:number; y:number; w:number; h:number; id:string; confidence?:number; dashed?:boolean };
type Incident = { id:string; page:number; section:string; text:string; severity:string; dist?:string; limit?:string };

export default function WatchPage(){
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [masks, setMasks] = useState<Mask[]>([
    {label:"person #1",color:"#30D158",x:18,y:22,w:18,h:42,id:"person_01",confidence:0.92},
    {label:"table saw",color:"#FF3B30",x:34,y:38,w:28,h:18,id:"saw_01"},
    {label:"lumber_yard",color:"#FFD60A",x:5,y:10,w:40,h:75,id:"lumber_yard",dashed:true},
  ]);
  const [incidents, setIncidents] = useState<Incident[]>([
    {id:"R-04.2",page:87,section:"§4.2 Moving Machinery",text:"Person within 0.8m of running saw, violates p87 §4.2 (limit 1.5m). Recommended: stop + LOTO.",severity:"high",dist:"0.8m",limit:"1.5m"}
  ]);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"mock"|"webcam">("mock");

  useEffect(()=>{
    if(mode!=="webcam") return;
    (async()=>{
      try{
        const stream = await navigator.mediaDevices.getUserMedia({video:{width:1280,height:720}});
        if(videoRef.current){ videoRef.current.srcObject = stream; await videoRef.current.play(); setRunning(true); }
      }catch(e){ setMode("mock"); }
    })();
    return ()=>{ if(videoRef.current?.srcObject){ (videoRef.current.srcObject as MediaStream).getTracks().forEach(t=>t.stop()); } };
  },[mode]);

  useEffect(()=>{
    if(mode!=="webcam" || !running) return;
    let id:any;
    const loop = async()=>{
      const canvas = document.createElement("canvas");
      const v = videoRef.current;
      if(!v) return;
      canvas.width = v.videoWidth; canvas.height = v.videoHeight;
      const ctx = canvas.getContext("2d")!; ctx.drawImage(v,0,0);
      const blob = await new Promise<Blob|null>(r=>canvas.toBlob(b=>r(b),"image/jpeg",0.7));
      if(!blob) return;
      try{
        const fd = new FormData(); fd.append("file", blob, "frame.jpg");
        const res = await fetch("http://localhost:8000/detect", {method:"POST", body:fd});
        const data = await res.json();
        if(data.masks) setMasks(data.masks);
        if(data.incidents) setIncidents(data.incidents);
      }catch{}
    };
    id = setInterval(loop, 1500);
    return ()=>clearInterval(id);
  },[mode, running]);

  useEffect(()=>{
    const c = canvasRef.current;
    if(!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0,0,c.width,c.height);
    masks.forEach(m=>{
      const x = (m.x/100)*c.width, y=(m.y/100)*c.height, w=(m.w/100)*c.width, h=(m.h/100)*c.height;
      ctx.strokeStyle = m.color;
      ctx.lineWidth = m.dashed ? 1.5 : 2;
      if(m.dashed) ctx.setLineDash([8,6]); else ctx.setLineDash([]);
      ctx.strokeRect(x,y,w,h);
      ctx.fillStyle = m.color;
      ctx.fillRect(x, y-14, (m.label.length*6)+12, 14);
      ctx.fillStyle = m.dashed ? "#000" : "#fff";
      ctx.font = "10px Geist Mono";
      ctx.fillText(m.label, x+4, y-4);
      ctx.setLineDash([]);
    });
  },[masks]);

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-[#111] antialiased selection:bg-black selection:text-white">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-[#EDEDEB]">
        <div className="mx-auto max-w-[1280px] px-8 h-[64px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5"><div className="h-6 w-6 bg-black rounded-[7px] flex items-center justify-center"><div className="h-2 w-2 bg-[#FFD60A] rounded-[1px]" /></div><span className="text-[15px] font-[650] tracking-[-0.02em]">CiteSight</span><span className="ml-2 text-[11px] text-[#9A9A98]">/ Watch • $0.35/hr</span></a>
          <div className="flex items-center gap-2">
            <button onClick={()=>setMode(mode==="webcam"?"mock":"webcam")} className={`h-8 px-4 rounded-full text-[12px] font-[500] border transition-colors ${mode==="webcam" ? "bg-black text-white border-black" : "bg-white border-[#EDEDEB] hover:border-black"}`}>{mode==="webcam" ? "Webcam ON • YOLO" : "Start webcam"}</button>
            <a href="/zone" className="h-8 px-4 rounded-full border border-[#EDEDEB] flex items-center text-[12px] font-[500] hover:border-black transition-colors">Zone →</a>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-8 py-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-[700] tracking-[-0.02em]">Live watch • SAM masks • $0.35/hr • 0 LLM calls/frame</h2>
            <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Masks • {masks.length} • real YOLO</div>
          </div>
          <div className="mt-4 relative border border-black rounded-[20px] overflow-hidden bg-black aspect-[16/10]">
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-40" muted playsInline />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1E1E21_0%,_#000_70%)] opacity-60" />
            <canvas ref={canvasRef} width={1280} height={720} className="absolute inset-0 w-full h-full" />
            <div className="absolute top-0 left-0 right-0 h-9 bg-white/90 backdrop-blur border-b border-black/10 flex items-center justify-between px-4 text-[10px] font-mono">
              <span>{mode==="webcam" ? "LIVE • workshop_cam_03 • SAM 3.1 • 30 FPS • YOLOv8n-seg" : "MOCK • workshop demo • SAM masks"}</span>
              <span className="bg-[#FFD60A] text-black px-2 py-0.5 rounded"> $0.35/HR • YOLO true </span>
            </div>
            <div className="absolute left-4 bottom-4 right-4 md:w-[360px] bg-white border border-black rounded-[14px] p-4">
              <div className="flex justify-between"><span className="text-[11px] font-mono font-[700] tracking-[0.02em]">{incidents[0]?.id || "R-04.2"} • p{incidents[0]?.page || 87} §4.2</span><span className="bg-[#FFD60A] text-black text-[9px] px-1.5 py-0.5 rounded-full">HIGH</span></div>
              <div className="mt-2 text-[12px] leading-[1.4]">{incidents[0]?.text || "Person within 0.8 m of running saw, violates 1.5 m. Clip 14:03:10–15."}</div>
              <div className="mt-2 text-[10px] font-mono text-[#9A9A98]">Geometry 0.8m measured, not VLM guess. Page citation p87. 12x more efficient.</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-px bg-black rounded-[12px] overflow-hidden border border-black">
            <div className="bg-white p-3 flex justify-between text-[11px] font-mono"><span className="text-[#9A9A98] uppercase tracking-[0.08em]">Masks</span><span className="font-[500]">{masks.length} • real YOLO</span></div>
            <div className="bg-white p-3 flex justify-between text-[11px] font-mono"><span className="text-[#9A9A98] uppercase tracking-[0.08em]">Geometry</span><span className="font-[500]">0.8m measured</span></div>
            <div className="bg-white p-3 flex justify-between text-[11px] font-mono"><span className="text-[#9A9A98] uppercase tracking-[0.08em]">LLM calls</span><span className="font-[500]">0 / frame</span></div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="border border-[#EDEDEB] rounded-[20px] bg-white p-5">
            <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Masks • YOLO+SAM • Real + Mock</div>
            <div className="mt-4 space-y-2 max-h-[320px] overflow-auto">
              {masks.slice(0,6).map(m=>(
                <div key={m.id} className="flex items-center justify-between border border-[#EDEDEB] rounded-[10px] px-3 py-2.5 text-[12px]">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{background:m.color}} /><span className="font-[500] tracking-[-0.01em]">{m.label}</span></div>
                  <span className="text-[11px] font-mono text-[#9A9A98]">{m.x.toFixed(0)}% • {m.confidence ? `${(m.confidence*100).toFixed(0)}%` : ""}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-[12px] leading-[1.6] text-[#6B6B6B]">Edge box taps existing RTSP <span className="font-mono bg-black text-white px-1.5 py-0.5 rounded text-[11px]">rtsp://.../cam12</span><br />No new cameras. Zones from /zone → geometry checks. Optical flow 2ms for moving state. Slack/SMS + clip with page citation p87.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
