// src/domain/attackSpeed.ts

/**
 * 공격속도 → 실제 공격 프레임 및 타수 계산
 * 기준:
 * - 논리 FPS: 60
 * - Base Frame: 30 (사용자 피드백 기반 30프레임 체계 적용)
 * - Tier System: 50%, 66.7%, 100% 구간에서만 유의미한 변화 발생 가정
 */

const FPS = 60;
const BASE_ATTACK_FRAME = 30; // 30프레임 기준 (기존 34에서 변경)

// 정의된 공속 티어 (구간 시작 %, 적용 프레임)
// 66.7%는 계산상 17.99.. -> 17이 될 수 있으나, 통상 18프레임(3/5)으로 간주하여 설정
const AS_TIERS = [
  { cut: 100, frame: 15 }, // 2.0배
  { cut: 66.7, frame: 18 }, // 약 1.66배
  { cut: 50, frame: 20 },  // 1.5배
  { cut: 0, frame: 30 }    // 1.0배
];

/**
 * atkSpeedPercent: 공격속도 %
 * return: Tier에 따른 고정 프레임 반환
 */
export function calcAttackFrame(atkSpeedPercent: number): number {
  // 높은 구간부터 체크하여 해당되면 반환
  for (const tier of AS_TIERS) {
    if (atkSpeedPercent >= tier.cut) {
      return tier.frame;
    }
  }
  return 30; // Fallback
}

/**
 * 공격 프레임 → 15초 동안의 공격 횟수
 */
export function calcHitsPer15Sec(frame: number): number {
  if (frame <= 0) return 0;
  const TOTAL_FRAMES = FPS * 15; // 900
  return Math.floor(TOTAL_FRAMES / frame);
}

/**
 * 공격속도 % → 15초 타수
 */
export function calcHitsFromAtkSpeed(atkSpeedPercent: number): number {
  const frame = calcAttackFrame(atkSpeedPercent);
  return calcHitsPer15Sec(frame);
}

/**
 * 공격속도 관련 분석 정보 반환 (Tier 기반)
 */
export function getAttackSpeedBreakpoints(currentAS: number) {
  const currentFrame = calcAttackFrame(currentAS);
  
  // 현재 구간 찾기
  // AS_TIERS는 내림차순 정렬되어 있음
  const currentTierIndex = AS_TIERS.findIndex(t => currentAS >= t.cut);
  const currentTier = AS_TIERS[currentTierIndex] || AS_TIERS[AS_TIERS.length - 1]; // Fallback to 0%

  // 다음 목표 구간 찾기
  // 현재가 최고 티어(0번 인덱스)라면 다음 목표 없음
  const nextTierIndex = currentTierIndex - 1;
  const hasNext = nextTierIndex >= 0;
  
  const nextTier = hasNext ? AS_TIERS[nextTierIndex] : currentTier;

  // 다음 목표까지 남은 수치
  const reqASForNext = hasNext ? nextTier.cut : currentTier.cut;
  
  // 현재 구간의 시작점 (Base)
  const minASForCurrent = currentTier.cut;

  // Progress 계산 (현재 구간 내 위치)
  // 예: 현재 25% (0% ~ 50% 사이). Progress = (25 - 0) / (50 - 0) = 0.5
  let progress = 0;
  if (hasNext) {
    const totalDist = nextTier.cut - minASForCurrent;
    const currentDist = currentAS - minASForCurrent;
    progress = totalDist > 0 ? currentDist / totalDist : 1;
  } else {
    progress = 1; // 최고 티어 도달
  }

  return {
    currentFrame,
    nextFrame: hasNext ? nextTier.frame : currentFrame, // 다음 티어의 프레임
    currentAS,
    reqASForNext, // 다음 티어 컷
    minASForCurrent, // 현재 티어 컷
    progress,
    isMax: !hasNext,
    tierLabel: `${currentTier.cut}% 구간`
  };
}
