export type StatKey =
  | 'atk' | 'weapon' | 'skillAtk'
  | 'cr' | 'cd' | 'as' | 'stat'
  | 'mainFixed' | 'mainPct'
  | 'dmg' | 'amp'
  | 'basic' | 'skill' | 'boss' | 'min' | 'max' | 'final';

export type EfficiencyKey = StatKey | 'mainPctEff' | 'mainFixedEff';

export type StatSet = Partial<Record<StatKey, number>>;
export type StepSet = Partial<Record<EfficiencyKey, number>>;

export interface StatRow {
  key: StatKey;
  label: string;
}

export interface CalculationState {
  old: StatSet;
  delta: StatSet;
  step: StatSet; // Efficiency step
  p_custom: number; // 0-100
}

export interface EfficiencyResult {
  label: string;
  normGain: number; // Normalized %
  rawGain: number; // Raw %
  rank: number;
}
