
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Percent } from 'lucide-react';
import TeamMemberRow from './TeamMemberRow';
import { TeamMember } from '@/types/bonus';

interface TeamMembersTableProps {
  teamMembers: TeamMember[];
  onManualAllocation: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({ 
  teamMembers, 
  onManualAllocation, 
  onRemove 
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Eligible Amount</TableHead>
            <TableHead>Manual Override</TableHead>
            <TableHead className="text-right">Actual Allocation</TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Percent size={16} /> 
                <span>of Eligible</span>
              </div>
            </TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers.map((member) => (
            <TeamMemberRow 
              key={member.id}
              member={member}
              onManualAllocation={onManualAllocation}
              onRemove={onRemove}
            />
          ))}
          {teamMembers.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No team members added yet. Click "Add Member" to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamMembersTable;
