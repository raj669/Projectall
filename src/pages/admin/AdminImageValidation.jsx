import { useState, useMemo } from 'react';
import { useAdminData } from '@/lib/AdminDataContext';
import { useImageValidation } from '@/lib/ImageValidationContext';
import { computeAutoFix } from '@/lib/imageValidationService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck, AlertTriangle, AlertCircle, Clock, Sparkles,
  ScanSearch, Wand2, CheckCircle2, XCircle, RotateCcw,
  ChevronRight, X, Info, ImageOff, Star, Eye,
  ArrowUpDown, ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  valid:      { label: 'Valid',       icon: ShieldCheck,    color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  flagged:    { label: 'Flagged',     icon: AlertTriangle,  color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200' },
  critical:   { label: 'Critical',    icon: AlertCircle,    color: 'text-red-600',     bg: 'bg-red-50 border-red-200' },
  approved:   { label: 'Approved',    icon: CheckCircle2,   color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200' },
  auto_fixed: { label: 'Auto-Fixed',  icon: Wand2,          color: 'text-purple-600',  bg: 'bg-purple-50 border-purple-200' },
  pending:    { label: 'Pending',     icon: Clock,          color: 'text-muted-foreground', bg: 'bg-muted border-border' },
};

function ScoreRing({ score, size = 44 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const pct = score / 100;
  const color = score >= 80 ? '#22c55e' : score >= 55 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-none">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={4} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={4}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fontSize={size < 40 ? 9 : 11} fontWeight="700" fill={color}>
        {score}
      </text>
    </svg>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function ProgressBar({ value, color = 'bg-primary' }) {
  return (
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

// ─── Property detail sheet ────────────────────────────────────────────────────

function PropertyDetailSheet({ property, result, onClose, onApprove, onReject, onFix, onRevalidate }) {
  const fixedCount = result ? computeAutoFix(property, result).length : 0;

  if (!property) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-2xl bg-card border-l border-border flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="font-bold text-foreground text-base leading-tight truncate">{property.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">
              {property.type} · {property.status === 'sale' ? 'For Sale' : 'For Rent'} · {property.city}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {result && <ScoreRing score={result.overallScore} size={48} />}
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Validation status */}
          {result ? (
            <>
              <div className="flex items-center gap-3 flex-wrap">
                <StatusBadge status={result.status} />
                <span className="text-xs text-muted-foreground">
                  Method: <strong className="capitalize">{result.method}</strong>
                  {result.aiEnhanced && ' + AI'}
                </span>
                <span className="text-xs text-muted-foreground">
                  Scanned: {new Date(result.validatedAt).toLocaleString()}
                </span>
              </div>

              {/* Issues */}
              {result.issues.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Issues Detected</h3>
                  {result.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-none mt-0.5" />
                      <span className="text-amber-800">{issue}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Recommendations</h3>
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                      <Info className="w-3.5 h-3.5 text-blue-600 flex-none mt-0.5" />
                      <span className="text-blue-800">{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Per-image analysis */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Image Analysis ({result.images.length} images)
                </h3>
                {result.images.map((img, i) => (
                  <div key={i} className={`rounded-xl border overflow-hidden ${img.score < 60 ? 'border-red-200 bg-red-50/30' : 'border-border bg-card'}`}>
                    <div className="flex gap-3 p-3">
                      {/* Thumbnail */}
                      <div className="relative flex-none w-24 h-16 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={img.url}
                          alt={`Image ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                        {img.isCover && (
                          <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1 py-0.5 rounded">
                            COVER
                          </span>
                        )}
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">
                          #{i + 1}
                        </span>
                      </div>

                      {/* Analysis */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-medium text-foreground">{img.detected}</p>
                          <ScoreRing score={img.score} size={32} />
                        </div>
                        <ProgressBar
                          value={img.score}
                          color={img.score >= 80 ? 'bg-emerald-500' : img.score >= 55 ? 'bg-amber-500' : 'bg-red-500'}
                        />
                        {img.issues.length > 0 && (
                          <div className="mt-1.5 space-y-0.5">
                            {img.issues.map((iss, j) => (
                              <p key={j} className="text-[11px] text-amber-700 leading-tight">&bull; {iss}</p>
                            ))}
                          </div>
                        )}
                        {img.caption && (
                          <p className="text-[11px] text-muted-foreground mt-1 italic">&ldquo;{img.caption}&rdquo;</p>
                        )}
                        <span className={`inline-block mt-1 text-[10px] font-semibold uppercase tracking-wide ${
                          img.recommendation === 'remove' ? 'text-red-600'
                          : img.recommendation === 'cover'  ? 'text-blue-600'
                          : 'text-emerald-600'
                        }`}>
                          {img.recommendation === 'remove' ? '✕ Suggest Remove'
                            : img.recommendation === 'cover' ? '★ Use as Cover'
                            : '✓ Keep'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin note */}
              {result.adminNote && (
                <div className="text-sm bg-muted rounded-lg px-3 py-2 text-muted-foreground">
                  <strong>Admin note:</strong> {result.adminNote}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Not yet scanned</p>
              <Button size="sm" variant="outline" className="mt-4" onClick={() => onRevalidate(false)}>
                <ScanSearch className="w-3.5 h-3.5 mr-1.5" />
                Run Quick Scan
              </Button>
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="p-4 border-t border-border bg-muted/30 flex flex-wrap items-center gap-2">
          {result?.status !== 'approved' && (
            <Button size="sm" variant="outline" className="text-emerald-700 border-emerald-300 hover:bg-emerald-50" onClick={onApprove}>
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Mark Valid
            </Button>
          )}
          {result && result.status !== 'auto_fixed' && result.issues.length > 0 && (
            <Button size="sm" variant="outline" className="text-purple-700 border-purple-300 hover:bg-purple-50" onClick={onFix}>
              <Wand2 className="w-3.5 h-3.5 mr-1.5" />
              Auto-Fix ({fixedCount} imgs)
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onRevalidate(false)} disabled={!result}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Re-scan
          </Button>
          <div className="flex-1" />
          <Link to={`/properties/${property.id}`} target="_blank">
            <Button size="sm" variant="ghost">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              View Listing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { id: 'all',      label: 'All' },
  { id: 'critical', label: 'Critical' },
  { id: 'flagged',  label: 'Flagged' },
  { id: 'valid',    label: 'Valid' },
  { id: 'approved', label: 'Approved' },
  { id: 'pending',  label: 'Not Scanned' },
];

export default function AdminImageValidation() {
  const { properties } = useAdminData();
  const {
    results, isRunning, progress, error, counts, hasApiKey,
    runHeuristicScan, runAIScan,
    approveResult, applyAutoFix, revalidateProperty, clearError,
  } = useImageValidation();

  const [activeTab, setActiveTab]       = useState('all');
  const [selectedId, setSelectedId]     = useState(null);
  const [sortBy, setSortBy]             = useState('score_asc'); // score_asc, score_desc, name
  const [confirmBatchFix, setConfirmBatchFix] = useState(false);

  const selectedProperty = properties.find(p => p.id === selectedId);
  const selectedResult   = selectedId ? results[selectedId] : null;

  // Build the displayed list
  const displayList = useMemo(() => {
    return properties
      .map(p => ({
        property: p,
        result: results[p.id] ?? null,
        status: results[p.id]?.status ?? 'pending',
        score:  results[p.id]?.overallScore ?? -1,
      }))
      .filter(({ status }) => {
        if (activeTab === 'all')      return true;
        if (activeTab === 'pending')  return status === 'pending';
        return status === activeTab;
      })
      .sort((a, b) => {
        if (sortBy === 'score_asc')  return a.score - b.score;
        if (sortBy === 'score_desc') return b.score - a.score;
        return a.property.title.localeCompare(b.property.title);
      });
  }, [properties, results, activeTab, sortBy]);

  const flaggedCount = counts.flagged + counts.critical;

  function handleBatchAutoFix() {
    const fixable = properties.filter(p => {
      const r = results[p.id];
      return r && r.issues.length > 0 && r.status !== 'approved' && r.status !== 'auto_fixed';
    });
    fixable.forEach(p => applyAutoFix(p.id));
    setConfirmBatchFix(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ScanSearch className="w-6 h-6 text-primary" />
            Image Validation
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            AI-powered image consistency checker for all property listings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!hasApiKey && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              Set <code className="font-mono bg-amber-100 px-1 rounded">VITE_ANTHROPIC_API_KEY</code> to enable AI scans
            </div>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={runHeuristicScan}
            disabled={isRunning}
          >
            <ScanSearch className="w-3.5 h-3.5 mr-1.5" />
            Quick Scan
          </Button>
          <Button
            size="sm"
            onClick={runAIScan}
            disabled={isRunning || !hasApiKey}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            AI Scan
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-600 flex-none mt-0.5" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={clearError}><X className="w-4 h-4 text-red-400 hover:text-red-600" /></button>
        </div>
      )}

      {/* Progress bar */}
      {isRunning && progress && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Analyzing: <em>{progress.propertyTitle}</em>
            </span>
            <span className="font-medium">{progress.current} / {progress.total}</span>
          </div>
          <ProgressBar value={(progress.current / progress.total) * 100} color="bg-primary" />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: 'Total',      value: counts.total,     color: 'text-foreground',        icon: Eye },
          { label: 'Scanned',    value: counts.scanned,   color: 'text-blue-600',          icon: ScanSearch },
          { label: 'Flagged',    value: counts.flagged,   color: 'text-amber-600',         icon: AlertTriangle },
          { label: 'Critical',   value: counts.critical,  color: 'text-red-600',           icon: AlertCircle },
          { label: 'Valid',      value: counts.valid,     color: 'text-emerald-600',       icon: ShieldCheck },
          { label: 'Pending',    value: counts.pending,   color: 'text-muted-foreground',  icon: Clock },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <div className={`flex items-center gap-1.5 ${color} mb-1`}>
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{label}</span>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Batch auto-fix prompt */}
      {flaggedCount > 0 && counts.scanned > 0 && !confirmBatchFix && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-none" />
            <span><strong>{flaggedCount}</strong> listings have issues — auto-fix can resolve most automatically.</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
            onClick={() => setConfirmBatchFix(true)}
          >
            <Wand2 className="w-3.5 h-3.5 mr-1.5" />
            Auto-Fix All
          </Button>
        </div>
      )}

      {confirmBatchFix && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-none" />
          <p className="text-sm text-amber-800 flex-1">
            This will reorder and de-duplicate images for all flagged listings. Approved listings are skipped. Continue?
          </p>
          <Button size="sm" onClick={handleBatchAutoFix} className="bg-amber-600 text-white hover:bg-amber-700">
            Confirm
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setConfirmBatchFix(false)}>Cancel</Button>
        </div>
      )}

      {/* Filter tabs + sort */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1 bg-muted rounded-lg p-1 flex-wrap">
          {FILTER_TABS.map(tab => {
            const count = tab.id === 'all'
              ? properties.length
              : tab.id === 'pending'
                ? counts.pending
                : (counts[tab.id === 'flagged' ? 'flagged' : tab.id] ?? 0);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setSortBy(s => s === 'score_asc' ? 'score_desc' : s === 'score_desc' ? 'name' : 'score_asc')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          {sortBy === 'score_asc' ? 'Score ↑' : sortBy === 'score_desc' ? 'Score ↓' : 'Name'}
        </button>
      </div>

      {/* Empty state */}
      {displayList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ImageOff className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-1">
            {counts.scanned === 0 ? 'No scan results yet' : 'No listings match this filter'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {counts.scanned === 0
              ? 'Click "Quick Scan" to analyze all property images using heuristic rules.'
              : 'Try a different filter tab.'}
          </p>
          {counts.scanned === 0 && (
            <Button onClick={runHeuristicScan} disabled={isRunning}>
              <ScanSearch className="w-4 h-4 mr-2" />
              Run Quick Scan
            </Button>
          )}
        </div>
      )}

      {/* Property list */}
      <div className="space-y-3">
        {displayList.map(({ property, result, status, score }) => {
          const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
          const StatusIcon = cfg.icon;
          const issueCount = result?.issues.length ?? 0;
          const imgCount   = property.images?.length ?? 0;

          return (
            <div
              key={property.id}
              className={`bg-card border rounded-xl overflow-hidden transition-all hover:shadow-md cursor-pointer group ${
                status === 'critical' ? 'border-red-200' : status === 'flagged' ? 'border-amber-200' : 'border-border'
              }`}
              onClick={() => setSelectedId(property.id)}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                <div className="relative flex-none w-20 h-14 rounded-lg overflow-hidden bg-muted">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">
                    {imgCount} img{imgCount !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-foreground leading-tight">{property.title}</p>
                    <StatusBadge status={status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                    {property.type} · {property.status === 'sale' ? 'Sale' : 'Rent'} · {property.city}
                    {result?.aiEnhanced && <span className="ml-2 text-violet-500 font-medium">· AI verified</span>}
                  </p>

                  {issueCount > 0 && (
                    <p className="text-xs text-amber-700 mt-1 truncate">
                      {result.issues[0]}
                      {issueCount > 1 && <span className="ml-1 text-muted-foreground">+{issueCount - 1} more</span>}
                    </p>
                  )}

                  {result && result.issues.length === 0 && (
                    <p className="text-xs text-emerald-600 mt-1">All images validated successfully</p>
                  )}
                </div>

                {/* Score + chevron */}
                <div className="flex items-center gap-3 flex-none">
                  {score >= 0 && <ScoreRing score={score} size={40} />}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>

              {/* Per-image mini strip */}
              {result && result.images.length > 0 && (
                <div className="flex gap-1 px-4 pb-3">
                  {result.images.map((img, i) => (
                    <div
                      key={i}
                      className={`relative flex-none h-1.5 rounded-full transition-all ${
                        img.score >= 80 ? 'bg-emerald-500'
                        : img.score >= 55 ? 'bg-amber-500'
                        : 'bg-red-500'
                      }`}
                      style={{ width: `${100 / result.images.length}%` }}
                      title={`Image ${i + 1}: ${img.score}/100`}
                    />
                  ))}
                </div>
              )}

              {/* Action row for flagged/critical */}
              {(status === 'flagged' || status === 'critical') && result && (
                <div className="flex gap-2 px-4 pb-3" onClick={e => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                    onClick={(e) => { e.stopPropagation(); approveResult(property.id); }}
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Approve
                  </Button>
                  {result.issues.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs text-purple-700 border-purple-200 hover:bg-purple-50"
                      onClick={(e) => { e.stopPropagation(); applyAutoFix(property.id); }}
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      Auto-Fix
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail sheet */}
      {selectedId && (
        <PropertyDetailSheet
          property={selectedProperty}
          result={selectedResult}
          onClose={() => setSelectedId(null)}
          onApprove={() => approveResult(selectedId)}
          onReject={() => setSelectedId(null)}
          onFix={() => applyAutoFix(selectedId)}
          onRevalidate={(useAI) => revalidateProperty(selectedId, useAI)}
        />
      )}
    </div>
  );
}
