"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { time: string; latency: number; status: number }[];
};

export default function LatencyChart({data }:Props) {
  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
          />
          <XAxis
            dataKey="time"
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            unit="ms"
          />
          <Tooltip
            contentStyle={{
              background: "#2a2a2a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              fontSize: "12px",
              color: "#fff",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.5)" }}
          />
          <Line
            type="monotone"
            dataKey="latency"
            stroke="#FF6C37"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#FF6C37" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
