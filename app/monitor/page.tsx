"use client";

import { useState, useEffect } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LatencyChart from "../components/LatencyChart";

// Type of each ping record from the database
type HistoryItem = {
  id: number;
  url: string;
  status: number;
  latency: number;
  timestamp: string;
};
export default function MonitorPage() {
  return (
    <Suspense fallback={<div>Loading monitor...</div>}>
      <MonitorContent />
    </Suspense>
  );
}
function MonitorContent() {
  // Read the ?url= query param from the browser address bar
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";

  // State to hold all ping history for this URL
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch ping history when the page loads or URL changes
  useEffect(() => {
    fetch(`/api/history?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      });
  }, [url]);

  // returns a Tailwind color class based on HTTP status code
  const statusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-[#28C840]"; // green = success
    if (status >= 400) return "text-[#FF5F57]";                 // red = error
    return "text-[#FEBC2E]";                                     // yellow = redirect
  };

  // Calculate summary stats from the full history
  const avgLatency = history.length
    ? Math.round(history.reduce((a, b) => a + b.latency, 0) / history.length)
    : 0;
  const maxLatency = history.length ? Math.max(...history.map((h) => h.latency)) : 0;
  const minLatency = history.length ? Math.min(...history.map((h) => h.latency)) : 0;

  // Uptime = percentage of pings that returned a non-error status
  const uptime = history.length
    ? Math.round((history.filter((h) => h.status < 400).length / history.length) * 100)
    : 0;

  // Format history into the shape Recharts 
  const chartData = [...history].reverse().map((h) => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    latency: h.latency,
    status: h.status,
  }));

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white font-mono">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#FF6C37] rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">PingPong</span>
        </Link>
        <Link href="/dashboard" className="text-xs text-white/40 hover:text-white transition-colors">
          ← Dashboard
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Page header — shows which URL is being monitored */}
        <div className="mb-8">
          <p className="text-white/30 text-xs mb-1">Monitoring</p>
          <h1 className="text-white text-lg font-semibold truncate">{url || "No URL selected"}</h1>
        </div>

        {/* Summary stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Avg Latency", value: `${avgLatency}ms`, color: "text-white" },
            { label: "Min Latency", value: `${minLatency}ms`, color: "text-[#28C840]" },
            { label: "Max Latency", value: `${maxLatency}ms`, color: "text-[#FF5F57]" },
            { label: "Uptime", value: `${uptime}%`, color: uptime > 90 ? "text-[#28C840]" : "text-[#FF5F57]" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#252525] border border-white/10 rounded-lg p-5">
              <p className="text-white/40 text-xs mb-2">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Latency line chart  */}
        <div className="bg-[#252525] border border-white/10 rounded-lg overflow-hidden mb-6">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#2a2a2a]">
            <span className="text-white/50 text-xs">Latency over time</span>
            <span className="text-white/30 text-xs">{history.length} pings</span>
          </div>
          <div className="p-6">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-white/20 text-sm">No data yet</p>
                <p className="text-white/10 text-xs mt-1">Go to dashboard and run some tests</p>
              </div>
            ) : (
              <LatencyChart data={chartData} />
            )}
          </div>
        </div>

        {/* Full ping history table — newest first */}
        <div className="bg-[#252525] border border-white/10 rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-white/10 bg-[#2a2a2a]">
            <span className="text-white/50 text-xs">All pings</span>
          </div>
          <div className="divide-y divide-white/5">
            {history.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-white/20 text-xs">No history yet</p>
              </div>
            ) : (
              [...history].map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <span className="text-white/30 text-xs">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                  <div className="flex items-center gap-6">
                    <span className={`text-xs font-bold ${statusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="text-white/60 text-xs w-16 text-right">
                      {item.latency}ms
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}