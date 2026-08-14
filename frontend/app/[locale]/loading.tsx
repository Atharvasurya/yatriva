export default function Loading() {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center p-6 sm:p-12 animate-in fade-in duration-100">
      {/* ── High-Speed Top Progress Loading Bar ──────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[99999] bg-amber-100/60 overflow-hidden shadow-xs">
        <div
          className="h-full w-full bg-gradient-to-r from-amber-400 via-saffron-500 to-orange-600 animate-[loaderProgress_0.8s_ease-in-out_infinite]"
          style={{ transformOrigin: '0% 50%' }}
        />
      </div>

      {/* ── Instant Micro Spinner & Brand Transition Card ───────────── */}
      <div className="flex flex-col items-center space-y-3.5 p-6 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xl max-w-xs w-full text-center">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-3 border-amber-200 border-t-amber-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-xs font-black uppercase tracking-widest text-slate-900 block">
            YATRIVA
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            Loading pilgrimage guide...
          </span>
        </div>
      </div>
    </div>
  );
}
