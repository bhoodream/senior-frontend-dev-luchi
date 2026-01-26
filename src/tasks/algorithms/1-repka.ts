/**
 * Сценарий 1: "Репка"
 *
 * Посадил дед репку — выросла она огромная, до самого неба.
 * Тянет-потянет дед, а вытянуть не может. Приходится звать на помощь:
 * бабку, внучку, Жучку... Каждый новый герой хватается за предыдущего,
 * создавая живую цепочку. Чтобы репка наконец поддалась, суммарная мощь
 * всех героев должна достичь targetStrength.
 *
 * Требования:
 * 1. Вычислить, достаточно ли суммарной силы (strength) всех героев в цепочке, чтобы вытянуть репку.
 * 2. Цепочка героев представлена связным списком.
 * 3. Вернуть true, если суммарная сила >= targetStrength, иначе false.
 */

export interface Hero {
  name: string;
  strength: number;
  next: Hero | null;
}

/**
 * @param {Hero} hero - Текущий герой в цепочке (Node)
 * @param {number} targetStrength - Необходимая сила репки
 * @param {number} currentStrength - Сумма сил героев, уже вставших в ряд
 * @returns {boolean} - Смогла ли компания вытянуть репку?
 */
export function pull(
  hero: Hero,
  targetStrength: number,
  currentStrength: number = 0
): boolean {
  // Твоё решение здесь

  return false;
}
