import React, { useState } from 'react';
import { Sidebar, Header } from '../../shared/components';
import { useAppSelector } from '../store';
import { useLogout } from '../../features/auth';

interface MainLayoutProps {
  children?: React.ReactNode;
  title?: string;
}

/**
 * MainLayout - Full app layout with sidebar and header
 * Used for authenticated pages
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  //* States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  //* Custom hooks
  const { user } = useAppSelector((state) => state.auth);
  const { logout } = useLogout();

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  //* JSX
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        {/* Navigation items will be added here */}
        <nav className="space-y-1">
          <div className="px-3 py-2 text-sm font-medium text-gray-400">
            Navigation coming soon...
          </div>
        </nav>
      </Sidebar>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header
          title={title}
          onMenuClick={toggleSidebar}
          user={
            user
              ? {
                  name: `${user.firstName} ${user.lastName}`,
                  email: user.email,
                  avatar: user.avatar,
                }
              : undefined
          }
          onLogout={logout}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
