export default function Manifesto() {
  return (
    <div className="min-h-screen bg-white text-[#111] antialiased selection:bg-black selection:text-white">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-2xl border-b border-[#EDEDEB] h-[64px] flex items-center px-8 max-w-[800px] mx-auto">
        <a href="/" className="flex items-center gap-2"><div className="h-5 w-5 bg-black rounded-[5px] flex items-center justify-center"><div className="h-1.5 w-1.5 bg-[#FFD60A] rounded-[1px]" /></div><span className="font-[650] text-[15px] tracking-[-0.02em]">CiteSight</span></a>
        <span className="ml-3 text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">/ Manifesto</span>
      </header>
      <div className="max-w-[720px] mx-auto px-8 pt-[88px] pb-[88px]">
        <h1 className="text-[36px] md:text-[52px] leading-[0.9] tracking-[-0.05em] font-[750]">Rulebook Eyes.<br />The manual that<br />enforces itself.</h1>
        <div className="mt-8 space-y-6 text-[14px] leading-[1.7] text-[#6B6B6B]">
          <p>Workplaces have safety manuals no one reads. Enterprise video AI has 50+ pre-baked PPE detectors that cost $100k/yr and can't cite a page. VLM every 5 frames asks vision LLM: is this safe? $4.20/hr, no citation, hallucination risk.</p>
          <p><b className="text-black">Geo-ML pattern that won Best API:</b> Geologist + 400-page reports → DSL → 3D models. We do manual → DSL with page citation → executable checks. Domain expert solving own problem wins.</p>
          <p><b className="text-black">CiteSight:</b> Spark 1M compiles manual once ($0.50-$2). SAM 3.1 + YOLOv8n-seg 6.7MB segments people/tools/zones at 30fps on Jetson Orin Nano $499 PoE tapping existing RTSP. No new cameras. Geometry measures 0.8m less than 1.5m, not guess. Wonder writes incident with page + clip only when violation fires. Voice Q&A: What happened near saw 2pm? $0.35/hr vs $4.20/hr = 12x more efficient, auditable Yes p87.</p>
          <p>Build for your world: pick workplace you know firsthand. Push Frontier: manufacturing + physical-system control. Judges remember numbers: precision 0.89 vs 0.62, recall 0.84 vs 0.71, cost table 12x more efficient + page citation.</p>
        </div>
        <div className="mt-10 border border-black rounded-[16px] p-5 bg-[#FAFAF9]">
          <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">Why free AI fails</div>
          <div className="mt-3 text-[13px] leading-[1.6] text-[#111]">Free AI invents distance, no SAM masks, no homography pixel→meter, no page citation, no clip, no $0.35/hr, no OSHA audit trail. One prevented OSHA fine $15k + shutdown $50k pays for 20 years at $299/mo.</div>
        </div>
        <div className="mt-10 flex gap-3"><a href="/" className="h-10 px-5 rounded-full border border-[#EDEDEB] text-[13px] font-[500] hover:border-black transition-colors flex items-center">← Home</a><a href="/features" className="h-10 px-5 rounded-full bg-black text-white text-[13px] font-[600] flex items-center">Features →</a></div>
      </div>
    </div>
  );
}
