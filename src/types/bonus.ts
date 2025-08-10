
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  eligibleAmount: number;
  manualAllocationPercentage?: number; // Optional manual override as percentage of eligible amount
  actualAllocation: number;
  allocationPercentage?: number; // Percentage of allocation relative to eligible amount
  notes?: string;
};

export type BonusPool = {
  totalAmount: number;
  allocationStrategy: 'equal' | 'proportional' | 'custom';
  allocatedAmount: number;
  remainingAmount: number;
  percentageOfEligible: number; // New field to store percentage
};
