import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Задача 1: Smart Search (Debounce & Race Condition)
 *
 * 1. Реализовать поиск с debounce (300ms)
 * 2. Обработать отмену предыдущего запроса (AbortController)
 * 3. Добавить оптимистичный лайк (useOptimistic из React 19)
 *
 * API Mock:
 * mockSearchApi(query, signal) -> Promise<SearchResult[]>
 * mockLikeApi(id) -> Promise<void>
 */

const SmartSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  // Твоё решение здесь

  return (
    <div className="container">
      <Link to="/" className="back-link">
        На главную
      </Link>
      <h2>Smart Search</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <div className="list">
        {results.map((item) => (
          <div key={item.id} className="list-item">
            <span>{item.title}</span>
            <button
              onClick={() => {
                /* handleLike */
              }}
            >
              {item.likes} likes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mock API implementations for the candidate
const mockSearchApi = async (
  query: string,
  signal?: AbortSignal
): Promise<SearchResult[]> => {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
  if (signal?.aborted) throw new Error("AbortError");
  return [
    { id: 1, title: `Result for ${query} 1`, likes: 10 },
    { id: 2, title: `Result for ${query} 2`, likes: 5 },
  ];
};

const mockLikeApi = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Liked ${id}`);
};

interface SearchResult {
  id: number;
  title: string;
  likes: number;
}

export default SmartSearch;
