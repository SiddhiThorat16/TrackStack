// C:/Labmentix Projects/Project-Management-App/TrackStack/client/src/components/TicketFilters.jsx

import { useState, useEffect, useCallback } from 'react';

const STATUSES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function TicketFilters({ onFiltersChange }) {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: '',
    search: ''
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  // Notify parent on filter change
  useEffect(() => {
    onFiltersChange({
      status: filters.status,
      priority: filters.priority,
      assignee: filters.assignee,
      search: debouncedSearch
    });
  }, [filters.status, filters.priority, filters.assignee, debouncedSearch]);

  const clearFilters = () => {
    setFilters({ status: '', priority: '', assignee: '', search: '' });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 mb-8">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select 
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 w-44"
          >
            <option value="">All Status</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
          <select 
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 w-44"
          >
            <option value="">All Priority</option>
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[300px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Clear Button */}
        <button
          onClick={clearFilters}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
        >
          Clear Filters
        </button>
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
        {filters.status && (
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-xl">
            Status: {filters.status.replace('_', ' ')} ×
          </span>
        )}
        {filters.priority && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-xl">
            Priority: {filters.priority} ×
          </span>
        )}
        {filters.search && (
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-xl">
            "{filters.search}" ×
          </span>
        )}
      </div>
    </div>
  );
}
