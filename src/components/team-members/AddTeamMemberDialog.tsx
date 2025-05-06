
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBonusContext } from '@/contexts/BonusContext';

type NewTeamMember = {
  name: string;
  role: string;
  eligibleAmount: number;
};

interface AddTeamMemberDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AddTeamMemberDialog: React.FC<AddTeamMemberDialogProps> = ({ isOpen, setIsOpen }) => {
  const { addTeamMember } = useBonusContext();
  const [newMember, setNewMember] = useState<NewTeamMember>({
    name: '',
    role: '',
    eligibleAmount: 0
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.role || newMember.eligibleAmount <= 0) {
      return; // Should add proper validation
    }
    
    addTeamMember(newMember);
    setNewMember({ name: '', role: '', eligibleAmount: 0 });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a new team member to allocate bonus to.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input 
              id="name" 
              value={newMember.name}
              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Role</Label>
            <Input 
              id="role" 
              value={newMember.role}
              onChange={(e) => setNewMember({...newMember, role: e.target.value})}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="eligibleAmount" className="text-right">Eligible Amount ($)</Label>
            <Input 
              id="eligibleAmount" 
              type="number"
              value={newMember.eligibleAmount || ''}
              onChange={(e) => setNewMember({...newMember, eligibleAmount: parseInt(e.target.value) || 0})}
              className="col-span-3" 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMember}>Add Member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMemberDialog;
