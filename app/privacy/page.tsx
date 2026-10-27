export default function Privacy() {
  return (
    <div className="min-h-screen bg-white text-[#111] antialiased selection:bg-black selection:text-white">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-2xl border-b border-[#EDEDEB] h-[64px] flex items-center px-8 max-w-[800px] mx-auto">
        <a href="/" className="flex items-center gap-2"><div className="h-5 w-5 bg-black rounded-[5px] flex items-center justify-center"><div className="h-1.5 w-1.5 bg-[#FFD60A] rounded-[1px]" /></div><span className="font-[650] text-[15px] tracking-[-0.02em]">CiteSight</span></a>
        <span className="ml-3 text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">/ Privacy</span>
      </header>
      <div className="max-w-[720px] mx-auto px-8 pt-[88px] pb-[88px]">
        <h1 className="text-[36px] md:text-[52px] leading-[0.9] tracking-[-0.05em] font-[750]">Privacy. Faces<br />blurred, clips<br />only on violation.</h1>
        <div className="mt-8 space-y-6 text-[14px] leading-[1.7] text-[#6B6B6B]">
          <p>SAM person mask → blur. No face stored. Photos auto-delete in 7 days (30 min baseline). RLS company_id on storage. No training on your manual.</p>
          <p>Edge box Jetson processes on-prem, RTSP stays on-prem, no cloud egress needed. Clips only saved when violation fires, 5 sec, S3 with page citation p87, not 24/7 video.</p>
          <p>You own your rulebook DSL. Every alert cites page + clip + SLA, not black-box VLM guess. Holds up in production startup argument.</p>
        </div>
        <div className="mt-10 border border-[#EDEDEB] rounded-[16px] bg-[#FAFAF9] p-5 text-[11px] font-mono leading-[1.6] tracking-[0.02em]">SAM person mask → blur • RLS • auto-delete 7d • Edge Jetson • No training • Clip only on violation • $0.35/hr vs $4.20/hr 12x more efficient • p87 auditable</div>
        <div className="mt-10 flex gap-3"><a href="/" className="h-10 px-5 rounded-full border border-[#EDEDEB] text-[13px] font-[500] hover:border-black transition-colors flex items-center">← Home</a><a href="/features" className="h-10 px-5 rounded-full bg-black text-white text-[13px] font-[600] flex items-center">Features →</a></div>
      </div>
    </div>
  );
}
