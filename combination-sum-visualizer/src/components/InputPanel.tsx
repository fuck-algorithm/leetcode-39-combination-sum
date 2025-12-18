import { useState } from 'react';
import { validateCandidates, validateTarget } from '../utils/validation';
import { useAlgorithm } from '../hooks/useAlgorithm';
import { generateSteps } from '../engine/BacktrackingEngine';
import './InputPanel.css';

export function InputPanel() {
  const { state, dispatch } = useAlgorithm();
  const [candidatesInput, setCandidatesInput] = useState('2,3,6,7');
  const [targetInput, setTargetInput] = useState('7');
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setError(null);
    
    // Parse candidates
    const candidatesStr = candidatesInput.split(',').map(s => s.trim()).filter(s => s);
    const candidates = candidatesStr.map(s => parseInt(s, 10));
    
    if (candidatesStr.some((_, i) => isNaN(candidates[i]))) {
      setError('请输入有效的整数');
      return;
    }

    // Validate candidates
    const candidatesResult = validateCandidates(candidates);
    if (!candidatesResult.isValid) {
      setError(candidatesResult.error ?? '输入无效');
      return;
    }

    // Parse and validate target
    const target = parseInt(targetInput, 10);
    if (isNaN(target)) {
      setError('请输入有效的整数');
      return;
    }

    const targetResult = validateTarget(target);
    if (!targetResult.isValid) {
      setError(targetResult.error ?? '输入无效');
      return;
    }

    // Generate steps and start
    const steps = generateSteps(candidates.sort((a, b) => a - b), target);
    dispatch({ type: 'START', candidates, target, steps });
  };

  const isRunning = state.currentStepIndex >= 0;

  return (
    <div className="input-panel">
      <div className="input-group">
        <label htmlFor="candidates">候选数组:</label>
        <input
          id="candidates"
          type="text"
          value={candidatesInput}
          onChange={(e) => setCandidatesInput(e.target.value)}
          placeholder="例如: 2,3,6,7"
          disabled={isRunning}
        />
      </div>
      <div className="input-group">
        <label htmlFor="target">目标值:</label>
        <input
          id="target"
          type="number"
          value={targetInput}
          onChange={(e) => setTargetInput(e.target.value)}
          placeholder="例如: 7"
          disabled={isRunning}
          min={1}
          max={40}
        />
      </div>
      <button onClick={handleStart} disabled={isRunning} className="start-btn">
        开始
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
