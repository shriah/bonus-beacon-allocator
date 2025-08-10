
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useBonusContext } from '@/contexts/BonusContext';
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Import } from "lucide-react";

const CsvImport: React.FC = () => {
  const { replaceAllTeamMembers } = useBonusContext();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCSV = (text: string) => {
    try {
      const lines = text.split('\n');
      if (lines.length < 2) {
        setError("CSV file appears to be empty or invalid");
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Validate headers
      const requiredHeaders = ['name', 'role', 'eligibleamount'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setError(`Missing required headers: ${missingHeaders.join(', ')}`);
        return;
      }

      // Get indices of required columns
      const nameIndex = headers.indexOf('name');
      const roleIndex = headers.indexOf('role');
      const eligibleAmountIndex = headers.indexOf('eligibleamount');
      const notesIndex = headers.indexOf('notes'); // Optional

      // Parse data rows
      const members = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines
        
        const values = line.split(',');
        if (values.length < 3) continue; // Skip incomplete lines
        
        const name = values[nameIndex]?.trim();
        const role = values[roleIndex]?.trim();
        const eligibleAmountStr = values[eligibleAmountIndex]?.trim();
        
        // Validate required fields
        if (!name || !role || !eligibleAmountStr) {
          continue;
        }
        
        // Parse eligible amount as a number (handle currency symbols and commas)
        const cleanAmountStr = eligibleAmountStr.replace(/[$,\s]/g, '');
        const eligibleAmount = parseFloat(cleanAmountStr);
        if (isNaN(eligibleAmount) || eligibleAmount < 0) {
          continue;
        }
        
        // Add notes if available
        const notes = notesIndex >= 0 && values[notesIndex] ? values[notesIndex].trim() : undefined;
        
        members.push({
          name,
          role,
          eligibleAmount,
          notes
        });
      }

      if (members.length === 0) {
        setError("No valid team member data found in the CSV file");
        return;
      }

      // Replace all existing members with imported ones
      replaceAllTeamMembers(members);
      setIsOpen(false);
      setError(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(`Error processing CSV: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError("Please upload a valid CSV file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processCSV(text);
    };
    
    reader.onerror = () => {
      setError("Error reading the file");
    };
    
    reader.readAsText(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Import size={16} /> Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Team Members</DialogTitle>
          <DialogDescription>
            Upload a CSV file with team member data. This will replace all existing team members.
            <br />
            The CSV must include columns for name, role, and eligibleAmount.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 py-4">
          <Input 
            ref={fileInputRef}
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
          />
          <div className="text-sm text-gray-500">
            <p className="font-medium">CSV Format Example:</p>
            <p className="font-mono bg-gray-100 p-2 rounded">
              name,role,eligibleAmount,notes<br />
              John Doe,Developer,10000,Senior team member<br />
              Jane Smith,Designer,8000,UI specialist
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CsvImport;
