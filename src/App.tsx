import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SmartSearch from "./tasks/live-coding/1-SmartSearch";
import VirtualListTask from "./tasks/live-coding/2-VirtualList";
import FilterSyncTask from "./tasks/live-coding/3-FilterSync";

const Dashboard = () => {
  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem("completedTasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [isTipsExpanded, setIsTipsExpanded] = useState(() => {
    const saved = localStorage.getItem("isTipsExpanded");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem("isTipsExpanded", JSON.stringify(isTipsExpanded));
  }, [isTipsExpanded]);

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const isCompleted = (id: string) => completedTasks.includes(id);

  return (
    <div className="container">
      <h1>Senior Frontend Interview 2026</h1>
      <p className="subtitle">
        Компания <strong>"Лучи"</strong>
      </p>
      <p>
        Добро пожаловать в репозиторий для интервью. Рекомендуется выполнять
        задания в указанном порядке, но вы можете переключаться между ними:
      </p>

      <section className={`card tips ${!isTipsExpanded ? "collapsed" : ""}`}>
        <h3
          onClick={() => setIsTipsExpanded(!isTipsExpanded)}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <span>💡 Советы для кандидата</span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.8em",
              transition: "transform 0.2s",
              transform: isTipsExpanded ? "rotate(0deg)" : "rotate(-90deg)",
            }}
          >
            ▼
          </span>
        </h3>
        {isTipsExpanded && (
          <ul>
            <li>
              <strong>Архитектура и чистота:</strong> Мы ценим читаемый код,
              грамотное разделение ответственности и использование TypeScript
              для проектирования надежных интерфейсов.
            </li>
            <li>
              <strong>Проектирование стейта:</strong> Стремитесь к минимально
              необходимому и предсказуемому состоянию. Избегайте избыточности и
              сложных синхронизаций.
            </li>
            <li>
              <strong>Производительность:</strong> Думайте о ресурсах устройства
              и сложности алгоритмов. Хорошее решение эффективно как по памяти,
              так и по количеству ререндеров.
            </li>
            <li>
              <strong>Обработка граничных случаев:</strong> Уделяйте внимание
              обработке ошибок, состояниям загрузки и поведению системы при
              нетипичных действиях пользователя.
            </li>
            <li>
              <strong>Современные стандарты:</strong> Используйте актуальные
              возможности платформы и фреймворка для создания чистого и
              эффективного кода.
            </li>
          </ul>
        )}
      </section>

      <div className="grid">
        <section className={`card ${isCompleted("algos") ? "completed" : ""}`}>
          <label className="checklist-item">
            <input
              type="checkbox"
              checked={isCompleted("algos")}
              onChange={() => toggleTask("algos")}
            />
            <h3>0. Алгоритмические задачи</h3>
          </label>
          <p>
            Сначала необходимо решить задачи в{" "}
            <code>src/tasks/algorithms/</code> и проверить их, запустив{" "}
            <code>npm run test</code>.
          </p>
          <ul className="checklist">
            <li
              className={`checklist-item ${
                isCompleted("algo-1") ? "completed" : ""
              }`}
            >
              <label className="checklist-label">
                <input
                  type="checkbox"
                  checked={isCompleted("algo-1")}
                  onChange={() => toggleTask("algo-1")}
                />
                <span>1. Репка (Рекурсия и аккумуляция)</span>
              </label>
            </li>
            <li
              className={`checklist-item ${
                isCompleted("algo-2") ? "completed" : ""
              }`}
            >
              <label className="checklist-label">
                <input
                  type="checkbox"
                  checked={isCompleted("algo-2")}
                  onChange={() => toggleTask("algo-2")}
                />
                <span>2. Теремок (Стратегия LRU Cache)</span>
              </label>
            </li>
            <li
              className={`checklist-item ${
                isCompleted("algo-3") ? "completed" : ""
              }`}
            >
              <label className="checklist-label">
                <input
                  type="checkbox"
                  checked={isCompleted("algo-3")}
                  onChange={() => toggleTask("algo-3")}
                />
                <span>3. Колобок (Поиск циклов в графе)</span>
              </label>
            </li>
          </ul>
        </section>

        <section className={`card ${isCompleted("search") ? "completed" : ""}`}>
          <label className="checklist-item">
            <input
              type="checkbox"
              checked={isCompleted("search")}
              onChange={() => toggleTask("search")}
            />
            <h3>1. Smart Search</h3>
          </label>
          <p>Debounce, AbortController, React 19 useOptimistic.</p>
          <Link to="/search">Перейти к задаче</Link>
        </section>

        <section
          className={`card ${isCompleted("virtual") ? "completed" : ""}`}
        >
          <label className="checklist-item">
            <input
              type="checkbox"
              checked={isCompleted("virtual")}
              onChange={() => toggleTask("virtual")}
            />
            <h3>2. Virtual List</h3>
          </label>
          <p>Оптимизация рендеринга больших списков.</p>
          <Link to="/virtual-list">Перейти к задаче</Link>
        </section>

        <section className={`card ${isCompleted("filter") ? "completed" : ""}`}>
          <label className="checklist-item">
            <input
              type="checkbox"
              checked={isCompleted("filter")}
              onChange={() => toggleTask("filter")}
            />
            <h3>3. Filter Sync</h3>
          </label>
          <p>Синхронизация стейта фильтров с URL.</p>
          <Link to="/filter-sync">Перейти к задаче</Link>
        </section>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/search" element={<SmartSearch />} />
        <Route path="/virtual-list" element={<VirtualListTask />} />
        <Route path="/filter-sync" element={<FilterSyncTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
