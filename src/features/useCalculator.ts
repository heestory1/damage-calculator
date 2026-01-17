import { useState, useMemo, useCallback } from 'react';
import { StatSet, StatKey, StepSet } from '@/domain/types';
import { 
  estimateMainFixed, 
  computeFinalDamage,
  calculateNewAtk,
  predictNewStatDamage
} from '@/domain/calculator';
import { calcAttackFrame, calcHitsPer15Sec, getAttackSpeedBreakpoints } from '@/domain/attackSpeed';
import { EFFICIENCY_DEFAULTS, MYSTIC_WEAPON_FIXED } from '@/domain/constants';

export function useCalculator() {
  const [oldState, setOldState] = useState<StatSet>({});
  const [deltaState, setDeltaState] = useState<StatSet>({});
  const [pCustom, setPCustom] = useState<number>(50);
  const [effSteps, setEffSteps] = useState<StepSet>(EFFICIENCY_DEFAULTS as StepSet);

  // Value Setters
  const setOldValue = useCallback((k: StatKey, v: number | undefined) => {
    setOldState(prev => ({ ...prev, [k]: v }));
  }, []);

  const setDeltaValue = useCallback((k: StatKey, v: number | undefined) => {
    setDeltaState(prev => ({ ...prev, [k]: v }));
  }, []);

  // 1. Derived 'Old' State
  const old = useMemo(() => {
    const s = { ...oldState };
    if (s.stat !== undefined && s.mainPct !== undefined) {
      s.mainFixed = estimateMainFixed(s.stat, s.mainPct);
    }
    s.weapon = (s.weapon ?? 0) + MYSTIC_WEAPON_FIXED;
    return s;
  }, [oldState]);

  // 2. New State
  const newSet = useMemo(() => {
    const n: StatSet = {};
    const d = deltaState;

    const getOld = (k: StatKey) => old[k] ?? 0;
    const getDelta = (k: StatKey) => d[k] ?? 0;

    const simpleKeys: StatKey[] = [
      'weapon', 'skillAtk', 'cr', 'cd', 'as', 'dmg', 'amp',
      'basic', 'skill', 'boss', 'min', 'max', 'final'
    ];
    simpleKeys.forEach(k => { n[k] = getOld(k) + getDelta(k); });

    n.atk = calculateNewAtk(getOld('atk'), getDelta('atk'), n.weapon ?? getOld('weapon'));

    n.mainFixed = (old.mainFixed ?? 0) + getDelta('mainFixed');
    n.mainPct = getOld('mainPct') + getDelta('mainPct');

    n.stat = predictNewStatDamage(n.mainFixed, n.mainPct);

    return n;
  }, [old, deltaState]);

  // 3. Results
  const results = useMemo(() => {
    const oldDmg = computeFinalDamage(old, pCustom);
    const newDmg = computeFinalDamage(newSet, pCustom);

    // === 공격속도 (프레임 / 타수 기반) ===
    const baseAS = old.as ?? 0;
    const newAS = newSet.as ?? baseAS;

    const baseFrame = calcAttackFrame(baseAS);
    const newFrame = calcAttackFrame(newAS);

    const baseHits = calcHitsPer15Sec(baseFrame);
    const newHits = calcHitsPer15Sec(newFrame);

    const asGain = baseHits > 0 ? (newHits / baseHits - 1) : 0;
    const asBreakdown = getAttackSpeedBreakpoints(newAS);

    // Boosted Projection
    const boostedSet = { ...newSet };
    (Object.keys(effSteps) as Array<keyof StepSet>).forEach(k => {
      const stepVal = effSteps[k];
      if (!stepVal || stepVal <= 0) return;
      if (k === 'atk') boostedSet.atk = (boostedSet.atk || 0) + stepVal;
      else if (k === 'mainPctEff' || k === 'mainFixedEff') return;
      else if (k in boostedSet) {
        const sk = k as StatKey;
        boostedSet[sk] = (boostedSet[sk] || 0) + stepVal;
      }
    });

    const boostedDmg = newDmg > 0 ? computeFinalDamage(boostedSet, pCustom) : 0;

    return {
      oldDmg,
      newDmg,
      boostedDmg,
      diff: oldDmg > 0 ? (newDmg / oldDmg - 1) : 0,

      // 공격속도 정보
      asGain,
      asBreakdown,
      asDetail: {
        baseAS,
        newAS,
        baseFrame,
        newFrame,
        baseHits,
        newHits
      }
    };
  }, [old, newSet, deltaState, pCustom, effSteps]);

  const loadState = useCallback((data: any) => {
    if (data.old) setOldState(data.old);
    if (data.delta) setDeltaState(data.delta);
    if (data.pCustom) setPCustom(data.pCustom);
    if (data.effSteps) setEffSteps(data.effSteps);
  }, []);

  return {
    rawOld: oldState,
    old, setOldValue,
    delta: deltaState, setDeltaValue,
    newSet,
    pCustom, setPCustom,
    effSteps, setEffSteps,
    results,
    loadState
  };
}
