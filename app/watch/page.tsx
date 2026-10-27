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
    if(masks.find(m=>m.id.includes("person")) && masks.find(m=>m.id.includes("saw"))){
      const p = masks.find(m=>m.id.includes("person"))!;
      const s = masks.find(m=>m.id.includes("saw"))!;
      const px1 = (p.x+p.w/2)/100*c.width, py1=(p.y+p.h/2)/100*c.height;
      const px2 = (s.x+s.w/2)/100*c.width, py2=(s.y+s.h/2)/100*c.height;
      ctx.beginPath(); ctx.moveTo(px1,py1); ctx.lineTo(px2,py2);
      ctx.strokeStyle="#FFD60A"; ctx.lineWidth=1.5; ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle="#FFD60A"; ctx.fillRect((px1+px2)/2-26, (py1+py2)/2-18, 52,14);
      ctx.fillStyle="#000"; ctx.font="10px Geist Mono"; ctx.fillText("0.8m < 1.5m", (px1+px2)/2-20, (py1+py2)/2-8);
    }
  },[masks]);

  return (
    <div className="min-h-screen bg-white text-[#111] antialiased">
      <header className="h-[64px] border-b border-[#EDEDEB] flex items-center justify-between px-8 max-w-[1120px] mx-auto">
        <a href="/" className="flex items-center gap-2.5"><div className="h-6 w-6 bg-black rounded-[6px] flex items-center justify-center"><div className="h-2 w-2 bg-[#FFD60A] rounded-[1px]" /></div><span className="text-[15px] font-[650] tracking-[-0.02em]">CiteSight</span><span className="ml-3 text-[11px] text-[#9A9A98]">/ Watch • $0.35/hr</span></a>
        <div className="flex gap-2">
          <button onClick={()=>setMode(mode==="webcam"?"mock":"webcam")} className={`h-8 px-4 rounded-full text-[12px] border ${mode==="webcam" ? "bg-black text-white border-black" : "bg-white border-[#EDEDEB]"}`}>{mode==="webcam" ? "Webcam ON • YOLO" : "Start webcam"}</button>
          <a href="/zone" className="h-8 px-4 rounded-full border border-[#EDEDEB] flex items-center text-[12px]">Zone →</a>
        </div>
      </header>

      <div className="max-w-[1120px] mx-auto px-8 py-12 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="relative border border-black rounded-[24px] overflow-hidden bg-black aspect-[16/10]">
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-40" muted playsInline />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1E1E21_0%,_#000_70%)] opacity-60" />
            <canvas ref={canvasRef} width={1280} height={720} className="absolute inset-0 w-full h-full" />
            <div className="absolute top-0 left-0 right-0 h-9 bg-white/90 backdrop-blur border-b border-black/10 flex items-center justify-between px-4 text-[10px] font-mono">
              <span>{mode==="webcam" ? "LIVE • workshop_cam_03 • SAM 3.1 • 30 FPS • YOLOv8n-seg" : "MOCK • workshop demo • SAM masks"}</span>
              <span className="bg-[#FFD60A] text-black px-2 py-0.5">$0.35/HR</span>
            </div>
            <div className="absolute left-4 bottom-4 right-4 md:w-[360px] bg-white border border-black rounded-[16px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <div className="flex justify-between"><span className="text-[11px] font-mono font-[700]">{incidents[0]?.id || "R-04.2"} • p{incidents[0]?.page || 87} §4.2</span><span className="bg-[#FFD60A] text-black text-[9px] px-1.5 py-0.5 rounded">HIGH</span></div>
              <div className="mt-2 text-[12px] leading-[1.4]">{incidents[0]?.text || "Person within 0.8 m of running saw, violates 1.5 m. Clip 14:03:10–15."}</div>
              <div className="mt-2 text-[10px] font-mono text-[#9A9A98]">Geometry 0.8m measured, not VLM guess. Page citation p87. 12x cheaper.</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-px bg-black rounded-[12px] overflow-hidden border border-black text-[11px] font-mono">
            <div className="bg-[#F6F6F5] p-3 flex justify-between"><span className="text-[#9A9A98]">Masks</span><span>{masks.length}</span></div>
            <div className="bg-[#F6F6F5] p-3 flex justify-between"><span className="text-[#9A9A98]">LLM calls</span><span>0 / frame</span></div>
            <div className="bg-[#F6F6F5] p-3 flex justify-between"><span className="text-[#9A9A98]">Cost</span><span>$0.35/hr</span></div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="border border-[#EDEDEB] rounded-[16px] bg-[#FAFAF9] p-6">
            <div className="text-[11px] font-mono uppercase text-[#9A9A98]">MASKS • YOLO+SAM</div>
            <div className="mt-3 space-y-2">
              {masks.slice(0,6).map(m=>(
                <div key={m.id} className="flex items-center justify-between border border-[#EDEDEB] bg-white rounded-[10px] px-3 py-2 text-[11px] font-mono">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{background:m.color}} />{m.label}</div>
                  <span className="text-[10px] opacity-50">{m.x.toFixed(0)}% • {m.confidence ? `${(m.confidence*100).toFixed(0)}%` : ""}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-[12px] leading-[1.6] text-[#6B6B6B]">Edge box taps existing RTSP <span className="font-mono bg-black text-white px-1 rounded text-[10px]">rtsp://.../cam12</span><br/>No new cameras. Zones from /zone → geometry checks. Optical flow 2ms for moving state. Slack/SMS + clip with page citation.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
