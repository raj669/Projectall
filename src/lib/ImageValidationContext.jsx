import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  validateAllHeuristic,
  validateAllWithAI,
  validatePropertyHeuristic,
  validatePropertyWithAI,
  computeAutoFix,
} from '@/lib/imageValidationService';
import { useAdminData } from '@/lib/AdminDataContext';

const STORAGE_KEY = 'nepal_estates_img_validation_v1';

const ImageValidationContext = createContext(null);

function loadResults() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : {};
  } catch { return {}; }
}

function saveResults(results) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(results)); } catch { /**/ }
}

export function ImageValidationProvider({ children }) {
  const { properties, updateProperty } = useAdminData();

  // results: { [propertyId]: ValidationResult }
  const [results, setResults] = useState(loadResults);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(null); // { current, total, propertyTitle }
  const [error, setError] = useState(null);

  // Persist results to localStorage whenever they change
  useEffect(() => { saveResults(results); }, [results]);

  const setResult = useCallback((result) => {
    setResults(prev => ({ ...prev, [result.propertyId]: result }));
  }, []);

  // ── Run heuristic scan across all properties ────────────────────────────────
  const runHeuristicScan = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setProgress({ current: 0, total: properties.length, propertyTitle: '' });
    try {
      const all = await validateAllHeuristic(properties);
      const map = {};
      all.forEach(r => { map[r.propertyId] = r; });
      setResults(map);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsRunning(false);
      setProgress(null);
    }
  }, [properties]);

  // ── Run AI scan across all properties (requires API key) ───────────────────
  const runAIScan = useCallback(async () => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      setError('VITE_ANTHROPIC_API_KEY is not set. Configure it in your .env file.');
      return;
    }
    setIsRunning(true);
    setError(null);
    try {
      await validateAllWithAI(properties, (p) => {
        setProgress(p);
      });
      // Individual results are set via setResult inside validateAllWithAI
      // but since it's an async map, we collect them after:
      const all = await validateAllWithAI(properties, (p) => setProgress(p));
      const map = {};
      all.forEach(r => { map[r.propertyId] = r; });
      setResults(map);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsRunning(false);
      setProgress(null);
    }
  }, [properties]);

  // ── Re-validate a single property ──────────────────────────────────────────
  const revalidateProperty = useCallback(async (propertyId, useAI = false) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    setError(null);
    try {
      let result;
      if (useAI) {
        const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
        if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY not configured');
        result = await validatePropertyWithAI(property, properties);
      } else {
        result = validatePropertyHeuristic(property, properties);
      }
      setResult(result);
      return result;
    } catch (e) {
      setError(e.message);
    }
  }, [properties, setResult]);

  // ── Admin approve ───────────────────────────────────────────────────────────
  const approveResult = useCallback((propertyId, note = '') => {
    setResults(prev => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        status:      'approved',
        adminAction: 'approved',
        adminNote:   note,
      },
    }));
  }, []);

  // ── Admin reject (re-flag) ──────────────────────────────────────────────────
  const rejectResult = useCallback((propertyId, note = '') => {
    setResults(prev => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        status:      'flagged',
        adminAction: 'rejected',
        adminNote:   note,
      },
    }));
  }, []);

  // ── Apply auto-fix to a property ────────────────────────────────────────────
  const applyAutoFix = useCallback((propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    const result   = results[propertyId];
    if (!property || !result) return;

    const fixedImages = computeAutoFix(property, result);
    updateProperty(propertyId, { images: fixedImages });

    setResults(prev => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        status:      'auto_fixed',
        adminAction: 'auto_fixed',
        adminNote:   `Auto-fixed: ${prev[propertyId]?.images?.length ?? 0} → ${fixedImages.length} images`,
      },
    }));
  }, [properties, results, updateProperty]);

  // ── Dismiss error ───────────────────────────────────────────────────────────
  const clearError = useCallback(() => setError(null), []);

  // ── Derived counts ──────────────────────────────────────────────────────────
  const counts = {
    total:     properties.length,
    scanned:   Object.keys(results).length,
    flagged:   Object.values(results).filter(r => r.status === 'flagged' || r.status === 'critical').length,
    critical:  Object.values(results).filter(r => r.status === 'critical').length,
    valid:     Object.values(results).filter(r => r.status === 'valid').length,
    approved:  Object.values(results).filter(r => r.status === 'approved').length,
    autoFixed: Object.values(results).filter(r => r.status === 'auto_fixed').length,
    pending:   properties.length - Object.keys(results).length,
  };

  const hasApiKey = Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY);

  return (
    <ImageValidationContext.Provider value={{
      results,
      isRunning,
      progress,
      error,
      counts,
      hasApiKey,
      runHeuristicScan,
      runAIScan,
      revalidateProperty,
      approveResult,
      rejectResult,
      applyAutoFix,
      clearError,
    }}>
      {children}
    </ImageValidationContext.Provider>
  );
}

export function useImageValidation() {
  const ctx = useContext(ImageValidationContext);
  if (!ctx) throw new Error('useImageValidation must be used within ImageValidationProvider');
  return ctx;
}
