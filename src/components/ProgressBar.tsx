import { useAlgorithm } from '../hooks/useAlgorithm';
import './ProgressBar.css';

export function ProgressBar() {
  const { state, dispatch } = useAlgorithm();
  const { currentStepIndex, steps } = state;

  const isStarted = currentStepIndex >= 0;
  const totalSteps = steps.length;
  const progress = isStarted && totalSteps > 0 
    ? ((currentStepIndex + 1) / totalSteps) * 100 
    : 0;

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetIndex = parseInt(e.target.value, 10);
    const currentIndex = currentStepIndex;
    
    if (targetIndex > currentIndex) {
      // 前进
      for (let i = currentIndex; i < targetIndex; i++) {
        dispatch({ type: 'STEP_FORWARD' });
      }
    } else if (targetIndex < currentIndex) {
      // 后退
      for (let i = currentIndex; i > targetIndex; i--) {
        dispatch({ type: 'STEP_BACKWARD' });
      }
    }
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isStarted || totalSteps === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const targetIndex = Math.round(percentage * (totalSteps - 1));
    
    const currentIndex = currentStepIndex;
    if (targetIndex > currentIndex) {
      for (let i = currentIndex; i < targetIndex; i++) {
        dispatch({ type: 'STEP_FORWARD' });
      }
    } else if (targetIndex < currentIndex) {
      for (let i = currentIndex; i > targetIndex; i--) {
        dispatch({ type: 'STEP_BACKWARD' });
      }
    }
  };

  if (!isStarted) {
    return (
      <div className="progress-bar-container">
        <div className="progress-bar-track empty">
          <div className="progress-bar-hint">输入参数后点击"开始"按钮查看动画</div>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-wrapper">
        <div className="progress-bar-track" onClick={handleTrackClick}>
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min="0"
            max={totalSteps - 1}
            value={currentStepIndex}
            onChange={handleProgressChange}
            className="progress-bar-slider"
          />
        </div>
        <div className="progress-bar-info">
          <span className="progress-step">步骤 {currentStepIndex + 1} / {totalSteps}</span>
          <span className="progress-percent">{progress.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
