import { StatKey } from './types';

export const STAT_LABELS: Record<StatKey, string> = {
  atk: "상태창 공격력",
  weapon: "무기 (Ancient)",
  skillAtk: "스킬 공격력 (%)",
  cr: "크리티컬 확률",
  cd: "크리티컬 데미지",
  stat: "스탯비례 데미지",
  mainFixed: "고정 주스탯",
  mainPct: "주스탯 (%)",
  dmg: "데미지 (%)",
  amp: "데미지 증폭",
  basic: "기본공격 데미지",
  skill: "스킬 데미지",
  boss: "보스/일반 데미지",
  min: "최소 데미지",
  max: "최대 데미지",
  final: "최종 데미지",
  as: "공격 속도"
};

export const STAT_DESCRIPTIONS: Partial<Record<StatKey, string>> = {
  atk: "프리셋 설정 > 예상 능력치에 나와있는 공격력을 입력",
  weapon: "공격력 정보를 눌렀을때 현재 보유 중인 능력치에 나와있는 % 수치 입력",
  skillAtk: "스킬/버프로 인한 증가분을 모두 합산한 값입니다.",
  cr: "크확 100% 초과분도 모두 그대로 입력합니다.",
  stat: "스탯 정보에 나와 있는 합산 능력치를 입력합니다",
  mainFixed: "입력된 값을 기반으로 자동 추정된 고정 주스탯입니다.",
  mainPct: "현재 캐릭터의 주스탯% 합산 수치입니다.",
  basic: "기본공격 데미지입니다. (p 비중 반영)",
  skill: "스킬 데미지입니다. (1-p 비중 반영)",
  boss: "보스 및 일반 데미지를 합산하여 입력하세요.",
  final: "최종 데미지 합산 수치입니다."
};

export const EFFICIENCY_DEFAULTS: Partial<Record<string, number>> = {
  atk: 5000,
  cr: 12,
  dmg: 25,
  boss: 15,
  min: 15,
  max: 15,
  amp: 0.8,
  cd: 20,
  final: 8,
  skill: 10,
  basic: 1, 
  stat: 1,
  mainFixedEff: 600, 
  mainPctEff: 12     
};

export const MYSTIC_WEAPON_FIXED = 8573.3;

export const STAT_ORDER: StatKey[] = [
  'atk', 'weapon', 'skillAtk', 'cr', 'cd', 'stat',
  'mainFixed', 'mainPct', 'dmg', 'amp', 'basic', 'skill',
  'boss', 'min', 'max', 'final'
];
