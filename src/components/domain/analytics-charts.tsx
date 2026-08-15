"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsPoint } from "@/lib/api/services/giving.service";

const tooltipStyle = {
  background: "#161616",
  border: "1px solid rgba(229,229,229,0.12)",
  borderRadius: 12,
  color: "#ededed",
  fontSize: 12,
};

export function AnalyticsBarChart({
  data,
  label = "Count",
}: {
  data: AnalyticsPoint[];
  label?: string;
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(229,229,229,0.08)" vertical={false} />
          <XAxis dataKey="label" stroke="#686868" fontSize={11} tickLine={false} />
          <YAxis stroke="#686868" fontSize={11} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="value" name={label} fill="#ededed" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AnalyticsLineChart({
  data,
  label = "Amount",
}: {
  data: AnalyticsPoint[];
  label?: string;
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(229,229,229,0.08)" vertical={false} />
          <XAxis dataKey="label" stroke="#686868" fontSize={11} tickLine={false} />
          <YAxis stroke="#686868" fontSize={11} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="value" name={label} stroke="#6b62f2" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
