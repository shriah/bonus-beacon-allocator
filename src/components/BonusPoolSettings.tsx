
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useBonusContext } from '@/contexts/BonusContext';
import { formatINR } from '@/lib/currency';

const BonusPoolSettings: React.FC = () => {
  const { bonusPool, updateBonusPool, updateBonusPercentage } = useBonusContext();
  const [strategy, setStrategy] = useState<'equal' | 'proportional' | 'custom'>(bonusPool.allocationStrategy);
  const [percentage, setPercentage] = useState(bonusPool.percentageOfEligible);
  
  // Update local percentage state when bonusPool changes externally
  useEffect(() => {
    setPercentage(bonusPool.percentageOfEligible);
  }, [bonusPool.percentageOfEligible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateBonusPool({
      allocationStrategy: strategy
    });
    
    updateBonusPercentage(percentage);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-finance-secondary text-white">
        <CardTitle>Configure Bonus Pool</CardTitle>
        <CardDescription className="text-finance-light opacity-80">
          Set your bonus pool percentage and allocation strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <Label>Bonus Pool Size (% of Total Eligible Amount)</Label>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{percentage}%</span>
                <span className="text-sm text-gray-500">
                  {formatINR(bonusPool.totalAmount)}
                </span>
              </div>
              <Slider 
                value={[percentage]} 
                min={1} 
                max={100} 
                step={1} 
                onValueChange={(values) => setPercentage(values[0])}
              />
              <p className="text-xs text-gray-500">
                Bonus pool will be {percentage}% of the total eligible amount ({formatINR(bonusPool.totalAmount)})
              </p>
            </div>
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
