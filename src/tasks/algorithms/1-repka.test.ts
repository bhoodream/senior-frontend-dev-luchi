import { describe, it, expect } from "vitest";
import { pull, Hero } from "./1-repka";

describe("Репка (Pull)", () => {
  it("должна вернуть true, если справляется и один дед", () => {
    expect(pull(ded, 20)).toBe(true); // Дедка (20)
  });

  it("должна вернуть true, если справляется часть персонажей", () => {
    expect(pull(ded, 35)).toBe(true); // Дедка (20) + Бабка (15) = 35
  });

  it("должна вернуть true, если справляются все персонажи", () => {
    expect(pull(ded, 54)).toBe(true); // 20+15+10+5+3+1 = 54
  });

  it("должна вернуть false, если даже с мышкой не справились", () => {
    expect(pull(ded, 60)).toBe(false); // 54 < 60
  });

  it("должна работать с одним героем", () => {
    expect(pull(myshka, 1)).toBe(true);
    expect(pull(myshka, 2)).toBe(false);
  });
});

export const myshka: Hero = { name: "Мышка", strength: 1, next: null };
export const koshka: Hero = { name: "Кошка", strength: 3, next: myshka };
export const zhuchka: Hero = { name: "Жучка", strength: 5, next: koshka };
export const vnuchka: Hero = { name: "Внучка", strength: 10, next: zhuchka };
export const babka: Hero = { name: "Бабка", strength: 15, next: vnuchka };
export const ded: Hero = { name: "Дедка", strength: 20, next: babka };
