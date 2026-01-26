import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Задача 2: Virtual List (Performance)
 *
 * Реализовать базовый механизм виртуализации для списка элементов с фиксированной высотой строки.
 * На экране должны рендериться только те элементы, которые попадают в видимую область.
 */

interface VirtualListProps {
  items: string[];
  itemHeight: number;
  containerHeight: number;
}

const VirtualList: React.FC<VirtualListProps> = ({
  items,
  itemHeight,
  containerHeight,
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  // TODO: Вычислить startIndex, endIndex и visibleItems
  // TODO: Рассчитать смещение для контейнера элементов

  return (
    <div
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      style={{
        height: containerHeight,
        overflowY: "auto",
        position: "relative",
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        backgroundColor: "var(--card-bg)",
      }}
    >
      {/* Твоё решение здесь */}
      <div style={{ padding: "20px" }}>
        Scroll me! (Current items: {items.length})
      </div>
    </div>
  );
};

// Обертка для демонстрации
const VirtualListTask = () => {
  const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

  return (
    <div className="container">
      <Link to="/" className="back-link">
        На главную
      </Link>
      <h2>Virtual List</h2>
      <p className="task-description">Оптимизация рендеринга больших списков.</p>
      <VirtualList items={items} itemHeight={40} containerHeight={400} />
    </div>
  );
};

export default VirtualListTask;
