import { useAlgorithm } from '../hooks/useAlgorithm';
import './ResultsPanel.css';

export function ResultsPanel() {
  const { state, dispatch } = useAlgorithm();
  const { combinations, currentStepIndex, steps, highlightedPath } = state;
  
  const isComplete = currentStepIndex >= steps.length - 1 && steps.length > 0;

  const handleCombinationClick = (combo: number[]) => {
    // 如果点击的是已高亮的，则取消高亮
    const isSame = highlightedPath && 
      highlightedPath.length === combo.length && 
      highlightedPath.every((v, i) => v === combo[i]);
    
    dispatch({ type: 'HIGHLIGHT_PATH', path: isSame ? null : combo });
  };

  return (
    <div className="results-panel">
      <h3>找到的组合 {isComplete && <span className="complete-badge">✓ 完成</span>}</h3>
      {combinations.length === 0 ? (
        <p className="hint">暂无结果</p>
      ) : (
        <ul className="combinations-list">
          {combinations.map((combo, index) => {
            const isHighlighted = highlightedPath && 
              highlightedPath.length === combo.length && 
              highlightedPath.every((v, i) => v === combo[i]);
            return (
              <li 
                key={index} 
                className={`combination ${isHighlighted ? 'highlighted' : ''}`}
                onClick={() => handleCombinationClick(combo)}
              >
                [{combo.join(', ')}]
              </li>
            );
          })}
        </ul>
      )}
      {isComplete && (
        <div className="summary">
          共找到 {combinations.length} 个组合
        </div>
      )}
    </div>
  );
}
