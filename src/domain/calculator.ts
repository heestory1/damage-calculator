import { calcAttackFrame, calcHitsPer15Sec } from './attackSpeed';
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
 * 4. 공격속도 DPS 배율 (프레임 기반, 15초 타수 기준)
 * ⚠️ 연속 배율 폐기, 계단식 타수만 반영
 */
export function computeAttackSpeedMultiplier(
  atkSpeedPercent: number,
  baseHitsPer15Sec: number
): number {
  const frame = calcAttackFrame(atkSpeedPercent);
  const hits = calcHitsPer15Sec(frame);

  if (baseHitsPer15Sec <= 0) return 1;
  return hits / baseHitsPer15Sec;
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

  // 주스탯 1당 공격력 1 보정
  const atkEffective = atkBase + mainFixed;
  const atkTerm = atkEffective * (1 + skillAtk / 100.0);

  const cr = clamp((s.cr ?? 0) / 100.0, 0, 1);
  const cdMult = 1 + ((s.cd ?? 0) / 100.0);
  const critMult = (cr * cdMult + (1 - cr));

  const avg = ((s.min ?? 0) + (s.max ?? 0)) / 200.0;

  const common =
    atkTerm *
    (1 + (s.dmg ?? 0) / 100.0) *
    (1 + (s.stat ?? 0) / 100.0) *
    (1 + (s.amp ?? 0) / 100.0) *
    (1 + (s.boss ?? 0) / 100.0) *
    avg *
    critMult *
    (1 + (s.final ?? 0) / 100.0);

  const basicPart = common * (1 + (s.basic ?? 0) / 100.0);
  const skillPart = common * (1 + (s.skill ?? 0) / 100.0);

  return p * basicPart + q * skillPart;
}

/**
 * 디버그용: 공격속도 → 프레임 / 15초 타수 확인
 */
export function __debugAttackSpeed(atkSpeedPercent: number) {
  const frame = calcAttackFrame(atkSpeedPercent);
  const hits15 = calcHitsPer15Sec(frame);
  return { frame, hits15 };
}
