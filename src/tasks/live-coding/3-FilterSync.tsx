import React from "react";
import { useSearchParams, Link } from "react-router-dom";

/**
 * Задача 3: useFilterSync (Custom Hooks & URL)
 *
 * Реализовать кастомный хук, который синхронизирует состояние фильтров (объект)
 * с URL-параметрами.
 */

const useFilterSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Извлечь параметры из URL в объект
  // 2. Реализовать updateFilters(newFilters)

  const filters = {}; // Твоё решение
  const updateFilters = (newFilters: Record<string, string>) => {}; // Твоё решение

  return [filters, updateFilters] as const;
};

const FilterSyncTask = () => {
  const [filters, updateFilters] = useFilterSync();

  return (
    <div className="container">
      <Link to="/" className="back-link">
        На главную
      </Link>
      <h2>Filter Sync</h2>
      <p className="task-description">Синхронизация стейта фильтров с URL.</p>
      <div style={{ marginBottom: "20px" }}>
        <label>Category</label>
        <input
          value={(filters as any).category || ""}
          onChange={(e) => updateFilters({ category: e.target.value })}
          placeholder="Enter category..."
        />

        <label>Sort Order</label>
        <select
          value={(filters as any).sort || ""}
          onChange={(e) => updateFilters({ sort: e.target.value })}
        >
          <option value="">None</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div>
        <strong>Current filters in URL:</strong>
        <pre>{JSON.stringify(filters, null, 2)}</pre>
      </div>
    </div>
  );
};

export default FilterSyncTask;
