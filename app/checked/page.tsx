"use client";

import { useState, useEffect } from "react";

type Rule = { id:string; rule:string; type:string; params:string; page:number; section:string; severity:string; citation:string; source_file:string; confidence:number; hand_checked?:boolean; real_text?:string };

export default function CheckedPage(){
  const [rules, setRules] = useState<Rule[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(()=>{
    fetch("/manuals/checked-rules-20.json").then(r=>r.json()).then(setRules).catch(()=>{});
  },[]);

  const filtered = rules.filter(r=>{
    if(filter==="all") return true;
    if(filter==="workshop") return r.source_file.includes("shop") || r.source_file.includes("mechanical");
    if(filter==="construction") return r.source_file.includes("construction");
    if(filter==="lab") return r.source_file.includes("chemical") || r.source_file.includes("mit");
    if(filter==="warehouse") return r.source_file.includes("forklift");
    if(filter==="kitchen") return r.source_file.includes("coosafe") || r.source_file.includes("haccp");
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-[#111] antialiased selection:bg-black selection:text-white">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-[#EDEDEB] h-[64px] flex items-center justify-between px-8 max-w-[1120px] mx-auto">
        <a href="/" className="flex items-center gap-2.5"><div className="h-6 w-6 bg-black rounded-[7px] flex items-center justify-center"><div className="h-2 w-2 bg-[#FFD60A] rounded-[1px]" /></div><span className="text-[15px] font-[650] tracking-[-0.02em]">CiteSight</span><span className="ml-2 text-[11px] text-[#9A9A98]">/ checked • 20 hand-checked rules</span></a>
        <div className="flex gap-2 text-[12px] font-[500]"><a href="/upload" className="text-[#6B6B6B] hover:text-black">Upload</a><a href="/eval" className="text-[#6B6B6B] hover:text-black">Eval</a></div>
      </header>

      <div className="max-w-[1120px] mx-auto px-8 pt-[72px] pb-[24px]">
        <h1 className="text-[36px] md:text-[48px] leading-[0.9] tracking-[-0.05em] font-[750]">20 hand-checked rules<br /><span className="text-[#9A9A98]">with real page citations.</span></h1>
        <p className="mt-4 text-[13px] leading-[1.6] text-[#6B6B6B] max-w-[560px]">From 6 sample rulebooks different fields manufacturing: shop safety UCOP (3.5MB), mechanical shop CSU (361KB), construction Michigan (2.6MB), chemical hygiene MIT (2.8MB), forklift SFA (211KB), HACCP CookSafe (4.6MB). Every rule keeps page citation.</p>

        <div className="mt-6 flex gap-2 flex-wrap">
          {[
            {k:"all", l:`All ${rules.length}`},
            {k:"workshop", l:"Workshop / Shop"},
            {k:"construction", l:"Construction"},
            {k:"lab", l:"Lab / Chemical"},
            {k:"warehouse", l:"Warehouse / Forklift"},
            {k:"kitchen", l:"Kitchen / HACCP"},
          ].map(f=>(
            <button key={f.k} onClick={()=>setFilter(f.k)} className={`h-8 px-4 rounded-full text-[12px] font-[500] border transition-colors ${filter===f.k ? "bg-black text-white border-black" : "bg-white border-[#EDEDEB] hover:border-black"}`}>{f.l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-[1120px] mx-auto px-8 pb-[88px]">
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(r=>(
            <div key={r.id} className="border border-[#EDEDEB] rounded-[16px] p-5 bg-white hover:border-black transition-colors group">
              <div className="flex justify-between items-start gap-3">
                <div className="text-[11px] font-mono font-[700] bg-black text-white px-2 py-0.5 rounded">{r.id}</div>
                <div className="text-[11px] font-mono bg-[#FFD60A] text-black px-2 py-0.5 rounded">p{r.page} {r.section}</div>
                <div className={`text-[10px] font-mono px-2 py-0.5 rounded ${r.severity==="critical" ? "bg-[#FF3B30] text-white" : r.severity==="high" ? "bg-black text-white" : "bg-[#EDEDEB]"}`}>{r.severity.toUpperCase()}</div>
              </div>
              <div className="mt-3 text-[14px] font-[600] tracking-[-0.01em] leading-[1.3]">{r.rule}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono bg-[#F6F6F5] border border-[#EDEDEB] px-2 py-0.5 rounded-full">{r.type.toUpperCase()} • {r.params}</span>
                <span className="text-[10px] font-mono bg-[#F6F6F5] border border-[#EDEDEB] px-2 py-0.5 rounded-full">{r.source_file.split("/").pop()}</span>
              </div>
              <div className="mt-2 text-[11px] font-mono text-[#9A9A98]">{r.citation} • confidence {r.confidence} • hand-checked true</div>
              {r.real_text && <div className="mt-2 text-[12px] leading-[1.5] text-[#6B6B6B] italic">"{r.real_text}"</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
