export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffbf7]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 flamingo-gradient rounded-2xl flex items-center justify-center shadow-glow animate-pulse">
          <span className="text-white font-bold text-2xl font-display">N</span>
        </div>
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <p className="text-dusty-gray/80 text-sm">Loading NovaBank…</p>
      </div>
    </div>
  )
}
