
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown } from 'lucide-react';
import CsvImport from '../CsvImport';
import { TeamMember } from '@/types/bonus';
import { DialogTrigger } from '@/components/ui/dialog';

interface TeamMemberActionsProps {
  onExport: () => void;
  onAutoAllocate: () => void;
  onResetAllocations: () => void;
  teamMembersCount: number;
}

const TeamMemberActions: React.FC<TeamMemberActionsProps> = ({
  onExport,
  onAutoAllocate,
  onResetAllocations,
  teamMembersCount
}) => {
  return (
    <div className="p-4 border-b flex justify-between">
      <div className="flex gap-2">
        <Button onClick={onAutoAllocate} variant="outline" size="sm">
          Auto Allocate
        </Button>
        <Button onClick={onResetAllocations} variant="destructive" size="sm">
          Reset All
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={onExport}
          variant="secondary" 
          size="sm"
          className="flex items-center gap-1"
        >
          <FileDown size={16} />
          Export
        </Button>
        <CsvImport />
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">Add Member</Button>
        </DialogTrigger>
        <div className="text-sm text-gray-500 ml-2">
          {teamMembersCount} Team Members
        </div>
      </div>
    </div>
  );
};

export default TeamMemberActions;
