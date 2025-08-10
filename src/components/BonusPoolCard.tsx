
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBonusContext } from '@/contexts/BonusContext';
import { formatINR } from '@/lib/currency';

const BonusPoolCard: React.FC = () => {
  const { bonusPool, teamMembers } = useBonusContext();
  const totalEligibleAmount = teamMembers.reduce((sum, member) => sum + member.eligibleAmount, 0);
  const percentAllocated = bonusPool.totalAmount > 0 
    ? (bonusPool.allocatedAmount / bonusPool.totalAmount) * 100 
    : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-finance-primary text-white">
        <CardTitle className="text-2xl">Bonus Pool</CardTitle>
        <CardDescription className="text-finance-light opacity-80">
          Manage and track your team's total bonus allocation
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Budget</p>
            <p className="text-3xl font-bold text-finance-primary">
              {formatINR(bonusPool.totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Remaining</p>
            <p className={`text-3xl font-bold ${bonusPool.remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatINR(bonusPool.remainingAmount)}
            </p>
          </div>
          <div className="col-span-2 mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Allocation Progress</span>
              <span className="text-sm font-medium text-gray-700">{percentAllocated.toFixed(1)}%</span>
            </div>
            <Progress 
              value={percentAllocated} 
              className="h-2"
            />
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Eligible</p>
              <p className="text-lg font-bold text-gray-900">{formatINR(totalEligibleAmount)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Total Allocated</p>
              <p className="text-lg font-bold text-gray-900">{formatINR(bonusPool.allocatedAmount)}</p>
            </div>
          </div>
          <div className="col-span-2 flex justify-between mt-3 pt-3 border-t border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-500">Strategy</p>
              <p className="text-base font-medium capitalize">{bonusPool.allocationStrategy}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BonusPoolCard;
