
"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type PapersByYearChartProps = {
  data: { name: string; total: number }[];
  height?: number;
};

export function PapersByYearChart({ data, height = 350 }: PapersByYearChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          contentStyle={{ 
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
        />
        <Line 
          type="monotone" 
          dataKey="total" 
          stroke="hsl(var(--chart-1))" 
          strokeWidth={2}
          dot={{ r: 4, fill: "hsl(var(--chart-1))", stroke: 'hsl(var(--background))' }}
          activeDot={{ r: 6, fill: "hsl(var(--chart-1))", stroke: 'hsl(var(--background))' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
