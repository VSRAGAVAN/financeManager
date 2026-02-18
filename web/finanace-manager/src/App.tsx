import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Users from './pages/Users';
import Recurring from './pages/Recurring';
import Bills from './pages/Bills';
import Analytics from './pages/Analytics';
import Support from './pages/Support';
import AdminSavings from './pages/AdminSavings';
import SavingsScheme from './pages/SavingsScheme';

import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="income" element={<Income />} />
              <Route path="expense" element={<Expense />} />
              <Route path="users" element={<Users />} />
              <Route path="recurring" element={<Recurring />} />
              <Route path="bills" element={<Bills />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="support" element={<Support />} />
              <Route path="admin-savings" element={<AdminSavings />} />
              <Route path="savings" element={<SavingsScheme />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
