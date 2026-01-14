// src/domain/attackSpeed.ts

/**
 * 공격속도 → 실제 공격 프레임 계산
 * (가정: 기본 공격 30프레임, 60fps 기준)
 */

const BASE_ATTACK_FRAME = 30; // 확실하지 않음 (가정)
const FPS = 60;              // 확실하지 않음 (가정)

/**
 * atkSpeedPercent: 공격속도 % (예: 66.7)
 */
export function calcAttackFrame(atkSpeedPercent: number): number {
  const speed = Math.max(0, atkSpeedPercent / 100);
  const rawFrame = BASE_ATTACK_FRAME / (1 + speed);

  // 대부분 게임은 floor 사용 (확실하지 않음)
  return Math.floor(rawFrame);
}

/**
 * 공격 프레임 → 초당 공격 횟수
 */
export function calcHitsPerSecond(frame: number): number {
  if (frame <= 0) return 0;
  return FPS / frame;
}
