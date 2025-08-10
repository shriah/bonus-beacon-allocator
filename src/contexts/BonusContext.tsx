
import React, { createContext, useState, useContext, useEffect } from 'react';
import { TeamMember, BonusPool } from '@/types/bonus';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

interface BonusContextType {
  bonusPool: BonusPool;
  teamMembers: TeamMember[];
  updateBonusPool: (newPool: Partial<BonusPool>) => void;
  updateBonusPercentage: (percentage: number) => void;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'actualAllocation'>) => void;
  addMultipleTeamMembers: (members: Array<Omit<TeamMember, 'id' | 'actualAllocation'>>) => void;
  replaceAllTeamMembers: (members: Array<Omit<TeamMember, 'id' | 'actualAllocation'>>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  removeTeamMember: (id: string) => void;
  autoAllocate: () => void;
  resetAllocations: () => void;
}

const BonusContext = createContext<BonusContextType | undefined>(undefined);

export const useBonusContext = () => {
  const context = useContext(BonusContext);
  if (context === undefined) {
    throw new Error('useBonusContext must be used within a BonusProvider');
  }
  return context;
};

export const BonusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  const [bonusPool, setBonusPool] = useState<BonusPool>({
    totalAmount: 0,
    allocationStrategy: 'equal',
    allocatedAmount: 0,
    remainingAmount: 0,
    percentageOfEligible: 10 // Default to 10%
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: uuidv4(),
      name: 'Alex Johnson',
      role: 'Senior Developer',
      eligibleAmount: 10000,
      actualAllocation: 0,
    },
    {
      id: uuidv4(),
      name: 'Jamie Smith',
      role: 'Product Manager',
      eligibleAmount: 12000,
      actualAllocation: 0,
    },
    {
      id: uuidv4(),
      name: 'Taylor Brown',
      role: 'Designer',
      eligibleAmount: 8000,
      actualAllocation: 0,
    },
  ]);

  // Calculate the total eligible amount and set bonus pool accordingly
  const calculateTotalEligibleAmount = () => {
    const totalEligible = teamMembers.reduce((sum, member) => sum + member.eligibleAmount, 0);
    const poolAmount = Math.round(totalEligible * bonusPool.percentageOfEligible / 100);
    
    setBonusPool(prev => ({
      ...prev,
      totalAmount: poolAmount
    }));
  };

  // Update bonus calculations whenever team members, pool or percentage changes
  useEffect(() => {
    calculateTotalEligibleAmount();
  }, [teamMembers, bonusPool.percentageOfEligible]);

  useEffect(() => {
    calculateBonusMetrics();
  }, [teamMembers, bonusPool.totalAmount, bonusPool.allocationStrategy]);

  const calculateBonusMetrics = () => {
    let allocatedTotal = 0;
    
    teamMembers.forEach(member => {
      allocatedTotal += member.actualAllocation;
    });
    
    setBonusPool(prev => ({
      ...prev,
      allocatedAmount: allocatedTotal,
      remainingAmount: prev.totalAmount - allocatedTotal
    }));
  };

  const updateBonusPool = (newPool: Partial<BonusPool>) => {
    setBonusPool(prev => ({ ...prev, ...newPool }));
    toast({
      title: "Bonus Pool Updated",
      description: "The bonus pool settings have been updated."
    });
  };

  // Specific method to update the percentage
  const updateBonusPercentage = (percentage: number) => {
    setBonusPool(prev => ({ ...prev, percentageOfEligible: percentage }));
    toast({
      title: "Bonus Percentage Updated",
      description: `Bonus pool is now ${percentage}% of eligible amounts.`
    });
  };

  const addTeamMember = (member: Omit<TeamMember, 'id' | 'actualAllocation'>) => {
    const newMember: TeamMember = {
      ...member,
      id: uuidv4(),
      actualAllocation: 0
    };

    setTeamMembers(prev => [...prev, newMember]);
    toast({
      title: "Team Member Added",
      description: `${member.name} has been added to the team.`
    });
  };

  // New method to add multiple team members at once (for CSV import)
  const addMultipleTeamMembers = (members: Array<Omit<TeamMember, 'id' | 'actualAllocation'>>) => {
    if (members.length === 0) return;

    const newMembers = members.map(member => ({
      ...member,
      id: uuidv4(),
      actualAllocation: 0
    }));

    setTeamMembers(prev => [...prev, ...newMembers]);
    toast({
      title: "Team Members Imported",
      description: `${members.length} team members have been imported.`
    });
  };

  // New method to replace all team members (for CSV import replacement)
  const replaceAllTeamMembers = (members: Array<Omit<TeamMember, 'id' | 'actualAllocation'>>) => {
    if (members.length === 0) return;

    const newMembers = members.map(member => ({
      ...member,
      id: uuidv4(),
      actualAllocation: 0
    }));

    setTeamMembers(newMembers);
    toast({
      title: "Team Members Replaced",
      description: `All existing data replaced with ${members.length} new team members.`
    });
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

  const removeTeamMember = (id: string) => {
    const memberToRemove = teamMembers.find(m => m.id === id);
    setTeamMembers(prev => prev.filter(member => member.id !== id));
    
    if (memberToRemove) {
      toast({
        title: "Team Member Removed",
        description: `${memberToRemove.name} has been removed from the team.`
      });
    }
  };

  const autoAllocate = () => {
    if (teamMembers.length === 0) {
      toast({
        title: "Cannot Allocate",
        description: "There are no team members to allocate bonuses to.",
        variant: "destructive"
      });
      return;
    }

    const strategy = bonusPool.allocationStrategy;
    const totalAmount = bonusPool.totalAmount;
    
    // First, identify members with manual allocations
    const membersWithManual = teamMembers.filter(m => m.manualAllocationPercentage !== undefined);
    const membersWithoutManual = teamMembers.filter(m => m.manualAllocationPercentage === undefined);
    
    // Calculate total amount already allocated manually (convert percentage to actual amount)
    const manuallyAllocated = membersWithManual.reduce(
      (sum, member) => sum + (member.eligibleAmount * (member.manualAllocationPercentage || 0) / 100), 
      0
    );
    
    // Calculate remaining amount available for distribution
    const remainingAmount = Math.max(0, totalAmount - manuallyAllocated);
    
    let newMembers: TeamMember[] = [];
    
    // First, copy over all manual allocations (convert percentage to actual amount)
    newMembers = membersWithManual.map(member => ({
      ...member,
      actualAllocation: Math.floor(member.eligibleAmount * (member.manualAllocationPercentage || 0) / 100)
    }));
    
    // If there are members without manual allocations, distribute remaining amount
    if (membersWithoutManual.length > 0) {
      // Decide distribution strategy for remaining amount
      if (strategy === 'equal') {
        // Equal distribution for non-manual members
        const perPersonAmount = remainingAmount / membersWithoutManual.length;
        const nonManualMembers = membersWithoutManual.map(member => ({
          ...member,
          actualAllocation: Math.floor(perPersonAmount)
        }));
        newMembers = [...newMembers, ...nonManualMembers];
        
      } else if (strategy === 'proportional') {
        // Proportional distribution based on eligible amount for non-manual members
        const totalEligible = membersWithoutManual.reduce(
          (sum, member) => sum + member.eligibleAmount, 
          0
        );
        
        // Avoid division by zero
        if (totalEligible > 0) {
          const nonManualMembers = membersWithoutManual.map(member => {
            const proportion = member.eligibleAmount / totalEligible;
            return {
              ...member,
              actualAllocation: Math.floor(remainingAmount * proportion)
            };
          });
          newMembers = [...newMembers, ...nonManualMembers];
        } else {
          // If total eligible is 0, distribute equally
          const perPersonAmount = remainingAmount / membersWithoutManual.length;
          const nonManualMembers = membersWithoutManual.map(member => ({
            ...member,
            actualAllocation: Math.floor(perPersonAmount)
          }));
          newMembers = [...newMembers, ...nonManualMembers];
        }
      } else {
        // Custom strategy - distribute remaining equally among non-manual members
        const perPersonRemaining = remainingAmount / membersWithoutManual.length;
        const nonManualMembers = membersWithoutManual.map(member => ({
          ...member,
          actualAllocation: Math.floor(perPersonRemaining)
        }));
        newMembers = [...newMembers, ...nonManualMembers];
      }
    }
    
    // Sort the team members to maintain the original order
    const memberIdMap = new Map(teamMembers.map((member, index) => [member.id, index]));
    newMembers.sort((a, b) => {
      return (memberIdMap.get(a.id) || 0) - (memberIdMap.get(b.id) || 0);
    });

    setTeamMembers(newMembers);
    toast({
      title: "Bonus Auto-Allocated",
      description: `Bonuses have been allocated using the ${strategy} strategy while preserving manual allocations.`
    });
  };

  const resetAllocations = () => {
    const newMembers = teamMembers.map(member => ({
      ...member,
      manualAllocationPercentage: undefined,
      actualAllocation: 0
    }));
    setTeamMembers(newMembers);
    toast({
      title: "Allocations Reset",
      description: "All bonus allocations have been reset."
    });
  };

  const value = {
    bonusPool,
    teamMembers,
    updateBonusPool,
    updateBonusPercentage,
    addTeamMember,
    addMultipleTeamMembers,
    replaceAllTeamMembers,
    updateTeamMember,
    removeTeamMember,
    autoAllocate,
    resetAllocations
  };

  return (
    <BonusContext.Provider value={value}>
      {children}
    </BonusContext.Provider>
  );
};
