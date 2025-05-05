
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  eligibleAmount: number;
  manualAllocation?: number; // Optional manual override
  actualAllocation: number;
  notes?: string;
};

export type BonusPool = {
  totalAmount: number;
  allocationStrategy: 'equal' | 'proportional' | 'custom';
  allocatedAmount: number;
  remainingAmount: number;
  percentageOfEligible: number; // New field to store percentage
};
