"use client";

import LatencyChart from "./components/LatencyChart";

export default function LandingPage() {

  const demo = [
    {
      timestamp:'12:04',
      latency: 300,
      status:200
    },
    {
      timestamp:'12:05',
      latency: 200,
      status:200
    },
    {
      timestamp:'12:05',
       latency: 600,
      status:200
    },
    {
      timestamp:'12:06',
       latency: 200,
      status:200
    }

  ]
    const DemoData =demo.map((h) => ({
    time: h.timestamp,
    latency: h.latency,
    status: h.status,
  }));
  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white font-mono overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#FF6C37] rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">PingPong</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-white/50">
          <a href="#" className="hover:text-white transition-colors">Docs</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a
            href="/dashboard"
            className="bg-[#FF6C37] text-white px-4 py-1.5 rounded text-xs hover:bg-[#e55a2a] transition-colors"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 relative">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/60 mb-8">
            <span className="w-1.5 h-1.5 bg-[#FF6C37] rounded-full animate-pulse" />
            Live API performance monitoring
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
            Know if your API is{" "}
            <span className="text-[#FF6C37]">fast</span> or{" "}
            <span className="text-white/30">broken</span>
          </h1>

          <p className="text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Paste any public API endpoint. Get instant latency, status codes,
            and a visual history — without the complexity of enterprise monitoring tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <a
              href="/dashboard"
              className="bg-[#FF6C37] text-white px-8 py-3 rounded text-sm font-semibold hover:bg-[#e55a2a] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Testing →
            </a>
            <a
              href="#how"
              className="text-white/50 text-sm hover:text-white transition-colors px-6 py-3"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* terminal preview */}
      <section className="max-w-2xl mx-auto px-6 mb-24">
        <div className="bg-[#252525] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#2a2a2a]">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            <span className="ml-4 text-white/30 text-xs">pingpong — ping</span>
          </div>
          <div className="p-6 text-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[#FF6C37]">GET</span>
              <span className="text-white/40">https://api.github.com/users/octocat</span>
            </div>
            <div className="border-t border-white/5 pt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-white/40">Status</span>
                <span className="text-[#28C840]">200 OK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Latency</span>
                <span className="text-white">342 ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Timestamp</span>
                <span className="text-white/60">just now</span>
              </div>
            </div>
            {/* Fake bar chart */}
            <div className="border-t border-white/5 pt-4">
              <p className="text-white/30 text-xs mb-3">Last 10 pings</p>
              <LatencyChart data={DemoData}/>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-4xl mx-auto px-6 pb-24">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-10 text-center">How it works</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Paste a URL", desc: "Any public REST API endpoint — GitHub, Stripe, your own backend." },
            { step: "02", title: "Hit Test", desc: "We ping it from our server, measure latency and grab the status code." },
            { step: "03", title: "See the history", desc: "Every result is saved. Watch performance over time with a live chart." },
          ].map((item) => (
            <div key={item.step} className="bg-[#252525] border border-white/10 rounded-lg p-6 hover:border-[#FF6C37]/30 transition-colors">
              <p className="text-[#FF6C37] text-xs mb-3 font-bold">{item.step}</p>
              <h3 className="text-white text-sm font-semibold mb-2">{item.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 flex items-center justify-between text-white/30 text-xs">
        <span>PingPong — built for devs</span>
        <span>Made with Next.js + Prisma</span>
      </footer>
    </main>
  );
}