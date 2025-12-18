import { useAlgorithm } from '../hooks/useAlgorithm';
import './ControlPanel.css';

export function ControlPanel() {
  const { state, dispatch } = useAlgorithm();
  const { isPlaying, speed, currentStepIndex, steps } = state;

  const isStarted = currentStepIndex >= 0;
  const isComplete = currentStepIndex >= steps.length - 1;
  const isAtStart = currentStepIndex <= 0;

  const handlePlay = () => dispatch({ type: 'PLAY' });
  const handlePause = () => dispatch({ type: 'PAUSE' });
  const handleStepForward = () => dispatch({ type: 'STEP_FORWARD' });
  const handleStepBackward = () => dispatch({ type: 'STEP_BACKWARD' });
  const handleReset = () => dispatch({ type: 'RESET' });
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SPEED', speed: parseFloat(e.target.value) });
  };

  if (!isStarted) {
    return (
      <div className="control-panel">
        <span className="hint">输入参数后点击"开始"按钮</span>
      </div>
    );
  }

  return (
    <div className="control-panel">
      <div className="control-buttons">
        <button onClick={handleStepBackward} disabled={isAtStart || isPlaying} className="control-btn step-back">
          ⏮ 上一步 <kbd>←</kbd>
        </button>
        {isPlaying ? (
          <button onClick={handlePause} className="control-btn pause">
            ⏸ 暂停 <kbd>Space</kbd>
          </button>
        ) : (
          <button onClick={handlePlay} disabled={isComplete} className="control-btn play">
            ▶ 播放 <kbd>Space</kbd>
          </button>
        )}
        <button onClick={handleStepForward} disabled={isComplete || isPlaying} className="control-btn step">
          ⏭ 下一步 <kbd>→</kbd>
        </button>
        <button onClick={handleReset} className="control-btn reset">
          ↺ 重置
        </button>
      </div>
      <div className="speed-control">
        <label>速度: {speed.toFixed(1)}x</label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={speed}
          onChange={handleSpeedChange}
        />
      </div>
      <div className="progress">
        步骤: {currentStepIndex + 1} / {steps.length}
      </div>
    </div>
  );
}
