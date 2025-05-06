
import { TeamMember } from '@/types/bonus';

export const exportTeamMembersToCSV = (teamMembers: TeamMember[]) => {
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
