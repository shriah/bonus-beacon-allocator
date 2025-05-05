
import React from 'react';
import { Badge, BadgeDollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-finance-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BadgeDollarSign size={24} />
            <h1 className="text-2xl font-bold">Bonus Beacon</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/" className="hover:text-finance-accent">Dashboard</a></li>
              <li><a href="/team" className="hover:text-finance-accent">Team</a></li>
              <li><a href="/settings" className="hover:text-finance-accent">Settings</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
      <footer className="bg-finance-primary text-white p-4 mt-10">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Bonus Beacon Allocator</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
