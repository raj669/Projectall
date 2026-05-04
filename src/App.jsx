import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from '@/lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { AdminDataProvider } from '@/lib/AdminDataContext';
import { ImageValidationProvider } from '@/lib/ImageValidationContext';
import ErrorBoundary from '@/lib/error-boundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';
import Report from './pages/Report';
import Heatmap from './pages/Heatmap';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminImageValidation from './pages/admin/AdminImageValidation';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Buy from './pages/Buy';
import Sell from './pages/Sell';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AdminDataProvider>
          <ImageValidationProvider>
            <QueryClientProvider client={queryClientInstance}>
              <Router>
                <Routes>
                  {/* Auth Pages */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Main App */}
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/properties/:id" element={<PropertyDetail />} />
                    <Route path="/heatmap" element={<Heatmap />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/report" element={<Report />} />

                    {/* Protected Routes */}
                    <Route path="/buy" element={<ProtectedRoute><Buy /></ProtectedRoute>} />
                    <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="properties" element={<AdminProperties />} />
                    <Route path="inquiries" element={<AdminInquiries />} />
                    <Route path="image-validation" element={<AdminImageValidation />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </Router>
              <Toaster />
            </QueryClientProvider>
          </ImageValidationProvider>
        </AdminDataProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App