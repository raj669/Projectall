import { AdminDataProvider } from '@/lib/AdminDataContext';
import AdminLayout from './AdminLayout';

export default function AdminLayoutWithProvider() {
  return (
    <AdminDataProvider>
      <AdminLayout />
    </AdminDataProvider>
  );
}
