"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatDate } from "@/lib/date";

interface LineProps {
  key: string;
  color: string;
  name: string;
}

interface ChartDataPoint {
  entryId: string;
  date: string;
  index: number;
  [key: string]: string | number;
}

interface LineChartPanelProps {
  data: ChartDataPoint[];
  lines: LineProps[];
  scale: number;
  title: string;
}

export function LineChartPanel({
  data,
  lines,
  scale,
  title,
}: LineChartPanelProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border p-4 my-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-4">
          {title}
        </h4>
        <div className="text-gray-400 text-sm text-center py-10">
          Pas assez de données
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-4 my-4">
      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-4">
        {title}
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="index"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, scale]}
            tick={{ fontSize: 12 }}
            label={{ value: "Note", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value) => (typeof value === "number" ? value.toFixed(2) : value)}
            labelFormatter={(date: string) => formatDate(date)}
            contentStyle={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
          />
          <Legend />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              dot={{ r: 4, fill: line.color }}
              name={line.name}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
