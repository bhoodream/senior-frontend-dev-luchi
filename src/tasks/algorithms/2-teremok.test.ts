import { describe, it, expect, beforeEach } from 'vitest';
import { Teremok } from './2-teremok';

describe('Теремок (LRU Cache)', () => {
    let teremok: Teremok<string>;

    beforeEach(() => {
        teremok = new Teremok(2);
    });

    it('должен позволять селить зверей и доставать их', () => {
        teremok.settle('Мышка', 'норушка');
        expect(teremok.voice('Мышка')).toBe('норушка');
    });

    it('должен выселять самого "молчаливого" при переполнении', () => {
        teremok.settle('Мышка', 'норушка');
        teremok.settle('Лягушка', 'квакушка');
        teremok.settle('Зайчик', 'побегайчик');
        
        expect(teremok.voice('Мышка')).toBe(null); // Выселена, так как была первой
        expect(teremok.voice('Лягушка')).toBe('квакушка');
        expect(teremok.voice('Зайчик')).toBe('побегайчик');
    });

    it('должен обновлять статус "свежести" при voice', () => {
        teremok.settle('Мышка', 'норушка');
        teremok.settle('Лягушка', 'квакушка');
        
        teremok.voice('Мышка'); // Теперь мышка свежая, а лягушка — на вылет
        
        teremok.settle('Зайчик', 'побегайчик');
        
        expect(teremok.voice('Лягушка')).toBe(null); // Лягушка выселена
        expect(teremok.voice('Мышка')).toBe('норушка');
        expect(teremok.voice('Зайчик')).toBe('побегайчик');
    });
});
