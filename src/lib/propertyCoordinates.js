// Coordinate lookup for Nepal properties — used to generate heatmap data
// All coordinates are approximate centers of neighborhoods/cities

const COORDS = {
  // ─── Kathmandu neighborhoods ───────────────────────────────────────────────
  thamel:         { lat: 27.7167, lng: 85.3125 },
  lazimpat:       { lat: 27.7189, lng: 85.3185 },
  naxal:          { lat: 27.7167, lng: 85.3280 },
  battisputali:   { lat: 27.7028, lng: 85.3411 },
  koteshwor:      { lat: 27.6727, lng: 85.3469 },
  chabahil:       { lat: 27.7222, lng: 85.3556 },
  baluwatar:      { lat: 27.7200, lng: 85.3300 },
  baneshwor:      { lat: 27.6939, lng: 85.3356 },
  'new baneshwor':{ lat: 27.6939, lng: 85.3356 },
  'new road':     { lat: 27.7031, lng: 85.3144 },
  kalanki:        { lat: 27.6944, lng: 85.2808 },
  suryabinayak:   { lat: 27.6683, lng: 85.4203 },
  boudha:         { lat: 27.7215, lng: 85.3620 },
  kirtipur:       { lat: 27.6773, lng: 85.2790 },
  budhanilkantha: { lat: 27.7750, lng: 85.3656 },
  gongabu:        { lat: 27.7356, lng: 85.2989 },
  kalanki:        { lat: 27.6944, lng: 85.2808 },
  thankot:        { lat: 27.6908, lng: 85.2253 },
  mahalaxmisthan: { lat: 27.6597, lng: 85.3011 },

  // ─── Lalitpur / Patan ──────────────────────────────────────────────────────
  pulchowk:       { lat: 27.6788, lng: 85.3196 },
  jawalakhel:     { lat: 27.6764, lng: 85.3147 },
  sanepa:         { lat: 27.6850, lng: 85.3100 },
  kupondole:      { lat: 27.6836, lng: 85.3119 },
  patan:          { lat: 27.6688, lng: 85.3244 },
  'mangal bazar': { lat: 27.6710, lng: 85.3250 },
  mangalbazar:    { lat: 27.6710, lng: 85.3250 },
  satdobato:      { lat: 27.6444, lng: 85.3117 },
  imadol:         { lat: 27.6622, lng: 85.3511 },

  // ─── Bhaktapur ────────────────────────────────────────────────────────────
  suryamadhi:     { lat: 27.6780, lng: 85.4350 },
  dattatraya:     { lat: 27.6723, lng: 85.4330 },
  'taumadhi tol': { lat: 27.6710, lng: 85.4298 },
  bhaktapur:      { lat: 27.6726, lng: 85.4298 },

  // ─── Pokhara ──────────────────────────────────────────────────────────────
  lakeside:       { lat: 28.2096, lng: 83.9550 },
  baidam:         { lat: 28.2096, lng: 83.9550 },
  chipledhunga:   { lat: 28.2380, lng: 83.9956 },
  bagar:          { lat: 28.2340, lng: 83.9900 },
  phewa:          { lat: 28.2080, lng: 83.9500 },
  'fewa lake':    { lat: 28.2080, lng: 83.9500 },
  'new pokhara':  { lat: 28.2380, lng: 83.9890 },

  // ─── Major cities ─────────────────────────────────────────────────────────
  kathmandu:      { lat: 27.7172, lng: 85.3240 },
  lalitpur:       { lat: 27.6644, lng: 85.3188 },
  pokhara:        { lat: 28.2096, lng: 83.9856 },
  chitwan:        { lat: 27.5291, lng: 84.3542 },
  bharatpur:      { lat: 27.6833, lng: 84.4333 },
  butwal:         { lat: 27.7003, lng: 83.4484 },
  birgunj:        { lat: 27.0167, lng: 84.8833 },
  biratnagar:     { lat: 26.4524, lng: 87.2732 },
  dharan:         { lat: 26.8167, lng: 87.2833 },
  itahari:        { lat: 26.6667, lng: 87.2833 },
  bhairahawa:     { lat: 27.5167, lng: 83.4500 },
  dhulikhel:      { lat: 27.6255, lng: 85.5467 },
  tansen:         { lat: 27.8667, lng: 83.5500 },
  palpa:          { lat: 27.8667, lng: 83.5500 },
  lumbini:        { lat: 27.4667, lng: 83.2833 },
  damak:          { lat: 26.6558, lng: 87.7010 },
  dhangadhi:      { lat: 28.6919, lng: 80.5944 },
  nepalgunj:      { lat: 28.0500, lng: 81.6167 },
  janakpur:       { lat: 26.7288, lng: 85.9268 },
  hetauda:        { lat: 27.4167, lng: 85.0333 },
};

// Deterministic offset so the same property always gets the same coordinate
function seededOffset(seed, scale) {
  const a = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  const b = Math.sin(seed * 269.5 + 183.3) * 43758.5453;
  return {
    dLat: (a - Math.floor(a) - 0.5) * scale,
    dLng: (b - Math.floor(b) - 0.5) * scale,
  };
}

function idToSeed(id) {
  return String(id)
    .split('')
    .reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0);
}

/** Returns { lat, lng } for a property, derived from address/city with small variation. */
export function getPropertyCoordinates(property) {
  const address  = (property.address  || '').toLowerCase();
  const city     = (property.city     || '').toLowerCase();
  const district = (property.district || '').toLowerCase();
  const seed = idToSeed(property.id || '');

  // Most-specific match first: address keyword
  for (const [key, base] of Object.entries(COORDS)) {
    if (address.includes(key)) {
      const { dLat, dLng } = seededOffset(seed, 0.003);
      return { lat: base.lat + dLat, lng: base.lng + dLng };
    }
  }

  // City match
  const cityBase = COORDS[city];
  if (cityBase) {
    const { dLat, dLng } = seededOffset(seed, 0.008);
    return { lat: cityBase.lat + dLat, lng: cityBase.lng + dLng };
  }

  // District match
  const distBase = COORDS[district];
  if (distBase) {
    const { dLat, dLng } = seededOffset(seed, 0.010);
    return { lat: distBase.lat + dLat, lng: distBase.lng + dLng };
  }

  // Fallback: scatter around Kathmandu valley
  const { dLat, dLng } = seededOffset(seed, 0.05);
  return { lat: 27.7172 + dLat, lng: 85.3240 + dLng };
}

/**
 * Transform an array of properties into leaflet.heat point format.
 * Returns [[lat, lng, weight], ...]
 */
export function toHeatPoints(properties, weightBy = 'count') {
  const MAX_PRICE = 50_000_000; // 5 crore NPR — adjust if needed
  const MAX_VIEWS = 800;

  return properties.map(p => {
    const { lat, lng } = getPropertyCoordinates(p);

    let weight = 0.5;
    if (weightBy === 'price') {
      weight = 0.2 + Math.min((p.price || 0) / MAX_PRICE, 1) * 0.8;
    } else if (weightBy === 'views') {
      weight = 0.2 + Math.min((p.views || 0) / MAX_VIEWS, 1) * 0.8;
    }

    return [lat, lng, weight];
  });
}

/** Heatmap API — filters properties and returns formatted data. */
export function getHeatmapData(properties, filters = {}) {
  let filtered = [...properties];

  // Filter by transaction type
  if (filters.transaction && filters.transaction !== 'all') {
    filtered = filtered.filter(p => p.status === filters.transaction);
  }

  // Filter by property type
  if (filters.propertyType && filters.propertyType !== 'all') {
    filtered = filtered.filter(p => p.type === filters.propertyType);
  }

  // Exclude removed/deleted
  filtered = filtered.filter(p => p.admin_status !== 'Deleted');

  const points = toHeatPoints(filtered, filters.weightBy || 'count');
  const prices = filtered.map(p => p.price || 0).filter(Boolean);
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

  // City breakdown for stats
  const cityCount = {};
  filtered.forEach(p => {
    const c = p.city || 'Unknown';
    cityCount[c] = (cityCount[c] || 0) + 1;
  });
  const topCity = Object.entries(cityCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  return {
    points,
    properties: filtered,
    stats: {
      total: filtered.length,
      avgPrice,
      topCity,
      cityBreakdown: cityCount,
    },
  };
}
