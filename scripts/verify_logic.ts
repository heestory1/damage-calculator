
import { calcNextCutInfo } from '../src/domain/attackSpeed';
import { computeAttackSpeedMultiplier, computeFinalDamage, calculateNewAtk } from '../src/domain/calculator';

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
  } catch (e: any) {
    console.error(`[FAIL] ${name}: ${e.message}`);
  }
}

function expect(actual: any, expected: any, epsilon = 0.001) {
  if (typeof actual === 'number' && typeof expected === 'number') {
    if (Number.isNaN(actual)) {
         if (Number.isNaN(expected)) return; // Both NaN
         throw new Error(`Expected ${expected}, got NaN`);
    }
    if (Math.abs(actual - expected) > epsilon) {
        throw new Error(`Expected ${expected}, got ${actual}`);
    }
  } else if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

console.log('--- Starting Safety Verification ---');

test('Attack Speed 0% (Base)', () => {
    // 30 / (1 + 0) = 30
    const info = calcNextCutInfo(0);
    expect(info.frame, 30);
    expect(info.hps, 60 / 30); // 2.0
});

test('Attack Speed High (Cap)', () => {
    // 30 / (1 + 100) -> 30/101 ~ 0.29 -> floor 0 -> handled as <=1 check
    // If speed is huge, frame -> 0 or 1.
    // Let's try 5000%
    const info = calcNextCutInfo(5000);
    expect(info.isCapped, true);
    expect(info.frame <= 1, true);
});

test('Attack Speed Negative', () => {
    // Logic uses Math.max(0, speed)
    const info = calcNextCutInfo(-50);
    expect(info.frame, 30); // Treated as 0%
});

test('Attack Speed NaN (Safe Check)', () => {
    const info = calcNextCutInfo(NaN);
    // Should default to 0%
    expect(info.frame, 30); 
    expect(info.isCapped, false);
});

test('Multiplier with NaN inputs (Safe Check)', () => {
    // S=NaN -> 0, d=0, p=50
    // S=0 -> clamp(0) -> 0
    // d=0
    // before = 1
    // after = 1
    // ms = 1
    // result = 1 + p * 0 = 1
    const mult = computeAttackSpeedMultiplier(NaN, 0, 50);
    expect(mult, 1);
});

test('Final Damage with empty inputs (Safe Check)', () => {
    // {} -> all undefined -> safe() returns 0
    // atk=0, mainFixed=0 => atkEffective=0
    // common=0
    // final=0
    const res = computeFinalDamage({}, 50);
    expect(res, 0); 
});

test('calculateNewAtk with NaN', () => {
    // NaN + (NaN * (1+NaN/100)) -> should be 0 + (0 * 1) = 0
    const res = calculateNewAtk(NaN, NaN, NaN);
    expect(res, 0);
});

console.log('--- Verification Complete ---');
