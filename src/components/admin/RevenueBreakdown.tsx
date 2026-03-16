/**
 * @fileoverview RevenueBreakdown — Visual representation of income sources for admins.
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CourseRevenue } from "@/hooks/useAdminStats"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

export function RevenueBreakdown({ data }: { data: CourseRevenue[] }) {
  const chartData = data.map(d => ({ name: d.title, value: d.revenue }))

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm border-b-2 border-b-primary/50 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-black">Revenue Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[350px] w-full mt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px" }}
                  itemStyle={{ color: "#fff", fontWeight: "bold" }}
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground italic opacity-40">
              Insufficient data for breakdown
            </div>
          )}
        </div>
        
        {/* Table list view for clarity */}
        <div className="px-6 pb-6 pt-2 space-y-3">
           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Detailed Catalog Performance</p>
           {data.sort((a,b) => b.revenue - a.revenue).map((item, i) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="font-medium line-clamp-1 max-w-[200px]">{item.title}</span>
                 </div>
                 <span className="font-black">₹{item.revenue.toLocaleString()}</span>
              </div>
           ))}
        </div>
      </CardContent>
    </Card>
  )
}
