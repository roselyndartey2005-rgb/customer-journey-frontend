import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

const titleMap: Record<string, string> = {
  '/': 'Overview',
  '/journeys': 'Journeys',
  '/manage': 'Manage Journeys',
  '/stages': 'Journey Stages',
};

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/journeys/')) return 'Journey Detail';
  if (pathname.startsWith('/customer/')) return 'Customer Journeys';
  return titleMap[pathname] || 'Dashboard';
}

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="lg:ml-64 transition-all duration-200">
        <TopBar title={title} onMenuClick={() => setSidebarOpen(true)} />

        {/* Content with max-width and responsive padding */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
