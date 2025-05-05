
import React, { createContext, useState, useContext, useEffect } from 'react';
import { TeamMember, BonusPool } from '@/types/bonus';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

interface BonusContextType {
  bonusPool: BonusPool;
  teamMembers: TeamMember[];
  updateBonusPool: (newPool: Partial<BonusPool>) => void;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'actualAllocation'>) => void;
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
    totalAmount: 100000,
    allocationStrategy: 'equal',
    allocatedAmount: 0,
    remainingAmount: 100000
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

  // Update bonus calculations whenever team members or pool changes
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
    let newMembers: TeamMember[] = [];

    if (strategy === 'equal') {
      // Equal distribution
      const perPersonAmount = totalAmount / teamMembers.length;
      newMembers = teamMembers.map(member => ({
        ...member,
        actualAllocation: member.manualAllocation !== undefined ? 
          member.manualAllocation : Math.floor(perPersonAmount)
      }));
    } else if (strategy === 'proportional') {
      // Proportional to eligible amounts
      const totalEligible = teamMembers.reduce((sum, member) => sum + member.eligibleAmount, 0);
      newMembers = teamMembers.map(member => {
        const proportion = member.eligibleAmount / totalEligible;
        return {
          ...member,
          actualAllocation: member.manualAllocation !== undefined ? 
            member.manualAllocation : Math.floor(totalAmount * proportion)
        };
      });
    } else if (strategy === 'custom') {
      // Respect manual allocations, distribute remaining equally
      const membersWithManual = teamMembers.filter(m => m.manualAllocation !== undefined);
      const membersWithoutManual = teamMembers.filter(m => m.manualAllocation === undefined);
      
      const allocatedToManual = membersWithManual.reduce((sum, m) => sum + (m.manualAllocation || 0), 0);
      const remaining = Math.max(0, totalAmount - allocatedToManual);
      
      if (membersWithoutManual.length > 0) {
        const perPersonRemaining = remaining / membersWithoutManual.length;
        
        newMembers = teamMembers.map(member => {
          if (member.manualAllocation !== undefined) {
            return { ...member, actualAllocation: member.manualAllocation };
          } else {
            return { ...member, actualAllocation: Math.floor(perPersonRemaining) };
          }
        });
      } else {
        // All members have manual allocations
        newMembers = teamMembers.map(member => ({
          ...member,
          actualAllocation: member.manualAllocation || 0
        }));
      }
    }

    setTeamMembers(newMembers);
    toast({
      title: "Bonus Auto-Allocated",
      description: `Bonuses have been allocated using the ${strategy} strategy.`
    });
  };

  const resetAllocations = () => {
    const newMembers = teamMembers.map(member => ({
      ...member,
      manualAllocation: undefined,
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
    addTeamMember,
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
