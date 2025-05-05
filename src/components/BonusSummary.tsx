
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useBonusContext } from '@/contexts/BonusContext';

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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-finance-secondary text-white">
        <CardTitle>Allocation Summary</CardTitle>
        <CardDescription className="text-finance-light opacity-80">
          Visual breakdown of your team bonus allocation
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `$${value.toLocaleString()}`} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No allocation data to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BonusSummary;
