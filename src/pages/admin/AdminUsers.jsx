import { useState, useMemo } from 'react';
import { UserPlus, Search, Trash2, Edit, X, Loader2, Shield, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAdminData } from '@/lib/AdminDataContext';

const ROLES = ['Admin', 'Agent', 'Customer'];
const STATUSES = ['Active', 'Pending', 'Suspended'];
const ROLE_COLORS = { Admin: 'bg-red-100 text-red-700', Agent: 'bg-blue-100 text-blue-700', Customer: 'bg-gray-100 text-gray-700' };
const STATUS_COLORS = { Active: 'bg-green-100 text-green-700', Pending: 'bg-amber-100 text-amber-700', Suspended: 'bg-red-100 text-red-700' };
const ROLE_ICONS = { Admin: Shield, Agent: Briefcase, Customer: User };

const EMPTY_FORM = { name: '', email: '', phone: '', role: 'Customer', city: '' };

export default function AdminUsers() {
  const { toast } = useToast();
  const { users, addUser, updateUser, deleteUser } = useAdminData();

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      if (filterRole && u.role !== filterRole) return false;
      if (filterStatus && u.status !== filterStatus) return false;
      return true;
    });
  }, [users, search, filterRole, filterStatus]);

  const summary = useMemo(() => ({
    total: users.length,
    agents: users.filter(u => u.role === 'Agent').length,
    active: users.filter(u => u.status === 'Active').length,
    pending: users.filter(u => u.status === 'Pending').length,
  }), [users]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setFormOpen(true); };
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, phone: u.phone || '', role: u.role, city: u.city || '' }); setEditId(u.id); setFormOpen(true); };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { toast({ title: 'Required', description: 'Name and email are required.', variant: 'destructive' }); return; }
    setSaving(true);
    setTimeout(() => {
      if (editId) { updateUser(editId, form); toast({ title: 'Updated' }); }
      else { addUser(form); toast({ title: 'User added' }); }
      setSaving(false); setFormOpen(false);
    }, 400);
  };

  const handleDelete = (id) => {
    if (!confirm('Remove this user?')) return;
    deleteUser(id);
    toast({ title: 'Removed' });
  };

  const cycleStatus = (u) => {
    const next = { Active: 'Suspended', Pending: 'Active', Suspended: 'Active' }[u.status] || 'Active';
    updateUser(u.id, { status: next });
    toast({ title: `User ${next === 'Active' ? 'activated' : 'suspended'}` });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground text-sm">{users.length} total · {summary.agents} agents</p>
        </div>
        <Button size="sm" onClick={openAdd} className="gap-1.5 self-start"><UserPlus className="w-3.5 h-3.5" />Add User</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: summary.total, icon: Users, color: 'text-primary bg-primary/10' },
          { label: 'Agents', value: summary.agents, icon: Shield, color: 'text-blue-600 bg-blue-50' },
          { label: 'Active', value: summary.active, icon: User, color: 'text-green-600 bg-green-50' },
          { label: 'Pending Approval', value: summary.pending, icon: User, color: 'text-amber-600 bg-amber-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-4 h-4" /></div>
            <div>
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email…" className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || filterRole || filterStatus) && (
          <button onClick={() => { setSearch(''); setFilterRole(''); setFilterStatus(''); }} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><X className="w-3.5 h-3.5" />Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground">User</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">City</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Joined</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Listings</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No users found.</td></tr>
              )}
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={e => updateUser(u.id, { role: e.target.value })}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${ROLE_COLORS[u.role]}`}
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[u.status]}`}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.city || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{u.joinDate}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.listings}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {u.status === 'Pending' && (
                        <button onClick={() => { updateUser(u.id, { status: 'Active' }); toast({ title: 'Approved' }); }} className="px-2 py-1 text-xs bg-green-50 text-green-700 hover:bg-green-100 rounded-md font-medium transition-colors">Approve</button>
                      )}
                      {u.status !== 'Pending' && (
                        <button onClick={() => cycleStatus(u)} className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${u.status === 'Suspended' ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>
                          {u.status === 'Suspended' ? 'Activate' : 'Suspend'}
                        </button>
                      )}
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-foreground">{editId ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => setFormOpen(false)} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {[
                { key: 'name', label: 'Full Name *', type: 'text', placeholder: 'Full name' },
                { key: 'email', label: 'Email *', type: 'email', placeholder: 'email@example.com' },
                { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+977-98X-XXXXXXX' },
                { key: 'city', label: 'City', type: 'text', placeholder: 'e.g., Kathmandu' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-foreground mb-1.5">{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="flex-1" disabled={saving}>Cancel</Button>
                <Button type="submit" className="flex-1 gap-2" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editId ? 'Update' : 'Add User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Briefcase(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
}
