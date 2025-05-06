
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useBonusContext } from '@/contexts/BonusContext';
import { Textarea } from "@/components/ui/textarea";
import { Badge } from '@/components/ui/badge';
import CsvImport from './CsvImport';
import { FileDown, Percent } from 'lucide-react';

const TeamMemberList: React.FC = () => {
  const { teamMembers, bonusPool, addTeamMember, updateTeamMember, removeTeamMember, autoAllocate, resetAllocations } = useBonusContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
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
    setIsDialogOpen(false);
  };
  
  const handleManualAllocation = (id: string, value: string) => {
    const numericValue = parseInt(value);
    if (isNaN(numericValue) || numericValue < 0) {
      // Clear the manual allocation if invalid
      updateTeamMember(id, { manualAllocation: undefined });
    } else {
      updateTeamMember(id, { manualAllocation: numericValue });
    }
  };

  // Function to calculate percentage and display it
  const getAllocationPercentage = (member: { actualAllocation: number; eligibleAmount: number }) => {
    if (member.eligibleAmount <= 0) return "0%";
    const percentage = (member.actualAllocation / member.eligibleAmount) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  // Function to export team member data to CSV
  const exportToCSV = () => {
    // Create CSV header
    const header = ['Name', 'Role', 'Eligible Amount', 'Actual Allocation', 'Allocation %', 'Notes'];
    
    // Create CSV data rows
    const rows = teamMembers.map(member => [
      member.name,
      member.role,
      member.eligibleAmount.toString(),
      member.actualAllocation.toString(),
      ((member.actualAllocation / member.eligibleAmount) * 100).toFixed(1),
      member.notes || ''
    ]);
    
    // Combine header and rows
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'team_bonus_allocation.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <div className="flex space-x-2">
            <Button 
              onClick={exportToCSV}
              variant="secondary" 
              size="sm"
              className="flex items-center gap-1"
            >
              <Export size={16} />
              Export
            </Button>
            <CsvImport />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm">Add Member</Button>
              </DialogTrigger>
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
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddMember}>Add Member</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b flex justify-between">
          <div className="flex gap-2">
            <Button onClick={autoAllocate} variant="outline" size="sm">
              Auto Allocate
            </Button>
            <Button onClick={resetAllocations} variant="destructive" size="sm">
              Reset All
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            {teamMembers.length} Team Members
          </div>
        </div>
        
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
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell className="text-right">${member.eligibleAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={member.manualAllocation !== undefined ? member.manualAllocation : ''}
                      onChange={(e) => handleManualAllocation(member.id, e.target.value)}
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
                      onClick={() => removeTeamMember(member.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
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
      </CardContent>
    </Card>
  );
};

export default TeamMemberList;
