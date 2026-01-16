// src/domain/attackSpeed.ts

/**
 * 공격속도 → 실제 공격 프레임 및 타수 계산
 * 기준:
 * - 논리 FPS: 60
 * - 공격은 프레임 단위로 처리
 * - 타수는 계단식 증가 (floor)
 *
 * ⚠️ BASE_ATTACK_FRAME은 실측 기반 가정값
 */

const FPS = 60;                  // 확실 (가정)
const BASE_ATTACK_FRAME = 34;    // 실측 기반 가정 (100% 기준)

/**
 * atkSpeedPercent: 공격속도 % (예: 66.7)
 * return: 공격 1회당 소모 프레임 (정수)
 */
export function calcAttackFrame(atkSpeedPercent: number): number {
  const speed = Math.max(0, atkSpeedPercent / 100);
  const rawFrame = BASE_ATTACK_FRAME / (1 + speed);

  // 프레임 기반 게임 → floor 처리
  return Math.max(1, Math.floor(rawFrame));
}

/**
 * 공격 프레임 → 15초 동안의 공격 횟수
 * (타수는 항상 정수, 계단식)
 */
export function calcHitsPer15Sec(frame: number): number {
  if (frame <= 0) return 0;
  const TOTAL_FRAMES = FPS * 15; // 900
  return Math.floor(TOTAL_FRAMES / frame);
}

/**
 * 공격속도 % → 15초 타수
 * (UI / 효율 계산용 헬퍼)
 */
export function calcHitsFromAtkSpeed(atkSpeedPercent: number): number {
  const frame = calcAttackFrame(atkSpeedPercent);
  return calcHitsPer15Sec(frame);
}
