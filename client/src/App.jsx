function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-6xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-12 drop-shadow-2xl">
          TrackStack 🐛
        </h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="group bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>Frontend
            </h2>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>React 19 ✓</li>
              <li>dnd-kit ✓</li>
              <li>Tailwind ✓</li>
              <li>React Query ✓</li>
            </ul>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xl font-semibold text-white mb-6">Day 1 Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Client</span>
                <span className="text-green-400 font-semibold">100% ✅</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default App
