import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, MessageSquare, Users, Settings, Bell, Menu, X, Home, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useAdminData } from '@/lib/AdminDataContext';

const NAV = [
  { to: '/admin',            label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/admin/properties', label: 'Properties',  icon: Building2 },
  { to: '/admin/inquiries',  label: 'Inquiries',   icon: MessageSquare },
  { to: '/admin/users',      label: 'Users',        icon: Users },
  { to: '/admin/settings',   label: 'Settings',     icon: Settings },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { inquiries } = useAdminData();
  const newCount = inquiries.filter(i => i.status === 'New').length;

  const breadcrumb = NAV.find(n => n.to !== '/admin' && location.pathname.startsWith(n.to))
    ?? NAV.find(n => location.pathname === '/admin');

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${open ? 'w-64' : 'w-0 lg:w-16'} flex-shrink-0 bg-card border-r border-border transition-all duration-200 overflow-hidden flex flex-col`}>
        {/* Logo */}
        <div className={`p-4 border-b border-border flex items-center ${open ? 'gap-3' : 'justify-center'}`}>
          <span className="text-2xl flex-shrink-0">🏠</span>
          {open && <span className="font-playfair font-bold text-foreground text-lg truncate">NepalEstates</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                title={!open ? label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {open && <span>{label}</span>}
                {!open && label === 'Inquiries' && newCount > 0 && (
                  <span className="absolute left-10 top-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back to site */}
        <div className="p-2 border-t border-border">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors`}
            title={!open ? 'Back to Site' : undefined}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            {open && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(o => !o)}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label="Toggle sidebar"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Admin</span>
              {breadcrumb && breadcrumb.to !== '/admin' && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-foreground font-medium">{breadcrumb.label}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button
              onClick={() => navigate('/admin/inquiries')}
              className="relative p-2 rounded-md hover:bg-muted transition-colors"
              title="Inquiries"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {newCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {newCount > 9 ? '9+' : newCount}
                </span>
              )}
            </button>

            {/* Admin badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">A</div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
