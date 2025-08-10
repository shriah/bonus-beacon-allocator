
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useBonusContext } from '@/contexts/BonusContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChartBarBig } from "lucide-react";
import { formatINR } from '@/lib/currency';

const BonusSummary: React.FC = () => {
  const { teamMembers, bonusPool } = useBonusContext();
  
  const chartData = teamMembers.map(member => ({
    name: member.name,
    value: member.actualAllocation
  }));
  
  // Add remaining amount if there is any
  if (bonusPool.remainingAmount > 0) {
    chartData.push({
      name: 'Unallocated',
      value: bonusPool.remainingAmount
    });
  }

  // Sort data descending by value for better visualization
  chartData.sort((a, b) => b.value - a.value);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  // Determine if we need to scroll (more than 7 items)
  const needsScroll = chartData.length > 7;
  
  // Calculate dynamic height based on number of items (min 300px, 50px per item)
  const chartHeight = Math.max(300, chartData.length * 50);

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-finance-secondary text-white">
        <div className="flex items-center gap-2">
          <ChartBarBig size={20} />
          <CardTitle>Allocation Summary</CardTitle>
        </div>
        <CardDescription className="text-finance-light opacity-80">
          Visual breakdown of your team bonus allocation
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {chartData.length > 0 ? (
          <ScrollArea className={needsScroll ? "h-[400px]" : "h-auto"}>
            <div style={{ height: `${chartHeight}px`, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 80,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(value) => formatINR(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatINR(value), 'Allocation']}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" barSize={20}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            No allocations to display
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BonusSummary;
