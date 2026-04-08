import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Chat from './pages/Chat';
import UserProfile from './pages/UserProfile';
import CreateProject from './pages/CreateProject';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><div className="spinner" /></div>;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
    <Route path="/projects" element={<PrivateRoute><Layout><Projects /></Layout></PrivateRoute>} />
    <Route path="/projects/new" element={<PrivateRoute><Layout><CreateProject /></Layout></PrivateRoute>} />
    <Route path="/projects/:id" element={<PrivateRoute><Layout><ProjectDetail /></Layout></PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
    <Route path="/profile/edit" element={<PrivateRoute><Layout><EditProfile /></Layout></PrivateRoute>} />
    <Route path="/users/:id" element={<PrivateRoute><Layout><UserProfile /></Layout></PrivateRoute>} />
    <Route path="/chat/:projectId" element={<PrivateRoute><Layout><Chat /></Layout></PrivateRoute>} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#131929', color: '#e2e8f0', border: '1px solid #1e2d4a' },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
