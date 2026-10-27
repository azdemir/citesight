export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-[#111] antialiased">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-2xl border-b border-[#EDEDEB] h-[64px] flex items-center px-8 max-w-[800px] mx-auto"><a href="/" className="flex items-center gap-2"><div className="h-5 w-5 bg-black rounded-[5px] flex items-center justify-center"><div className="h-1.5 w-1.5 bg-[#FFD60A] rounded-[1px]" /></div><span className="font-[650] text-[15px]">CiteSight</span></a><span className="ml-3 text-[11px] text-[#9A9A98]">/ Terms</span></header>
      <div className="max-w-[720px] mx-auto px-8 pt-[96px] pb-[88px]">
        <h1 className="text-[48px] leading-[0.9] tracking-[-0.05em] font-[750]">Terms. Ranges,<br />not exact fake<br />price.</h1>
        <div className="mt-12 space-y-8 text-[15px] leading-[1.7] text-[#6B6B6B]">
          <p>CiteSight provides auditable video checks, not legal advice. Every alert cites a page, e.g., p87 §4.2, but you must verify with EHS. Ranges with owner confirmation, not exact fake price. Large/damaged jobs fallback to needs a visit.</p>
          <p>Price citation does not replace OSHA audit, but creates audit trail SHA-256. $0.35/hr vs $4.20/hr VLM baseline — holds up in production startup argument. Jetson edge box taps existing NVR RTSP, no new cameras.</p>
          <p>Free ChatGPT invents distance, no SAM masks, no homography pixel→meter, no page citation, no clip, no $0.35/hr, no OSHA audit trail. One prevented OSHA fine $15k + shutdown $50k pays for 20 years.</p>
        </div>
        <div className="mt-12 border border-black rounded-[16px] bg-[#111] text-white p-6 text-[13px] leading-[1.6]">Ranges + owner confirmation + needs_visit fallback keeps demo production-credible. Page citation p87 auditable, not legal advice. $0.35/hr vs $4.20/hr vs $100k/yr enterprise.</div>
        <div className="mt-16 flex gap-4 text-[13px]"><a href="/" className="h-10 px-5 rounded-full border border-[#EDEDEB] flex items-center hover:border-black">← Home</a><a href="/manifesto" className="h-10 px-5 rounded-full bg-black text-white flex items-center">Manifesto →</a></div>
      </div>
    </div>
  );
}
