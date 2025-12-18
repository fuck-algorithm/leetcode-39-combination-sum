import { useAlgorithm } from '../hooks/useAlgorithm';
import './StatePanel.css';

export function StatePanel() {
  const { state, currentStep } = useAlgorithm();
  const { candidates, target } = state;

  if (!currentStep) {
    return (
      <div className="state-panel">
        <h3>📊 当前状态</h3>
        <p className="hint">等待开始...</p>
      </div>
    );
  }

  const { currentPath, remainingSum, currentCandidate, type, candidateIndex } = currentStep;
  const pathSum = currentPath.reduce((a, b) => a + b, 0);

  // Generate call stack representation
  const getCallStack = () => {
    const stack = [];
    const path: number[] = [];
    for (let i = 0; i <= currentPath.length; i++) {
      const remaining = target - path.reduce((a, b) => a + b, 0);
      stack.push({
        path: [...path],
        remaining,
        idx: i < currentPath.length ? candidateIndex : candidateIndex,
      });
      if (i < currentPath.length) {
        path.push(currentPath[i]);
      }
    }
    return stack.slice(-4); // Show last 4 calls
  };

  const getStepExplanation = () => {
    switch (type) {
      case 'start':
        return {
          title: '🚀 开始搜索',
          detail: `目标是找到和为 ${target} 的组合。从空路径开始，尝试每个候选数字。`,
        };
      case 'choose':
        return {
          title: `✅ 选择数字 ${currentCandidate}`,
          detail: `将 ${currentCandidate} 加入当前路径。路径变为 [${currentPath.join(', ')}]，剩余需要凑 ${remainingSum}。`,
        };
      case 'recurse':
        return {
          title: '🔄 递归探索',
          detail: `继续在当前路径 [${currentPath.join(', ') || '空'}] 基础上探索，还需要凑 ${remainingSum}。`,
        };
      case 'found':
        return {
          title: '🎉 找到有效组合！',
          detail: `[${currentPath.join(', ')}] 的和正好等于 ${target}！这是一个有效答案。`,
        };
      case 'prune':
        return {
          title: `✂️ 剪枝 - 跳过 ${currentCandidate}`,
          detail: `选择 ${currentCandidate} 后剩余和为 ${remainingSum} < 0，不可能凑出目标，直接跳过。`,
        };
      case 'backtrack':
        return {
          title: `↩️ 回溯 - 撤销 ${currentCandidate || '选择'}`,
          detail: `当前分支探索完毕，撤销最后的选择，尝试其他可能。`,
        };
      case 'complete':
        return {
          title: '✨ 搜索完成',
          detail: `所有可能的组合都已探索完毕。`,
        };
      default:
        return {
          title: '执行中',
          detail: currentStep.description,
        };
    }
  };

  const explanation = getStepExplanation();

  return (
    <div className="state-panel">
      <h3>📊 当前状态</h3>
      
      {/* Step explanation */}
      <div className="explanation-box">
        <div className="explanation-title">{explanation.title}</div>
        <div className="explanation-detail">{explanation.detail}</div>
      </div>

      {/* Current path visualization */}
      <div className="state-section">
        <label>当前路径:</label>
        <div className="path-visual">
          {currentPath.length === 0 ? (
            <span className="empty-path">[ 空 ]</span>
          ) : (
            <>
              <span className="bracket">[</span>
              {currentPath.map((num, i) => (
                <span key={i} className="path-num">
                  {num}
                  {i < currentPath.length - 1 && <span className="plus">+</span>}
                </span>
              ))}
              <span className="bracket">]</span>
              <span className="path-sum">= {pathSum}</span>
            </>
          )}
        </div>
      </div>

      {/* Remaining sum with progress */}
      <div className="state-section">
        <label>剩余目标:</label>
        <div className="remaining-visual">
          <div className="remaining-bar">
            <div 
              className={`remaining-fill ${remainingSum < 0 ? 'negative' : remainingSum === 0 ? 'zero' : ''}`}
              style={{ width: `${Math.max(0, Math.min(100, (remainingSum / target) * 100))}%` }}
            ></div>
          </div>
          <span className={`remaining-value ${remainingSum < 0 ? 'negative' : remainingSum === 0 ? 'zero' : ''}`}>
            {remainingSum === 0 ? '✓ 0 (完美!)' : remainingSum < 0 ? `${remainingSum} (超出!)` : remainingSum}
          </span>
        </div>
      </div>

      {/* Candidates with current highlight */}
      <div className="state-section">
        <label>候选数字:</label>
        <div className="candidates-visual">
          {candidates.map((c, i) => (
            <span
              key={c}
              className={`candidate-chip ${c === currentCandidate ? 'active' : ''} ${i < candidateIndex ? 'used' : ''}`}
            >
              {c}
              {c === currentCandidate && <span className="current-marker">👈</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Mini call stack */}
      <div className="state-section">
        <label>调用栈:</label>
        <div className="call-stack">
          {getCallStack().map((call, i) => (
            <div key={i} className={`stack-frame ${i === getCallStack().length - 1 ? 'current' : ''}`}>
              <code>dfs([{call.path.join(',')}], {target - call.path.reduce((a, b) => a + b, 0)})</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
