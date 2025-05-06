
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { useBonusContext } from '@/contexts/BonusContext';
import TeamMembersTable from './team-members/TeamMembersTable';
import TeamMemberActions from './team-members/TeamMemberActions';
import AddTeamMemberDialog from './team-members/AddTeamMemberDialog';
import { exportTeamMembersToCSV } from './team-members/exportUtils';

const TeamMemberList: React.FC = () => {
  const { teamMembers, updateTeamMember, removeTeamMember, autoAllocate, resetAllocations } = useBonusContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleManualAllocation = (id: string, value: string) => {
    const numericValue = parseInt(value);
    if (isNaN(numericValue) || numericValue < 0) {
      // Clear the manual allocation if invalid
      updateTeamMember(id, { manualAllocation: undefined });
    } else {
      updateTeamMember(id, { manualAllocation: numericValue });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-finance-primary text-white">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription className="text-finance-light opacity-80">
              Manage team members and their bonus allocations
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Dialog>
          <TeamMemberActions 
            onExport={() => exportTeamMembersToCSV(teamMembers)} 
            onAutoAllocate={autoAllocate}
            onResetAllocations={resetAllocations}
            teamMembersCount={teamMembers.length}
          />
          
          <TeamMembersTable 
            teamMembers={teamMembers}
            onManualAllocation={handleManualAllocation}
            onRemove={removeTeamMember}
          />
          
          <AddTeamMemberDialog 
            isOpen={isDialogOpen} 
            setIsOpen={setIsDialogOpen}
          />
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TeamMemberList;
