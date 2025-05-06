
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
 
      </CardContent>
    </Card>
  );
};

export default BonusSummary;
