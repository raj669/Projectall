import { useState, useMemo } from 'react';
import { Eye, Trash2, Download, Search, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAdminData } from '@/lib/AdminDataContext';

const STATUS_OPTS = ['New', 'Contacted', 'Closed'];
const STATUS_COLORS = {
  New: 'bg-amber-100 text-amber-700',
  Contacted: 'bg-blue-100 text-blue-700',
  Closed: 'bg-green-100 text-green-700',
};

export default function AdminInquiries() {
  const { toast } = useToast();
  const { inquiries, updateInquiry, deleteInquiry, agents } = useAdminData();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return inquiries.filter(i => {
      if (q && !i.name.toLowerCase().includes(q) && !i.property.toLowerCase().includes(q) && !i.email.toLowerCase().includes(q)) return false;
      if (filterStatus && i.status !== filterStatus) return false;
      return true;
    });
  }, [inquiries, search, filterStatus]);

  const counts = useMemo(() => STATUS_OPTS.reduce((acc, s) => ({ ...acc, [s]: inquiries.filter(i => i.status === s).length }), {}), [inquiries]);

  const handleDelete = (id) => {
    if (!confirm('Delete this inquiry?')) return;
    deleteInquiry(id);
    if (detail?.id === id) setDetail(null);
    toast({ title: 'Deleted' });
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Property', 'Assigned Agent', 'Date', 'Status', 'Message'];
    const rows = filtered.map(i => [i.name, i.email, i.phone, i.property, i.assignedAgent, i.date, i.status, i.message]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'inquiries.csv' });
    a.click();
    toast({ title: 'Exported', description: `${filtered.length} inquiries downloaded.` });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inquiries</h1>
          <p className="text-muted-foreground text-sm">{inquiries.length} total leads</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5 self-start">
          <Download className="w-3.5 h-3.5" />Export CSV
        </Button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3">
        {STATUS_OPTS.map(s => (
          <button key={s} onClick={() => setFilterStatus(fs => fs === s ? '' : s)} className={`bg-card border rounded-xl px-4 py-3 text-left transition-all ${filterStatus === s ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/30'}`}>
            <p className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-1 ${STATUS_COLORS[s]}`}>{s}</p>
            <p className="text-2xl font-bold text-foreground">{counts[s] || 0}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, property, email…" className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">All Statuses</option>
          {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || filterStatus) && (
          <button onClick={() => { setSearch(''); setFilterStatus(''); }} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><X className="w-3.5 h-3.5" />Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Lead</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Property</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Assigned Agent</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No inquiries found.</td></tr>
              )}
              {filtered.map(inq => (
                <tr key={inq.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{inq.name}</p>
                    <p className="text-xs text-muted-foreground">{inq.email}</p>
                    <p className="text-xs text-muted-foreground">{inq.phone}</p>
                  </td>
                  <td className="px-4 py-3 max-w-48">
                    <p className="text-foreground truncate">{inq.property}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={inq.assignedAgent || ''}
                      onChange={e => updateInquiry(inq.id, { assignedAgent: e.target.value })}
                      className="text-xs border border-border rounded-lg px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary min-w-32"
                    >
                      <option value="">Unassigned</option>
                      {agents.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{inq.date}</td>
                  <td className="px-4 py-3">
                    <select
                      value={inq.status}
                      onChange={e => updateInquiry(inq.id, { status: e.target.value })}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[inq.status]}`}
                    >
                      {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setDetail(inq)} className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(inq.id)} className="p-1.5 rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Inquiry Details</h2>
              </div>
              <button onClick={() => setDetail(null)} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Info label="Name" value={detail.name} />
                <Info label="Email" value={detail.email} />
                <Info label="Phone" value={detail.phone} />
                <Info label="Date" value={detail.date} />
                <div className="col-span-2"><Info label="Property" value={detail.property} /></div>
                <Info label="Assigned Agent" value={detail.assignedAgent || 'Unassigned'} />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Status</p>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[detail.status]}`}>{detail.status}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Message</p>
                <p className="text-sm text-foreground bg-muted/50 rounded-xl p-3 leading-relaxed">{detail.message}</p>
              </div>
              <div className="flex gap-2 pt-1">
                {STATUS_OPTS.filter(s => s !== detail.status).map(s => (
                  <Button key={s} size="sm" variant="outline" onClick={() => { updateInquiry(detail.id, { status: s }); setDetail(d => ({ ...d, status: s })); toast({ title: `Marked as ${s}` }); }}
                    className={`text-xs flex-1 ${s === 'Closed' ? 'border-green-300 text-green-700 hover:bg-green-50' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}>
                    Mark {s}
                  </Button>
                ))}
                <Button size="sm" variant="destructive" onClick={() => handleDelete(detail.id)} className="text-xs">Delete</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
    <p className="text-sm text-foreground">{value}</p>
  </div>
);
