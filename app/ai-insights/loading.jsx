export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080810] text-white gap-6">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
        <div className="absolute inset-0 rounded-full border-t-2 border-violet-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-t-2 border-blue-400 animate-spin [animation-duration:0.75s]" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
          Analyzing your finances with AI...
        </h2>
        <p className="text-gray-500 text-sm">This usually takes a few seconds</p>
      </div>

      {/* Skeleton cards */}
      <div className="grid md:grid-cols-2 gap-4 w-full max-w-3xl px-6 mt-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-[1px] bg-gradient-to-br from-violet-900/40 to-blue-900/40"
          >
            <div className="bg-[#0d0d14] rounded-2xl p-5 flex gap-4 items-start animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-violet-900/40 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-2 bg-violet-900/40 rounded w-20" />
                <div className="h-3 bg-gray-800 rounded w-full" />
                <div className="h-3 bg-gray-800 rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
