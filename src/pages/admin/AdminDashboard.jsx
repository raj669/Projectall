import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Building2, Users, MessageSquare, Eye, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminData, MONTHLY_DATA } from '@/lib/AdminDataContext';

const PIE_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
const ACTIVITY_ICONS = { inquiry: MessageSquare, property: Building2, user: Users, general: BarChart3 };
const ACTIVITY_COLORS = { inquiry: 'text-blue-600 bg-blue-50', property: 'text-green-600 bg-green-50', user: 'text-purple-600 bg-purple-50', general: 'text-muted-foreground bg-muted' };

export default function AdminDashboard() {
  const { properties, inquiries, users, activityLog } = useAdminData();

  const activeProps = properties.filter(p => p.admin_status === 'Active').length;
  const newInquiries = inquiries.filter(i => i.status === 'New').length;
  const totalViews = properties.reduce((s, p) => s + (p.views || 0), 0);
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const agentCount = users.filter(u => u.role === 'Agent').length;

  const typeData = ['apartment', 'house', 'villa', 'commercial', 'land'].map((t, i) => ({
    name: t.charAt(0).toUpperCase() + t.slice(1),
    value: properties.filter(p => p.type === t).length,
    color: PIE_COLORS[i],
  }));

  const statusData = ['Active', 'Pending', 'Sold', 'Rented', 'Inactive'].map(s => ({
    name: s,
    count: properties.filter(p => p.admin_status === s).length,
  }));

  const topProperties = [...properties].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  const stats = [
    { label: 'Total Listings', value: properties.length, sub: `${activeProps} active`, icon: Building2, color: 'text-blue-600 bg-blue-50', trend: '+6 this month' },
    { label: 'Total Users', value: users.length, sub: `${agentCount} agents`, icon: Users, color: 'text-purple-600 bg-purple-50', trend: '+2 this week' },
    { label: 'Open Inquiries', value: newInquiries, sub: `${inquiries.length} total`, icon: MessageSquare, color: 'text-amber-600 bg-amber-50', trend: `${inquiries.filter(i => i.status === 'Contacted').length} in progress` },
    { label: 'Total Views', value: totalViews.toLocaleString(), sub: `${activeUsers} active users`, icon: Eye, color: 'text-green-600 bg-green-50', trend: 'All time' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Overview of NepalEstates platform activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, trend }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{trend}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly bar chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Monthly Activity</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="listings" name="Listings" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inquiries" name="Inquiries" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Property type pie */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">By Type</h2>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                {typeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {typeData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-muted-foreground">{name}</span>
                </div>
                <span className="font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inquiries trend */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Inquiry Trend</h2>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} />
              <Line type="monotone" dataKey="inquiries" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status breakdown */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Listing Status</h2>
          <div className="space-y-3">
            {statusData.map(({ name, count }) => {
              const pct = properties.length ? Math.round((count / properties.length) * 100) : 0;
              const color = { Active: 'bg-green-500', Pending: 'bg-amber-500', Sold: 'bg-blue-500', Rented: 'bg-purple-500', Inactive: 'bg-gray-300' }[name];
              return (
                <div key={name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{name}</span>
                    <span className="font-semibold text-foreground">{count} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Add Property', to: '/admin/properties', icon: Building2, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
              { label: 'View Inquiries', to: '/admin/inquiries', icon: MessageSquare, color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
              { label: 'Manage Users', to: '/admin/users', icon: Users, color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
              { label: 'Settings', to: '/admin/settings', icon: Settings2, color: 'bg-gray-50 text-gray-700 hover:bg-gray-100' },
            ].map(({ label, to, icon: Icon, color }) => (
              <Link key={to} to={to} className={`flex items-center gap-3 p-3 rounded-lg transition-colors text-sm font-medium ${color}`}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Top properties + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top properties by views */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Top Properties by Views</h2>
            <Link to="/admin/properties" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {topProperties.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.city} · {p.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-foreground">{(p.views || 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity log */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3 overflow-y-auto max-h-64">
            {activityLog.slice(0, 8).map((entry) => {
              const Icon = ACTIVITY_ICONS[entry.type] ?? BarChart3;
              const cls = ACTIVITY_COLORS[entry.type] ?? ACTIVITY_COLORS.general;
              return (
                <div key={entry.id} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cls}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{entry.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{entry.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{entry.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Settings2(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
