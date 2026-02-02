"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { year: number; count: number }[];
};

export default function EvByYearChart({ data }: Props) {
  return (
    <div className="w-full h-80 bg-white rounded-xl p-4 shadow">
      <h2 className="text-lg font-semibold mb-4">EV Registrations by Year</h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
