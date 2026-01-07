import { useState, useMemo, useCallback } from 'react';
import { StatSet, StatKey, StepSet } from '@/domain/types';
import { 
  estimateMainFixed, 
  computeFinalDamage,
  computeAttackSpeedMultiplier,
  calculateNewAtk,
  predictNewStatDamage
} from '@/domain/calculator';
import { EFFICIENCY_DEFAULTS } from '@/domain/constants';

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

  // 1. Derived 'Old' State (Auto estimate mainFixed)
  const old = useMemo(() => {
    const s = { ...oldState };
    if (s.stat !== undefined && s.mainPct !== undefined) {
      s.mainFixed = estimateMainFixed(s.stat, s.mainPct);
    }
    return s;
  }, [oldState]);

  // 2. Compute 'New' State (Full Compliant with torifun.html)
  const newSet = useMemo(() => {
    const n: StatSet = {};
    const d = deltaState;

    const getOld = (k: StatKey) => old[k] ?? 0;
    const getDelta = (k: StatKey) => d[k] ?? 0;

    // a. Simple additions first
    const simpleKeys: StatKey[] = [
      'weapon', 'skillAtk', 'cr', 'cd', 'as', 'dmg', 'amp', 
      'basic', 'skill', 'boss', 'min', 'max', 'final'
    ];
    simpleKeys.forEach(k => { n[k] = getOld(k) + getDelta(k); });

    // b. Atk with Weapon Factor
    n.atk = calculateNewAtk(getOld('atk'), getDelta('atk'), n.weapon ?? getOld('weapon'));

    // c. Main Stats
    n.mainFixed = (old.mainFixed ?? 0) + getDelta('mainFixed');
    n.mainPct = getOld('mainPct') + getDelta('mainPct');

    // d. Predict New Stat Damage
    n.stat = predictNewStatDamage(n.mainFixed, n.mainPct);

    return n;
  }, [old, deltaState]);

  // 3. Global Results Dashboard
  const results = useMemo(() => {
    const oldDmg = computeFinalDamage(old, pCustom);
    const newDmg = computeFinalDamage(newSet, pCustom);
    
    // AS Efficiency
    const asBase = newSet.as ?? old.as ?? 0;
    const asDelta = deltaState.as ?? 0;
    const asGain = computeAttackSpeedMultiplier(asBase, asDelta, pCustom) - 1;

    // Boosted Projection (Apply all simulation steps)
    const boostedSet = { ...newSet };
    (Object.keys(effSteps) as Array<keyof StepSet>).forEach(k => {
      const stepVal = effSteps[k];
      if (!stepVal || stepVal <= 0) return;
      if (k === 'atk') boostedSet.atk = (boostedSet.atk || 0) + stepVal;
      else if (k === 'mainPctEff' || k === 'mainFixedEff') return; // Virtual
      else if (k in boostedSet) {
        const sk = k as StatKey;
        boostedSet[sk] = (boostedSet[sk] || 0) + stepVal;
      }
    });
    const boostedDmg = newDmg > 0 ? computeFinalDamage(boostedSet, pCustom) : 0;

    const asScenarios = [30, 50, 70].map(p => ({
      p, gain: computeAttackSpeedMultiplier(asBase, asDelta, p) - 1
    }));

    return {
      oldDmg, newDmg, boostedDmg,
      diff: oldDmg > 0 ? (newDmg / oldDmg - 1) : 0,
      asGain, asScenarios
    };
  }, [old, newSet, deltaState, pCustom, effSteps]);

  const loadState = useCallback((data: any) => {
    if (data.old) setOldState(data.old);
    if (data.delta) setDeltaState(data.delta);
    if (data.pCustom) setPCustom(data.pCustom);
    if (data.effSteps) setEffSteps(data.effSteps);
  }, []);

  return {
    old, setOldValue,
    delta: deltaState, setDeltaValue,
    newSet,
    pCustom, setPCustom,
    effSteps, setEffSteps,
    results,
    loadState
  };
}