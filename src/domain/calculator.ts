import { StatSet } from './types';

export function clamp(x: number, min: number, max: number) {
  return Math.min(max, Math.max(min, x));
}

/**
 * 1. 공격력 보정 산출 로직 (원본 torifun.html 준수)
 * NewAtk = OldAtk + (DeltaAtk * (1 + WeaponPct/100))
 */
export function calculateNewAtk(oldAtk: number, deltaAtk: number, weaponPct: number): number {
  const factor = 1 + (weaponPct / 100.0);
  return oldAtk + (deltaAtk * factor);
}

/**
 * 2. 고정 주스탯 자동 추정
 * fixedBase = (statOld * 100.0) / (1 + mainPctOld/100.0)
 */
export function estimateMainFixed(statOld: number, mainPctOld: number): number {
  const baseFactor = 1 + (mainPctOld / 100.0);
  if (baseFactor <= 0) return 0;
  return (statOld * 100.0) / baseFactor;
}

/**
 * 3. 신규 스탯비례 데미지 예측
 * newStatVal = fixedNewBase * (1 + newMainPct/100.0) * 0.01
 */
export function predictNewStatDamage(fixedNew: number, newMainPct: number): number {
  return fixedNew * (1 + newMainPct / 100.0) * 0.01;
}

/**
 * 4. 공격속도 DPS 배율 (원본 Sclamped 1.5 상한 및 totalSpeedFactor 준수)
 */
export function computeAttackSpeedMultiplier(S: number, d: number, p: number): number {
  const cap = 1.5;
  const pp = clamp(p / 100.0, 0, 1);
  const Sclamped = clamp(S / 100.0, 0, cap);
  const deff = (d / 100.0) * (cap - Sclamped) / cap;
  
  const before = 1 + Sclamped;
  const after = 1 + (Sclamped + deff);
  
  if (before <= 0) return 1;
  const ms = after / before;
  return 1 + pp * (ms - 1);
}

/**
 * 5. 최종 데미지 핵심 공식 (원본 calcDamage 100% 이식)
 */
export function computeFinalDamage(s: StatSet, pPercent: number): number {
  const p = clamp(pPercent / 100.0, 0, 1);
  const q = 1 - p;

  const atkBase = s.atk ?? 0;
  const skillAtk = s.skillAtk ?? 0;
  const mainFixed = s.mainFixed ?? 0;

  // 원본: 주스탯 1당 공격력 1 보정
  const atkEffective = atkBase + mainFixed;
  const atkTerm = atkEffective * (1 + skillAtk / 100.0);

  const cr = clamp((s.cr ?? 0) / 100.0, 0, 1);
  const cdMult = 1 + ((s.cd ?? 0) / 100.0);
  const critMult = (cr * cdMult + (1 - cr));

  const avg = ((s.min ?? 0) + (s.max ?? 0)) / 200.0;
  
  // 공통 계수 곱
  const common = atkTerm *
    (1 + (s.dmg ?? 0) / 100.0) *
    (1 + (s.stat ?? 0) / 100.0) *
    (1 + (s.amp ?? 0) / 100.0) *
    (1 + (s.boss ?? 0) / 100.0) *
    avg *
    critMult *
    (1 + (s.final ?? 0) / 100.0);

  // 기본기 vs 스킬 비중 반영
  const basicPart = common * (1 + (s.basic ?? 0) / 100.0);
  const skillPart = common * (1 + (s.skill ?? 0) / 100.0);

  return p * basicPart + q * skillPart;
}