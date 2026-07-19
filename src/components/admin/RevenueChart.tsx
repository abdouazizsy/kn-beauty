"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { MonthlyPoint } from "@/lib/data/stats";

export function RevenueChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b8912f" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#b8912f" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ecdac8" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#756259" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#756259" }} axisLine={false} tickLine={false} width={60} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #ecdac8", fontSize: 13 }}
          formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} FCFA`, "Revenu"]}
        />
        <Area type="monotone" dataKey="revenue" stroke="#b8912f" strokeWidth={2} fill="url(#revenueGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
