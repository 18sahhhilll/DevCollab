import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/Layout';

import Login        from './pages/Login';
import Register     from './pages/Register';
import Feed         from './pages/Feed';
import Dashboard    from './pages/Dashboard';
import Projects     from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import EditProject  from './pages/EditProject';
import Profile      from './pages/Profile';
import EditProfile  from './pages/EditProfile';
import Chat         from './pages/Chat';
import UserProfile  from './pages/UserProfile';
import Applications from './pages/Applications';

/* ─── Route guards ─────────────────────────────────────────────────── */
const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
    <div className="spinner" />
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return !user ? children : <Navigate to="/feed" replace />;
};

/* ─── Wraps a page with the layout sidebar ─────────────────────────── */
const Page = ({ component: Component }) => (
  <PrivateRoute>
    <Layout>
      <Component />
    </Layout>
  </PrivateRoute>
);

/* ─── All routes ────────────────────────────────────────────────────── */
const AppRoutes = () => (
  <Routes>
    {/* Default — send logged-in users to feed */}
    <Route path="/"                    element={<Navigate to="/feed" replace />} />

    {/* Auth */}
    <Route path="/login"               element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register"            element={<PublicRoute><Register /></PublicRoute>} />

    {/* Core app pages */}
    <Route path="/feed"                element={<Page component={Feed} />} />
    <Route path="/dashboard"           element={<Page component={Dashboard} />} />
    <Route path="/projects"            element={<Page component={Projects} />} />
    <Route path="/projects/new"        element={<Page component={CreateProject} />} />
    <Route path="/projects/:id"        element={<Page component={ProjectDetail} />} />
    <Route path="/projects/:id/edit"   element={<Page component={EditProject} />} />
    <Route path="/applications"        element={<Page component={Applications} />} />
    <Route path="/profile"             element={<Page component={Profile} />} />
    <Route path="/profile/edit"        element={<Page component={EditProfile} />} />
    <Route path="/users/:id"           element={<Page component={UserProfile} />} />
    <Route path="/chat/:projectId"     element={<Page component={Chat} />} />

    {/* Fallback */}
    <Route path="*"                    element={<Navigate to="/feed" replace />} />
  </Routes>
);

/* ─── Root ──────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#111111',
                border: '1px solid #e4e4df',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
              },
              success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
