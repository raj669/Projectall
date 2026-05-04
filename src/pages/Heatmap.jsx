import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAdminData } from '@/lib/AdminDataContext';
import { getHeatmapData, getPropertyCoordinates } from '@/lib/propertyCoordinates';
import HeatLayer from '@/components/heatmap/HeatLayer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Flame, Map, Layers, Building2, Home, TreePine,
  Store, Star, X, SlidersHorizontal, TrendingUp,
  MapPin, DollarSign, Eye, ChevronDown, RefreshCw,
  LayoutGrid, Info,
} from 'lucide-react';

// ─── Fix Leaflet default marker icons broken by Vite's asset pipeline ────────
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       markerIconPng,
  iconRetinaUrl: markerIcon2x,
  shadowUrl:     markerShadow,
});

// ─── Constants ────────────────────────────────────────────────────────────────

const NEPAL_CENTER = [27.9, 84.1];
const NEPAL_ZOOM = 8;

const TRANSACTION_FILTERS = [
  { id: 'all',  label: 'All',  color: 'bg-primary' },
  { id: 'sale', label: 'Buy',  color: 'bg-emerald-500' },
  { id: 'rent', label: 'Rent', color: 'bg-blue-500' },
];

const TYPE_FILTERS = [
  { id: 'all',        label: 'All Types',   icon: LayoutGrid },
  { id: 'apartment',  label: 'Apartment',   icon: Building2 },
  { id: 'house',      label: 'House',       icon: Home },
  { id: 'land',       label: 'Land',        icon: TreePine },
  { id: 'commercial', label: 'Commercial',  icon: Store },
  { id: 'villa',      label: 'Villa',       icon: Star },
];

const WEIGHT_OPTIONS = [
  { id: 'count',  label: 'Density'  },
  { id: 'price',  label: 'Price'    },
  { id: 'views',  label: 'Activity' },
];

const VIEW_MODES = [
  { id: 'heat',     label: 'Heatmap',  icon: Flame },
  { id: 'markers',  label: 'Markers',  icon: MapPin },
];

// Property-type colour for markers
const TYPE_COLORS = {
  apartment:  '#3b82f6',
  house:      '#22c55e',
  land:       '#f59e0b',
  commercial: '#ef4444',
  villa:      '#a855f7',
};

function createColoredIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:14px; height:14px; border-radius:50%;
      background:${color}; border:2px solid #fff;
      box-shadow:0 1px 4px rgba(0,0,0,.5);
    "></div>`,
    iconSize:   [14, 14],
    iconAnchor: [7, 7],
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: onMapClick });
  return null;
}

function MarkerLayer({ properties }) {
  const navigate = useNavigate();
  return properties.map(p => {
    const { lat, lng } = getPropertyCoordinates(p);
    const color = TYPE_COLORS[p.type] || '#6b7280';
    const icon = createColoredIcon(color);
    return (
      <Marker key={p.id} position={[lat, lng]} icon={icon}>
        <Popup className="heatmap-popup" minWidth={200}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/properties/${p.id}`)}
            onKeyDown={e => e.key === 'Enter' && navigate(`/properties/${p.id}`)}
            style={{ cursor: 'pointer' }}
            className="group p-1"
          >
            {/* Thumbnail */}
            {p.images?.[0] && (
              <div className="overflow-hidden rounded-md mb-2 -mx-1 -mt-1">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }}
                  className="group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            )}

            <p className="font-semibold text-sm leading-tight mb-1 group-hover:text-blue-600 transition-colors">
              {p.title}
            </p>
            <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
              <MapPin className="inline w-3 h-3" />
              {p.city}
            </p>
            <div className="flex gap-1.5 flex-wrap mb-2">
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 capitalize">{p.type}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 capitalize">{p.status === 'sale' ? 'Buy' : 'Rent'}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900">
                {p.status === 'rent'
                  ? `NPR ${p.price?.toLocaleString()}/mo`
                  : `NPR ${p.price?.toLocaleString()}`}
              </p>
              <span className="text-xs text-blue-600 font-medium group-hover:underline">
                View &rarr;
              </span>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Heatmap() {
  const { properties } = useAdminData();

  const [transaction, setTransaction] = useState('all');
  const [propType,    setPropType]    = useState('all');
  const [weightBy,    setWeightBy]    = useState('count');
  const [viewMode,    setViewMode]    = useState('heat');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // Re-stamp on every properties change so the user sees "live" refresh
  useEffect(() => { setLastUpdated(Date.now()); }, [properties]);

  const { points, properties: filtered, stats } = useMemo(() => {
    return getHeatmapData(properties, { transaction, propertyType: propType, weightBy });
  }, [properties, transaction, propType, weightBy]);

  const formatNPR = (n) => {
    if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)} Cr`;
    if (n >= 100_000)    return `${(n / 100_000).toFixed(1)} L`;
    return `${n?.toLocaleString()}`;
  };

  const activeFilterCount = [
    transaction !== 'all',
    propType    !== 'all',
    weightBy    !== 'count',
  ].filter(Boolean).length;

  const resetFilters = useCallback(() => {
    setTransaction('all');
    setPropType('all');
    setWeightBy('count');
  }, []);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* ── Top control bar ─────────────────────────────────────────────── */}
      <div className="flex-none border-b border-border bg-card/90 backdrop-blur-sm px-4 py-2 flex items-center gap-3 flex-wrap z-10">

        {/* Title */}
        <div className="flex items-center gap-2 mr-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="font-semibold text-sm hidden sm:block">Property Heatmap</span>
        </div>

        {/* Transaction toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {TRANSACTION_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setTransaction(f.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                transaction === f.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {TYPE_FILTERS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPropType(id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                propType === id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Weight selector */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="hidden sm:block">Weight:</span>
          <div className="flex gap-0.5">
            {WEIGHT_OPTIONS.map(w => (
              <button
                key={w.id}
                onClick={() => setWeightBy(w.id)}
                className={`px-2 py-0.5 rounded text-xs transition-all ${
                  weightBy === w.id
                    ? 'bg-orange-500 text-white'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {VIEW_MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setViewMode(id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>

        {/* Reset */}
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* ── Map area ────────────────────────────────────────────────────── */}
      <div className="flex-1 relative">
        <MapContainer
          center={NEPAL_CENTER}
          zoom={NEPAL_ZOOM}
          className="w-full h-full"
          zoomControl={true}
          scrollWheelZoom={true}
        >
          {/* Tile layer — CartoDB Positron for a clean modern look */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />

          {viewMode === 'heat' && points.length > 0 && (
            <HeatLayer
              key={`${transaction}-${propType}-${weightBy}`}
              points={points}
            />
          )}

          {viewMode === 'markers' && (
            <MarkerLayer properties={filtered} />
          )}
        </MapContainer>

        {/* ── Floating stats card (top-right) ─────────────────────────── */}
        <div className="absolute top-3 right-3 z-[1000] w-52 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-primary" />
              Live Stats
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
              Live
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <StatBox
              icon={<Building2 className="w-3.5 h-3.5 text-blue-500" />}
              label="Properties"
              value={stats.total.toLocaleString()}
            />
            <StatBox
              icon={<DollarSign className="w-3.5 h-3.5 text-emerald-500" />}
              label="Avg Price"
              value={stats.avgPrice ? `₨${formatNPR(stats.avgPrice)}` : '—'}
            />
            <StatBox
              icon={<MapPin className="w-3.5 h-3.5 text-orange-500" />}
              label="Top Area"
              value={stats.topCity || '—'}
            />
            <StatBox
              icon={<Flame className="w-3.5 h-3.5 text-red-500" />}
              label="Heat pts"
              value={points.length.toLocaleString()}
            />
          </div>

          {/* Mini city breakdown */}
          {Object.keys(stats.cityBreakdown || {}).length > 0 && (
            <div className="border-t border-border pt-2">
              <p className="text-[10px] text-muted-foreground mb-1.5">Distribution</p>
              <div className="space-y-1">
                {Object.entries(stats.cityBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([city, count]) => {
                    const pct = Math.round((count / stats.total) * 100);
                    return (
                      <div key={city} className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground w-16 truncate">{city}</span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/70 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-5 text-right">{count}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* ── Heatmap legend (bottom-left) ─────────────────────────────── */}
        {viewMode === 'heat' && (
          <div className="absolute bottom-8 left-3 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg p-3">
            <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Intensity
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">Low</span>
              <div
                className="w-24 h-3 rounded-full"
                style={{
                  background: 'linear-gradient(to right, #3b82f6, #06b6d4, #84cc16, #f59e0b, #ef4444)',
                }}
              />
              <span className="text-[10px] text-muted-foreground">High</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 capitalize">
              Weighted by: <strong>{weightBy}</strong>
            </p>
          </div>
        )}

        {/* ── Marker legend (bottom-left) ──────────────────────────────── */}
        {viewMode === 'markers' && (
          <div className="absolute bottom-8 left-3 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg p-3 space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Property Type
            </p>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm flex-none"
                  style={{ background: color }}
                />
                <span className="text-[11px] text-muted-foreground capitalize">{type}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {filtered.length === 0 && (
          <div className="absolute inset-0 z-[999] flex items-center justify-center pointer-events-none">
            <div className="bg-card/95 backdrop-blur-sm border border-border rounded-2xl shadow-xl p-8 text-center max-w-xs mx-4 pointer-events-auto">
              <Flame className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No properties match</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting the filters above to see properties on the map.
              </p>
              <Button size="sm" variant="outline" onClick={resetFilters}>
                <X className="w-3.5 h-3.5 mr-1.5" />
                Clear filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Small stat box helper
function StatBox({ icon, label, value }) {
  return (
    <div className="bg-muted/50 rounded-lg p-2">
      <div className="flex items-center gap-1 mb-0.5">
        {icon}
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-bold text-foreground leading-tight">{value}</p>
    </div>
  );
}
