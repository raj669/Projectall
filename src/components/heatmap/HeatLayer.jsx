import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// Gradient that maps intensity 0→1 to a blue→cyan→green→yellow→red spectrum
const DEFAULT_GRADIENT = {
  0.2: '#3b82f6', // blue
  0.4: '#06b6d4', // cyan
  0.6: '#84cc16', // lime
  0.8: '#f59e0b', // amber
  1.0: '#ef4444', // red
};

/**
 * Renders a canvas heat layer on the parent MapContainer.
 * points = [[lat, lng, weight?], ...]  (weight 0–1, default 1)
 */
export default function HeatLayer({ points = [], options = {} }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    let cancelled = false;

    async function mount() {
      // leaflet.heat attaches L.heatLayer to the Leaflet namespace on import
      await import('leaflet.heat');
      if (cancelled) return;

      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }

      if (points.length === 0) return;

      layerRef.current = L.heatLayer(points, {
        radius:  35,
        blur:    25,
        maxZoom: 17,
        max:     1.0,
        gradient: DEFAULT_GRADIENT,
        ...options,
      }).addTo(map);
    }

    mount();

    return () => {
      cancelled = true;
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, points, options]);

  return null;
}
