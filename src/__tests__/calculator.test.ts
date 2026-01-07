import { describe, it, expect } from 'vitest';
import { computeFinalDamage, estimateMainFixed } from '../domain/calculator';
import { StatSet } from '../domain/types';

describe('Calculator Logic (Golden Master)', () => {
  
  it('should return 0 for empty input', () => {
    const s: StatSet = {};
    const dmg = computeFinalDamage(s, 50);
    // atk=0, mainFixed=0 -> atkEffective=0 -> term=0 -> common=0
    expect(dmg).toBe(0);
  });

  it('should calculate simple attack damage', () => {
    // Atk 100, Min/Max 100 (avg 1), others 0
    // formula: 100 * 1 * 1 * 1... * 1 (avg) * 1 (crit: 0*1 + 1*1 = 1) = 100
    const s: StatSet = {
      atk: 100,
      min: 100,
      max: 100
    };
    const dmg = computeFinalDamage(s, 50);
    expect(dmg).toBeCloseTo(100, 3);
  });

  it('should handle p-weighting correctly', () => {
    // Atk 100, Min/Max 100
    // Basic Dmg +100% (factor 2)
    // Skill Dmg +0% (factor 1)
    // p=50% -> 0.5 * (100*2) + 0.5 * (100*1) = 100 + 50 = 150
    const s: StatSet = {
      atk: 100,
      min: 100,
      max: 100,
      basic: 100,
      skill: 0
    };
    const dmg = computeFinalDamage(s, 50);
    expect(dmg).toBeCloseTo(150, 3);

    // p=100% -> 1.0 * 200 + 0 = 200
    expect(computeFinalDamage(s, 100)).toBeCloseTo(200, 3);
    
    // p=0% -> 0 + 1.0 * 100 = 100
    expect(computeFinalDamage(s, 0)).toBeCloseTo(100, 3);
  });

  it('should estimate mainFixed correctly', () => {
    // If stat=500, mainPct=100 (factor 2)
    // fixed = 500 * 100 / 2 = 25000
    expect(estimateMainFixed(500, 100)).toBeCloseTo(25000, 3);
  });

  it('should calculate complex damage scenario', () => {
    const s: StatSet = {
      atk: 100, skillAtk: 10,
      dmg: 20, stat: 10, amp: 10, boss: 10,
      min: 100, max: 100,
      cr: 100, cd: 50,
      final: 10
    };
    
    const expected = 110 * 1.2 * 1.1 * 1.1 * 1.1 * 1.5 * 1.1;
    expect(computeFinalDamage(s, 50)).toBeCloseTo(expected, 3);
  });
});
