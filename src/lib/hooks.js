import { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

/**
 * Hook for handling common API errors
 */
export const useErrorHandler = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return useCallback((error) => {
    if (!error) return;

    if (error.status === 401 || error.status === 403) {
      logout(true);
      navigate('/');
      return;
    }

    if (error.status === 404) {
      console.warn('Resource not found:', error);
    }

    if (error.status >= 500) {
      console.error('Server error:', error);
    }
  }, [navigate, logout]);
};

/**
 * Hook for checking user permissions
 */
export const usePermission = (requiredRole) => {
  const { user } = useAuth();
  return useCallback(() => {
    if (!user) return false;
    if (!requiredRole) return true;
    return user.role === requiredRole || user.role === 'admin';
  }, [user, requiredRole]);
};

/**
 * Hook for checking if user is admin
 */
export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'admin';
};

/**
 * Hook for handling async operations with loading and error states
 */
export const useAsync = (callback, immediate = true) => {
  const [state, setState] = useState({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await callback();
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, [callback]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
};

/**
 * Hook for debounced search
 */
export const useDebouncedSearch = (searchFn, delay = 500) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 0) {
        setLoading(true);
        try {
          const data = await searchFn(query);
          setResults(data);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, searchFn, delay]);

  return { query, setQuery, results, loading };
};

/**
 * Hook for pagination
 */
export const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
    itemsPerPage,
  };
};

/**
 * Hook for local storage state
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};
