"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type PaperTypeChartProps = {
  data: { name: string; value: number; fill: string }[];
  title: string;
  description: string;
};

export function PaperTypeChart({ data, title, description }: PaperTypeChartProps) {
  return (
    <Card className="h-full">
       <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ 
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                if (percent * 100 < 5) return null;
                return (
                  <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" wrapperStyle={{paddingTop: '20px'}}/>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
