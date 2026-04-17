"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LatencyChart from "../components/LatencyChart";

// Types
type PingResult = {
  url: string;
  status: number; 
  latency: number; // response time in milliseconds
};

type HistoryItem = {
  id: number;
  url: string;
  status: number;
  latency: number;
  timestamp: string; // ISO string from DB
};


// Returns a Tailwind text color based on HTTP status code
function statusColor(status: number) {
  if (status >= 200 && status < 300) return "text-[#28C840]"; // green  = success
  if (status >= 400) return "text-[#FF5F57]";                  // red    = error
  return "text-[#FEBC2E]";                                     // yellow = redirect / other
}

// Returns a Tailwind text color based on how fast the response was
function latencyColor(ms: number) {
  if (ms < 300) return "text-[#28C840]";  // green  = fast
  if (ms < 700) return "text-[#FEBC2E]"; // yellow = acceptable
  return "text-[#FF5F57]";               // red    = slow
}


export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pre-fill URL input if ?url= is in the query string (set after a ping)
  const [url, setUrl] = useState(searchParams.get("url") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PingResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Format history for the LatencyChart component
const chartData = [...history].reverse().map((h) => ({
  time: new Date(h.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  latency: h.latency,
  status: h.status,
}))
  // ping the URL
  async function handleTest() {
    if (!url || loading) return;

    try {
      setLoading(true);

      // 1. Hit your Next.js API route — it pings the URL and saves to DB
      const res = await fetch("/api/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setResult(data); // show latest result in the response card

      // 2. Fetch this URL's ping history from DB for the sidebar + chart
      const historyRes = await fetch(`/api/history?url=${encodeURIComponent(url)}`);
      const historyData = await historyRes.json();
      setHistory(historyData);

      // 3. Update the URL in the browser so the page is refreshable
      router.push(`/dashboard?url=${encodeURIComponent(url)}`);
    } catch (err) {
      console.error("Ping failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white font-mono">

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#FF6C37] rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">PingPong</span>
        </Link>
        <span className="text-white/30 text-xs">Dashboard</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="flex items-center mb-10 bg-[#252525] border border-white/10 rounded-lg overflow-hidden focus-within:border-[#FF6C37]/50 transition-colors">
          <div className="flex items-center px-4 border-r border-white/10">
            <span className="text-[#FF6C37] text-xs font-bold">GET</span>
          </div>
          {/* url input */}
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTest()}
            placeholder="https://api.github.com/users/octocat"
            className="flex-1 bg-transparent px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none"
          />
          <button
            onClick={handleTest}
            disabled={loading || !url}
            className="bg-[#FF6C37] text-white px-6 py-3.5 text-xs font-bold cursor-pointer hover:bg-[#e55a2a] rounded-r-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Testing..." : "Send"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/*Results*/}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#252525] border border-white/10 rounded-lg overflow-hidden">

              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#2a2a2a]">
                <span className="text-white/50 text-xs">Response</span>
                {result && <span className="text-white/30 text-xs truncate ml-4">{url}</span>}
              </div>

              <div className="p-6">
                {!result ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white/20 text-lg">⚡</span>
                    </div>
                    <p className="text-white/30 text-sm">Paste a URL and hit Send</p>
                    <p className="text-white/20 text-xs mt-1">Results will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">

                    {/* Status + Latency stat boxes */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#1a1a1a] rounded-lg p-4">
                        <p className="text-white/40 text-xs mb-1">Status</p>
                        <p className={`text-2xl font-bold ${statusColor(result.status)}`}>
                          {result.status}
                        </p>
                      </div>
                      <div className="bg-[#1a1a1a] rounded-lg p-4">
                        <p className="text-white/40 text-xs mb-1">Latency</p>
                        <p className={`text-2xl font-bold ${latencyColor(result.latency)}`}>
                          {result.latency}
                          <span className="text-sm font-normal text-white/40 ml-1">ms</span>
                        </p>
                      </div>
                    </div>

                    {/* Mini chart — shows last 10 pings after each test */}
                    <div className="bg-[#1a1a1a] rounded-lg p-4">
                      <p className="text-white/40 text-xs mb-3">Last 10 pings — latency (ms)</p>
                      <LatencyChart data={chartData.slice(-10)} />
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>

          {/*Ping history sidebar */}
          <div className="bg-[#252525] border border-white/10 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#2a2a2a]">
              <span className="text-white/50 text-xs">Recent Pings</span>
              {/* Shows how many pings are loaded out of max 10 */}
              <span className="text-white/30 text-xs">{Math.min(history.length, 10)}/10</span>
            </div>

            <div className="divide-y divide-white/5">
              {history.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-white/20 text-xs">No pings yet</p>
                </div>
              ) : (
                // Show last 10 pings, most recent first
                history
                  .slice(-10).map((item) => (
                    <div key={item.id} className="px-5 py-3 hover:bg-white/5 transition-colors">
                      <p className="text-white/50 text-xs truncate mb-1">{item.url}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${statusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className={`text-xs ${latencyColor(item.latency)}`}>
                          {item.latency}ms
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* "View full history" link — only shown when there's data */}
            {history.length > 0 && (
              <div className="px-5 py-3 border-t border-white/10">
                <Link
                  href={`/monitor?url=${encodeURIComponent(url)}`}
                  className="w-full text-center text-xs text-[#FF6C37] hover:text-white transition-colors block"
                >
                  View full history →
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}