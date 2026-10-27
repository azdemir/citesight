export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-[#111] antialiased selection:bg-black selection:text-white">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-2xl border-b border-[#EDEDEB] h-[64px] flex items-center px-8 max-w-[800px] mx-auto">
        <a href="/" className="flex items-center gap-2"><div className="h-5 w-5 bg-black rounded-[5px] flex items-center justify-center"><div className="h-1.5 w-1.5 bg-[#FFD60A] rounded-[1px]" /></div><span className="font-[650] text-[15px] tracking-[-0.02em]">CiteSight</span></a>
        <span className="ml-3 text-[11px] font-mono uppercase tracking-[0.08em] text-[#9A9A98]">/ Terms</span>
      </header>
      <div className="max-w-[720px] mx-auto px-8 pt-[88px] pb-[88px]">
        <h1 className="text-[36px] md:text-[52px] leading-[0.9] tracking-[-0.05em] font-[750]">Terms. Ranges,<br />not exact fake<br />price.</h1>
        <div className="mt-8 space-y-6 text-[14px] leading-[1.7] text-[#6B6B6B]">
          <p>CiteSight provides auditable video checks, not legal advice. Every alert cites a page, e.g., p87 §4.2, but you must verify with EHS. Ranges with owner confirmation, not exact fake price. Large/damaged jobs fallback to needs a visit.</p>
          <p>Price citation does not replace OSHA audit, but creates audit trail SHA-256. $0.35/hr vs $4.20/hr VLM vs $270/hr SAM 3.1 per frame impossible — holds up in production startup argument. Jetson edge box taps existing NVR RTSP, no new cameras.</p>
          <p>Free AI invents distance, no SAM masks, no homography pixel→meter, no page citation, no clip, no $0.35/hr, no OSHA audit trail. One prevented OSHA fine $15k + shutdown $50k pays for 20 years.</p>
        </div>
        <div className="mt-10 border border-black rounded-[16px] bg-[#111] text-white p-5 text-[12px] leading-[1.6]">Ranges + owner confirmation + needs_visit fallback keeps demo production-credible. Page citation p87 auditable, not legal advice. $0.35/hr vs $4.20/hr 12x more efficient vs $270/hr SAM 3.1 per frame impossible.</div>
        <div className="mt-10 flex gap-3"><a href="/" className="h-10 px-5 rounded-full border border-[#EDEDEB] text-[13px] font-[500] hover:border-black transition-colors flex items-center">← Home</a><a href="/manifesto" className="h-10 px-5 rounded-full bg-black text-white text-[13px] font-[600] flex items-center">Manifesto →</a></div>
      </div>
    </div>
  );
}
