
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBonusContext } from '@/contexts/BonusContext';

const BonusPoolCard: React.FC = () => {
  const { bonusPool } = useBonusContext();
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
              ${bonusPool.totalAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Remaining</p>
            <p className={`text-3xl font-bold ${bonusPool.remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
              ${bonusPool.remainingAmount.toLocaleString()}
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
          <div className="col-span-2 flex justify-between mt-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Strategy</p>
              <p className="text-base font-medium capitalize">{bonusPool.allocationStrategy}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Allocated</p>
              <p className="text-base font-medium">${bonusPool.allocatedAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BonusPoolCard;
