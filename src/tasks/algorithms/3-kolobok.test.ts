import { describe, it, expect } from "vitest";
import { hasForestCycle, ForestGraph } from "./3-kolobok";

describe("Колобок (Cycle Detection)", () => {
  it("должен обнаруживать простой цикл", () => {
    const forest: ForestGraph = {
      Колобок: ["Заяц"],
      Заяц: ["Колобок"],
    };
    expect(hasForestCycle(forest)).toBe(true);
  });

  it("должен обнаруживать цикл в глубине", () => {
    const forest: ForestGraph = {
      Колобок: ["Заяц", "Волк"],
      Заяц: ["Медведь"],
      Волк: ["Лиса"],
      Лиса: ["Колобок"],
      Медведь: [],
    };
    expect(hasForestCycle(forest)).toBe(true);
  });

  it("должен возвращать false для ацикличного графа", () => {
    const forest: ForestGraph = {
      Колобок: ["Заяц", "Волк"],
      Заяц: ["Медведь"],
      Волк: ["Лиса"],
      Лиса: [],
      Медведь: [],
    };
    expect(hasForestCycle(forest)).toBe(false);
  });

  it("должен корректно обрабатывать несколько путей к одному узлу без цикла", () => {
    const forest: ForestGraph = {
      Колобок: ["Заяц", "Волк"],
      Заяц: ["Медведь"],
      Волк: ["Медведь"],
      Медведь: [],
    };
    expect(hasForestCycle(forest)).toBe(false);
  });
});
