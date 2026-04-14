import React from 'react';
import { useAppSelector } from '../../../app/store';
import { StatsCard } from '../components';

// Placeholder icons
const UsersIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DashboardPage: React.FC = () => {
  //* States

  //* Custom hooks
  const { user } = useAppSelector((state) => state.auth);

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your hiring pipeline.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Open Positions"
          value={12}
          description="Active job listings"
          icon={<BriefcaseIcon />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Candidates"
          value={148}
          description="Total candidates"
          icon={<UsersIcon />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Applications"
          value={324}
          description="This month"
          icon={<DocumentIcon />}
          trend={{ value: 23, isPositive: true }}
        />
        <StatsCard
          title="Avg. Time to Hire"
          value="14 days"
          description="Last 30 days"
          icon={<ClockIcon />}
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <p className="mt-4 text-sm text-gray-500">
            Activity feed will be displayed here...
          </p>
        </div>

        {/* Upcoming interviews */}
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
          <p className="mt-4 text-sm text-gray-500">
            Scheduled interviews will be displayed here...
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
