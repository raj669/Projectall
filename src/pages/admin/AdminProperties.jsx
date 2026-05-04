import { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Edit, Star, Download, CheckSquare, Square, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAdminData } from '@/lib/AdminDataContext';

const CITIES = ['Kathmandu','Lalitpur','Pokhara','Bhaktapur','Biratnagar','Dharan','Chitwan','Butwal','Birgunj','Hetauda','Itahari','Dhulikhel','Bhairahawa','Tansen'];
const TYPES = ['apartment','house','villa','commercial','land'];
const ADMIN_STATUSES = ['Active','Pending','Sold','Rented','Inactive'];
const STATUS_COLORS = { Active:'bg-green-100 text-green-700', Pending:'bg-amber-100 text-amber-700', Sold:'bg-blue-100 text-blue-700', Rented:'bg-purple-100 text-purple-700', Inactive:'bg-gray-100 text-gray-600' };

const EMPTY_FORM = {
  title:'', type:'apartment', status:'sale', admin_status:'Active', city:'Kathmandu', district:'', address:'',
  price:'', bedrooms:'', bathrooms:'', area:'', area_unit:'sqft', featured:false,
  description:'', images:'', features:'', contact_phone:'',
  seller_name:'', seller_email:'', seller_agency:'',
};

function fmtPrice(p) {
  if (!p && p !== 0) return '—';
  const n = Number(p);
  if (n >= 10000000) return `NPR ${(n/10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `NPR ${(n/100000).toFixed(1)}L`;
  return `NPR ${n.toLocaleString()}`;
}

export default function AdminProperties() {
  const { toast } = useToast();
  const { properties, addProperty, updateProperty, deleteProperty, bulkDeleteProperties, toggleFeatured, updatePropertyStatus } = useAdminData();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [selected, setSelected] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return properties.filter(p => {
      if (q && !p.title?.toLowerCase().includes(q) && !p.city?.toLowerCase().includes(q) && !p.address?.toLowerCase().includes(q)) return false;
      if (filterType && p.type !== filterType) return false;
      if (filterStatus && p.admin_status !== filterStatus) return false;
      if (filterCity && p.city !== filterCity) return false;
      return true;
    });
  }, [properties, search, filterType, filterStatus, filterCity]);

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setFormOpen(true); };
  const openEdit = (p) => {
    setForm({
      title: p.title || '', type: p.type || 'apartment', status: p.status || 'sale',
      admin_status: p.admin_status || 'Active', city: p.city || 'Kathmandu',
      district: p.district || '', address: p.address || '',
      price: p.price ?? '', bedrooms: p.bedrooms ?? '', bathrooms: p.bathrooms ?? '',
      area: p.area ?? '', area_unit: p.area_unit || 'sqft', featured: !!p.featured,
      description: p.description || '',
      images: Array.isArray(p.images) ? p.images.join('\n') : (p.images || ''),
      features: Array.isArray(p.features) ? p.features.join(', ') : (p.features || ''),
      contact_phone: p.contact_phone || '',
      seller_name: p.seller?.name || '', seller_email: p.seller?.email || '',
      seller_agency: p.seller?.agency || '',
    });
    setEditId(p.id);
    setFormOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast({ title: 'Validation', description: 'Title is required', variant: 'destructive' }); return; }
    setSaving(true);
    setTimeout(() => {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area: Number(form.area) || 0,
        images: form.images.split(/[\n,]+/).map(s => s.trim()).filter(Boolean),
        features: form.features.split(',').map(s => s.trim()).filter(Boolean),
        seller: { name: form.seller_name, email: form.seller_email, agency: form.seller_agency, phone: form.contact_phone },
      };
      delete payload.seller_name; delete payload.seller_email; delete payload.seller_agency;
      if (editId) { updateProperty(editId, payload); toast({ title: 'Updated', description: 'Property saved.' }); }
      else { addProperty(payload); toast({ title: 'Added', description: 'Property listed.' }); }
      setSaving(false);
      setFormOpen(false);
    }, 400);
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this property?')) return;
    deleteProperty(id);
    setSelected(s => s.filter(x => x !== id));
    toast({ title: 'Deleted' });
  };

  const handleBulkDelete = () => {
    if (!confirm(`Delete ${selected.length} properties?`)) return;
    bulkDeleteProperties(selected);
    setSelected([]);
    toast({ title: 'Deleted', description: `${selected.length} properties removed.` });
  };

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === paged.length ? [] : paged.map(p => p.id));

  const exportCSV = () => {
    const headers = ['ID','Title','Type','Status','Admin Status','City','Price','Bedrooms','Bathrooms','Area','Featured','Views'];
    const rows = filtered.map(p => [p.id, p.title, p.type, p.status, p.admin_status, p.city, p.price, p.bedrooms, p.bathrooms, `${p.area} ${p.area_unit}`, p.featured ? 'Yes' : 'No', p.views]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'properties.csv' });
    a.click();
  };

  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground text-sm">{properties.length} total · {filtered.length} shown</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5"><Download className="w-3.5 h-3.5" />Export</Button>
          <Button size="sm" onClick={openAdd} className="gap-1.5"><Plus className="w-3.5 h-3.5" />Add Property</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search title, city, address…" className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        {[
          { val: filterType, set: setFilterType, opts: TYPES, placeholder: 'All Types' },
          { val: filterStatus, set: setFilterStatus, opts: ADMIN_STATUSES, placeholder: 'All Statuses' },
          { val: filterCity, set: setFilterCity, opts: CITIES, placeholder: 'All Cities' },
        ].map(({ val, set, opts, placeholder }) => (
          <select key={placeholder} value={val} onChange={e => { set(e.target.value); setPage(1); }} className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary capitalize">
            <option value="">{placeholder}</option>
            {opts.map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
          </select>
        ))}
        {(search || filterType || filterStatus || filterCity) && (
          <button onClick={() => { setSearch(''); setFilterType(''); setFilterStatus(''); setFilterCity(''); setPage(1); }} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X className="w-3.5 h-3.5" />Clear
          </button>
        )}
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5">
          <span className="text-sm font-medium text-primary">{selected.length} selected</span>
          <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="gap-1.5 h-7 text-xs"><Trash2 className="w-3 h-3" />Delete Selected</Button>
          <button onClick={() => setSelected([])} className="ml-auto text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-4 py-3 text-left w-10">
                  <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground">
                    {selected.length === paged.length && paged.length > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Property</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Price</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">City</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Views</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No properties found.</td></tr>
              )}
              {paged.map(p => (
                <tr key={p.id} className={`hover:bg-muted/30 transition-colors ${selected.includes(p.id) ? 'bg-primary/5' : ''}`}>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleSelect(p.id)} className="text-muted-foreground hover:text-foreground">
                      {selected.includes(p.id) ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 max-w-56">
                    <div className="flex items-center gap-2">
                      {p.featured && <Star className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 fill-amber-500" />}
                      <div>
                        <p className="font-medium text-foreground truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.bedrooms > 0 ? `${p.bedrooms}BR · ` : ''}{p.area} {p.area_unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{p.type}</td>
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{fmtPrice(p.price)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.city}</td>
                  <td className="px-4 py-3">
                    <select
                      value={p.admin_status || 'Active'}
                      onChange={e => updatePropertyStatus(p.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[p.admin_status] || STATUS_COLORS.Active}`}
                    >
                      {ADMIN_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{(p.views || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleFeatured(p.id)} title={p.featured ? 'Unfeature' : 'Feature'} className={`p-1.5 rounded-md transition-colors ${p.featured ? 'text-amber-500 hover:bg-amber-50' : 'text-muted-foreground hover:bg-muted'}`}>
                        <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-amber-500' : ''}`} />
                      </button>
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Page {page} of {pages}</span>
            <div className="flex gap-1">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded-md border border-border disabled:opacity-40 hover:bg-muted transition-colors">Prev</button>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded-md border border-border disabled:opacity-40 hover:bg-muted transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl w-full max-w-3xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card rounded-t-2xl z-10">
              <h2 className="text-lg font-semibold">{editId ? 'Edit Property' : 'Add New Property'}</h2>
              <button onClick={() => setFormOpen(false)} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Basic Info */}
              <Section title="Basic Information">
                <div className="col-span-2">
                  <Label>Title *</Label>
                  <input value={form.title} onChange={e => f('title', e.target.value)} placeholder="e.g., Modern 3BHK Apartment in Thamel" className={Input} required />
                </div>
                <div>
                  <Label>Property Type</Label>
                  <select value={form.type} onChange={e => f('type', e.target.value)} className={Input}>
                    {TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Listing Type</Label>
                  <select value={form.status} onChange={e => f('status', e.target.value)} className={Input}>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
                <div>
                  <Label>Admin Status</Label>
                  <select value={form.admin_status} onChange={e => f('admin_status', e.target.value)} className={Input}>
                    {ADMIN_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={e => f('featured', e.target.checked)} className="w-4 h-4 accent-primary" />
                  <label htmlFor="featured" className="text-sm font-medium text-foreground cursor-pointer">Mark as Featured</label>
                </div>
              </Section>

              {/* Location */}
              <Section title="Location">
                <div>
                  <Label>City</Label>
                  <select value={form.city} onChange={e => f('city', e.target.value)} className={Input}>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label>District</Label>
                  <input value={form.district} onChange={e => f('district', e.target.value)} placeholder="e.g., Kathmandu" className={Input} />
                </div>
                <div className="col-span-2">
                  <Label>Full Address</Label>
                  <input value={form.address} onChange={e => f('address', e.target.value)} placeholder="e.g., Thamel Marg, Ward 26" className={Input} />
                </div>
              </Section>

              {/* Details */}
              <Section title="Property Details">
                <div>
                  <Label>Price (NPR)</Label>
                  <input type="number" value={form.price} onChange={e => f('price', e.target.value)} placeholder="e.g., 8500000" className={Input} />
                </div>
                <div>
                  <Label>Bedrooms</Label>
                  <input type="number" value={form.bedrooms} onChange={e => f('bedrooms', e.target.value)} placeholder="0" min={0} className={Input} />
                </div>
                <div>
                  <Label>Bathrooms</Label>
                  <input type="number" value={form.bathrooms} onChange={e => f('bathrooms', e.target.value)} placeholder="0" min={0} className={Input} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label>Area</Label>
                    <input type="number" value={form.area} onChange={e => f('area', e.target.value)} placeholder="e.g., 1200" className={Input} />
                  </div>
                  <div className="w-24">
                    <Label>Unit</Label>
                    <select value={form.area_unit} onChange={e => f('area_unit', e.target.value)} className={Input}>
                      <option value="sqft">sqft</option>
                      <option value="aana">aana</option>
                      <option value="ropani">ropani</option>
                    </select>
                  </div>
                </div>
              </Section>

              {/* Description & Features */}
              <Section title="Description & Features">
                <div className="col-span-2">
                  <Label>Description</Label>
                  <textarea value={form.description} onChange={e => f('description', e.target.value)} rows={4} placeholder="Describe the property…" className={`${Input} resize-none`} />
                </div>
                <div className="col-span-2">
                  <Label>Features (comma separated)</Label>
                  <input value={form.features} onChange={e => f('features', e.target.value)} placeholder="e.g., Parking, Security, Balcony, Solar Panels" className={Input} />
                </div>
              </Section>

              {/* Images */}
              <Section title="Images">
                <div className="col-span-2">
                  <Label>Image URLs (one per line)</Label>
                  <textarea value={form.images} onChange={e => f('images', e.target.value)} rows={3} placeholder="https://images.unsplash.com/..." className={`${Input} resize-none font-mono text-xs`} />
                  <p className="text-xs text-muted-foreground mt-1">Use Unsplash or any public image URL. One URL per line.</p>
                </div>
              </Section>

              {/* Contact */}
              <Section title="Contact & Seller">
                <div>
                  <Label>Contact Phone</Label>
                  <input value={form.contact_phone} onChange={e => f('contact_phone', e.target.value)} placeholder="+977-980-..." className={Input} />
                </div>
                <div>
                  <Label>Seller / Agent Name</Label>
                  <input value={form.seller_name} onChange={e => f('seller_name', e.target.value)} placeholder="Full name" className={Input} />
                </div>
                <div>
                  <Label>Seller Email</Label>
                  <input type="email" value={form.seller_email} onChange={e => f('seller_email', e.target.value)} placeholder="seller@email.com" className={Input} />
                </div>
                <div>
                  <Label>Agency</Label>
                  <input value={form.seller_agency} onChange={e => f('seller_agency', e.target.value)} placeholder="Agency name" className={Input} />
                </div>
              </Section>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="flex-1" disabled={saving}>Cancel</Button>
                <Button type="submit" className="flex-1 gap-2" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Saving…' : editId ? 'Update Property' : 'Add Property'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const Input = 'w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary';
const Label = ({ children }) => <label className="block text-xs font-medium text-foreground mb-1.5">{children}</label>;
const Section = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-foreground mb-3 pb-1.5 border-b border-border">{title}</h3>
    <div className="grid grid-cols-2 gap-4">{children}</div>
  </div>
);
