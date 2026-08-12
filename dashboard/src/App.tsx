import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OverviewPage } from './pages/OverviewPage';
import { JourneysPage } from './pages/JourneysPage';
import { JourneyDetailPage } from './pages/JourneyDetailPage';
import { CustomerJourneysPage } from './pages/CustomerJourneysPage';
import { StagesPage } from './pages/StagesPage';
import { ManagePage } from './pages/ManagePage';
import { CampaignsPage } from './pages/CampaignsPage';
import { ChannelsPage } from './pages/ChannelsPage';
import { CustomersPage } from './pages/CustomersPage';
import { UsersPage } from './pages/UsersPage';
import { SetupPage } from './pages/SetupPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
            <Route path="/register" element={<AuthRedirect><RegisterPage /></AuthRedirect>} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OverviewPage />} />
              <Route path="journeys" element={<JourneysPage />} />
              <Route path="journeys/:journeyId" element={<JourneyDetailPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="channels" element={<ChannelsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customer/:customerId" element={<CustomerJourneysPage />} />
              <Route path="stages" element={<StagesPage />} />
              <Route path="manage" element={<ManagePage />} />
              <Route path="setup" element={<SetupPage />} />
              <Route path="users" element={<UsersPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
