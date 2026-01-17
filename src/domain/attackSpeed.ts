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

/**
 * 공격속도 관련 분석 정보 반환
 */
export function getAttackSpeedBreakpoints(currentAS: number) {
  const currentFrame = calcAttackFrame(currentAS);
  
  // 현재 프레임을 유지하는 최소 공속 (Min AS for Current Frame)
  // Frame <= 34 / (1 + as)  -> 1+as <= 34/Frame -> as <= 34/Frame - 1
  // 이 식은 '상한선'이므로, 하한선은 'Frame+1'이 되는 공속보다 커야 함.
  // 즉, Next Slower Frame (current+1) 컷보다 커야 함.
  // Slower Frame Cut: as > 34/(current+1) - 1
  const minASForCurrent = Math.max(0, (34 / (currentFrame + 1) - 1) * 100);

  // 다음 프레임(더 빠른) 도달 컷
  // Next Frame = currentFrame - 1
  // Target AS > 34 / currentFrame - 1
  const nextFrame = Math.max(1, currentFrame - 1);
  const reqASForNext = (34 / currentFrame - 1) * 100;
  
  // 정확히 컷에 걸리면 프레임이 안 변하므로(floor), 표기용으로는 0.01 정도 더해주는 게 안전하거나
  // UI에서 "초과"로 명시. 계산상으로는 epsilon 더함.
  const targetAS = reqASForNext; 

  return {
    currentFrame,
    nextFrame,
    currentAS,
    reqASForNext: targetAS,
    minASForCurrent, // 현재 프레임이 유지되는 바닥 공속
    progress: (currentAS - minASForCurrent) / (targetAS - minASForCurrent) // 현재 구간 내 진행률 (0~1)
  };
}
