import { useState } from 'react';
import { Save, Loader2, Globe, MapPin, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAdminData } from '@/lib/AdminDataContext';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${checked ? 'bg-primary' : 'bg-muted'}`}
      >
        <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

const INP = 'w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary';

export default function AdminSettings() {
  const { toast } = useToast();
  const { settings, updateSettings, properties, users, inquiries } = useAdminData();
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState({ ...settings });

  const f = (key, val) => setLocal(prev => ({ ...prev, [key]: val }));

  const handleSave = (e) => {
    e.preventDefault();
    if (!local.siteName.trim() || !local.email.trim()) {
      toast({ title: 'Validation', description: 'Site name and email are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      updateSettings(local);
      setSaving(false);
      toast({ title: 'Saved', description: 'Settings updated successfully.' });
    }, 500);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm">Configure your NepalEstates platform</p>
      </div>

      {/* Platform stats — read only */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Properties', value: properties.length },
          { label: 'Total Users', value: users.length },
          { label: 'Total Inquiries', value: inquiries.length },
          { label: 'Featured Listings', value: properties.filter(p => p.featured).length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* General */}
        <Section icon={Globe} title="General">
          <Field label="Site Name">
            <input value={local.siteName} onChange={e => f('siteName', e.target.value)} className={INP} placeholder="NepalEstates" />
          </Field>
          <Field label="Tagline">
            <input value={local.tagline} onChange={e => f('tagline', e.target.value)} className={INP} placeholder="Nepal's Most Trusted Property Platform" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Currency">
              <select value={local.currency} onChange={e => f('currency', e.target.value)} className={INP}>
                <option value="NPR">NPR — Nepali Rupee</option>
                <option value="USD">USD — US Dollar</option>
                <option value="INR">INR — Indian Rupee</option>
              </select>
            </Field>
            <Field label="Max Featured Listings" hint="Number of properties that can be featured simultaneously">
              <input type="number" value={local.featuredLimit} onChange={e => f('featuredLimit', e.target.value)} className={INP} min="1" max="50" />
            </Field>
          </div>
        </Section>

        {/* Contact */}
        <Section icon={MapPin} title="Contact Information">
          <Field label="Office Address">
            <input value={local.address} onChange={e => f('address', e.target.value)} className={INP} placeholder="Full address" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email Address">
              <input type="email" value={local.email} onChange={e => f('email', e.target.value)} className={INP} placeholder="info@nepalestates.com" />
            </Field>
            <Field label="Phone Number">
              <input type="tel" value={local.phone} onChange={e => f('phone', e.target.value)} className={INP} placeholder="+977-1-XXXXXXX" />
            </Field>
          </div>
        </Section>

        {/* Listings */}
        <Section icon={Shield} title="Listing & Moderation">
          <div className="space-y-3 divide-y divide-border">
            <Toggle
              checked={local.requireApproval}
              onChange={v => f('requireApproval', v)}
              label="Require Admin Approval"
              description="New property listings must be approved before going live"
            />
            <div className="pt-3">
              <Toggle
                checked={local.maintenanceMode}
                onChange={v => f('maintenanceMode', v)}
                label="Maintenance Mode"
                description="Take the site offline for visitors while you make changes"
              />
            </div>
          </div>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications">
          <div className="space-y-3">
            <Toggle
              checked={local.emailNotifications}
              onChange={v => f('emailNotifications', v)}
              label="Email Notifications"
              description="Send email alerts when new inquiries or registrations come in"
            />
          </div>
        </Section>

        <Button type="submit" size="lg" className="w-full gap-2" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}
