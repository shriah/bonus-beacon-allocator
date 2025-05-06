
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '@/types/bonus';

interface TeamMemberRowProps {
  member: TeamMember;
  onManualAllocation: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}

const TeamMemberRow: React.FC<TeamMemberRowProps> = ({ 
  member, 
  onManualAllocation, 
  onRemove 
}) => {
  // Function to calculate percentage and display it
  const getAllocationPercentage = (member: { actualAllocation: number; eligibleAmount: number }) => {
    if (member.eligibleAmount <= 0) return "0%";
    const percentage = (member.actualAllocation / member.eligibleAmount) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <TableRow key={member.id}>
      <TableCell className="font-medium">{member.name}</TableCell>
      <TableCell>{member.role}</TableCell>
      <TableCell className="text-right">${member.eligibleAmount.toLocaleString()}</TableCell>
      <TableCell>
        <Input 
          type="number"
          value={member.manualAllocation !== undefined ? member.manualAllocation : ''}
          onChange={(e) => onManualAllocation(member.id, e.target.value)}
          className="w-24"
          placeholder="Auto"
        />
      </TableCell>
      <TableCell className="text-right font-medium">
        ${member.actualAllocation.toLocaleString()}
        {member.manualAllocation !== undefined && (
          <Badge variant="outline" className="ml-2 bg-orange-100 text-orange-800 border-orange-200">
            Manual
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        {getAllocationPercentage(member)}
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onRemove(member.id)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TeamMemberRow;
