import { calculateLevel, getXpForNextLevel, getLevelName } from '@/lib/gamification';
describe('Gamification Logic', () => {
  it('calculates the correct level based on XP', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(10)).toBe(2);
    expect(calculateLevel(100)).toBe(4);
  });
});
