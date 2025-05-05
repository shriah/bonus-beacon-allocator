
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBonusContext } from '@/contexts/BonusContext';

const BonusPoolSettings: React.FC = () => {
  const { bonusPool, updateBonusPool } = useBonusContext();
  const [amount, setAmount] = useState(bonusPool.totalAmount.toString());
  const [strategy, setStrategy] = useState<'equal' | 'proportional' | 'custom'>(bonusPool.allocationStrategy);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericAmount = parseInt(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return; // Should add proper validation
    }

    updateBonusPool({
      totalAmount: numericAmount,
      allocationStrategy: strategy
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-finance-secondary text-white">
        <CardTitle>Configure Bonus Pool</CardTitle>
        <CardDescription className="text-finance-light opacity-80">
          Set your total bonus budget and allocation strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Bonus Amount ($)</Label>
            <Input
              id="totalAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full"
              min="1"
            />
          </div>

          <div className="space-y-4">
            <Label>Allocation Strategy</Label>
            <RadioGroup defaultValue={strategy} onValueChange={(value: 'equal' | 'proportional' | 'custom') => setStrategy(value)}>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                <RadioGroupItem value="equal" id="equal" />
                <Label htmlFor="equal" className="cursor-pointer">
                  <div>
                    <p className="font-medium">Equal Distribution</p>
                    <p className="text-sm text-gray-500">Divide the bonus pool equally among all team members</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                <RadioGroupItem value="proportional" id="proportional" />
                <Label htmlFor="proportional" className="cursor-pointer">
                  <div>
                    <p className="font-medium">Proportional to Eligible Amount</p>
                    <p className="text-sm text-gray-500">Allocate based on each member's eligible bonus amount</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="cursor-pointer">
                  <div>
                    <p className="font-medium">Custom Allocation</p>
                    <p className="text-sm text-gray-500">Manual allocations are preserved, remaining amount is distributed equally</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full bg-finance-secondary hover:bg-finance-dark">
            Update Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BonusPoolSettings;
