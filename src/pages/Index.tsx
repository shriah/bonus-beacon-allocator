
import React from 'react';
import Layout from '@/components/Layout';
import { BonusProvider } from '@/contexts/BonusContext';
import BonusPoolCard from '@/components/BonusPoolCard';
import BonusPoolSettings from '@/components/BonusPoolSettings';
import TeamMemberList from '@/components/TeamMemberList';
import BonusSummary from '@/components/BonusSummary';

const Index: React.FC = () => {
  return (
    <BonusProvider>
      <Layout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-finance-primary mb-2">Bonus Allocation Dashboard</h1>
          <p className="text-gray-600">
            Manage and distribute your team's bonus pool efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <BonusPoolCard />
          <BonusPoolSettings />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TeamMemberList />
          </div>
          <div>
            <BonusSummary />
          </div>
        </div>
      </Layout>
    </BonusProvider>
  );
};

export default Index;
