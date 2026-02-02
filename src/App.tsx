import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SmartSearch from "./tasks/live-coding/1-SmartSearch";
import VirtualListTask from "./tasks/live-coding/2-VirtualList";
import FilterSyncTask from "./tasks/live-coding/3-FilterSync";

const Dashboard = () => {
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem("interviewStep");
    return saved ? parseInt(saved, 10) : 1;
  });

  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem("completedTasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [isTipsExpanded, setIsTipsExpanded] = useState(() => {
    const saved = localStorage.getItem("isTipsExpanded");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("interviewStep", step.toString());
  }, [step]);

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

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="container">
      <h1>Senior Frontend Interview 2026</h1>
      <p className="subtitle">
        Компания <strong>"Лучи"</strong>
      </p>

      <div className="steps-indicator">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`step-dot ${step === s ? "active" : ""} ${
              step > s ? "completed" : ""
            }`}
            onClick={() => setStep(s)}
          >
            {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="step-content">
          <h2>Шаг 1: Приветствие</h2>
          <p>
            Добро пожаловать в репозиторий для интервью на позицию "Senior
            Frontend Разработчик". Рекомендуется выполнять задания в указанном
            порядке, но вы можете переключаться между ними. Также, не забудьте
            ознакомиться с советами. Удачи!
          </p>

          <section
            className={`card tips ${!isTipsExpanded ? "collapsed" : ""}`}
          >
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
                  грамотное разделение ответственности и использование
                  TypeScript для проектирования надежных интерфейсов.
                </li>
                <li>
                  <strong>Проектирование стейта:</strong> Стремитесь к
                  минимально необходимому и предсказуемому состоянию. Избегайте
                  избыточности и сложных синхронизаций.
                </li>
                <li>
                  <strong>Производительность:</strong> Думайте о ресурсах
                  устройства и сложности алгоритмов. Хорошее решение эффективно
                  как по памяти, так и по количеству ререндеров.
                </li>
                <li>
                  <strong>Обработка граничных случаев:</strong> Уделяйте
                  внимание обработке ошибок, состояниям загрузки и поведению
                  системы при нетипичных действиях пользователя.
                </li>
                <li>
                  <strong>Современные стандарты:</strong> Используйте актуальные
                  возможности платформы и фреймворка для создания чистого и
                  эффективного кода.
                </li>
              </ul>
            )}
          </section>
          <div className="step-actions">
            <button className="btn-primary" onClick={nextStep}>
              Начать интервью
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-content">
          <h2>Шаг 2: Алгоритмические задачи</h2>
          <section
            className={`card ${isCompleted("algos") ? "completed" : ""}`}
          >
            <label className="checklist-item">
              <input
                type="checkbox"
                checked={isCompleted("algos")}
                onChange={() => toggleTask("algos")}
              />
              <h3>0. Алгоритмы</h3>
            </label>
            <p>
              Необходимо решить задачи в <code>src/tasks/algorithms/</code> и
              проверить их, запустив <code>npm run test</code>.
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
                  <span>
                    1. Репка (Рекурсия и аккумуляция)
                    <br />
                    <small>
                      Файл: <code>src/tasks/algorithms/1-repka.ts</code>
                    </small>
                  </span>
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
                  <span>
                    2. Теремок (Стратегия LRU Cache)
                    <br />
                    <small>
                      Файл: <code>src/tasks/algorithms/2-teremok.ts</code>
                    </small>
                  </span>
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
                  <span>
                    3. Колобок (Поиск циклов в графе)
                    <br />
                    <small>
                      Файл: <code>src/tasks/algorithms/3-kolobok.ts</code>
                    </small>
                  </span>
                </label>
              </li>
            </ul>
          </section>
          <div className="step-actions">
            <button className="btn-secondary" onClick={prevStep}>
              Назад
            </button>
            <button className="btn-primary" onClick={nextStep}>
              К практическим задачам
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-content">
          <h2>Шаг 3: Практические задачи (Live Coding)</h2>
          <div className="grid">
            <section
              className={`card ${isCompleted("search") ? "completed" : ""}`}
            >
              <label className="checklist-item">
                <input
                  type="checkbox"
                  checked={isCompleted("search")}
                  onChange={() => toggleTask("search")}
                />
                <h3>1. Smart Search</h3>
              </label>
              <p>Debounce, AbortController, React 19 useOptimistic.</p>
              <p>
                Файл: <code>src/tasks/live-coding/1-SmartSearch.tsx</code>
              </p>
              <Link to="/search" className="task-link">
                Перейти к задаче →
              </Link>
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
              <p>
                Файл: <code>src/tasks/live-coding/2-VirtualList.tsx</code>
              </p>
              <Link to="/virtual-list" className="task-link">
                Перейти к задаче →
              </Link>
            </section>

            <section
              className={`card ${isCompleted("filter") ? "completed" : ""}`}
            >
              <label className="checklist-item">
                <input
                  type="checkbox"
                  checked={isCompleted("filter")}
                  onChange={() => toggleTask("filter")}
                />
                <h3>3. Filter Sync</h3>
              </label>
              <p>Синхронизация стейта фильтров с URL.</p>
              <p>
                Файл: <code>src/tasks/live-coding/3-FilterSync.tsx</code>
              </p>
              <Link to="/filter-sync" className="task-link">
                Перейти к задаче →
              </Link>
            </section>
          </div>
          <div className="step-actions">
            <button className="btn-secondary" onClick={prevStep}>
              Назад
            </button>
            <button className="btn-primary" onClick={nextStep}>
              К завершению
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="step-content">
          <h2>Шаг 4: Завершение</h2>
          <section className="card">
            <h3>Вопросы кандидата и фидбек</h3>
            <p>
              Практическая часть интервью завершена! Сейчас самое время для
              ваших вопросов о компании, процессах, команде и проектах.
            </p>
            <ul style={{ marginTop: "1.5rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>
                Обсуждение впечатлений от задач
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                Ответы на ваши вопросы о "Лучах"
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                Дальнейшие шаги и сроки обратной связи
              </li>
            </ul>
            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                background: "rgba(74, 144, 226, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(74, 144, 226, 0.2)",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                🤝
              </span>
              <strong>Спасибо за уделенное время и отличную работу!</strong>
            </div>
          </section>
          <div className="step-actions">
            <button className="btn-secondary" onClick={prevStep}>
              Назад
            </button>
            <button className="btn-primary" onClick={() => setStep(1)}>
              Вернуться в начало
            </button>
          </div>
        </div>
      )}
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
