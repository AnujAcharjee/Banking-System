export default function PassbookLoading() {
  return (
    <div className="flex h-screen bg-[#fffbf7] overflow-hidden">
      <div className="hidden lg:flex w-64 bg-white border-r border-orange-100 flex-col p-6 gap-4 animate-pulse">
        <div className="h-10 bg-rose-bud/20 rounded-xl shimmer" />
        <div className="h-16 bg-rose-bud/10 rounded-xl shimmer mt-2" />
        <div className="space-y-2 mt-4">
          {[1,2,3].map(i => <div key={i} className="h-10 bg-rose-bud/10 rounded-xl shimmer" />)}
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 bg-white border-b border-orange-100 shimmer" />
        <div className="flex-1 p-6 space-y-6 overflow-hidden max-w-4xl mx-auto w-full">
          <div className="h-12 bg-rose-bud/20 rounded-xl shimmer w-48" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-rose-bud/10 rounded-2xl shimmer" />)}
          </div>
          <div className="h-16 bg-rose-bud/10 rounded-2xl shimmer" />
          <div className="space-y-3">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-16 bg-rose-bud/10 rounded-xl shimmer" />)}
          </div>
        </div>
      </div>
    </div>
  )
}
