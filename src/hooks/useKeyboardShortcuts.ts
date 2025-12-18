import { useEffect } from 'react';
import { useAlgorithm } from './useAlgorithm';

/**
 * 键盘快捷键 Hook
 * - 左方向键: 上一步
 * - 右方向键: 下一步
 * - 空格键: 播放/暂停
 */
export function useKeyboardShortcuts() {
  const { state, dispatch } = useAlgorithm();
  const { isPlaying, currentStepIndex, steps } = state;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果焦点在输入框中，不处理快捷键
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      const isStarted = currentStepIndex >= 0;
      const isComplete = currentStepIndex >= steps.length - 1;
      const isAtStart = currentStepIndex <= 0;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (isStarted && !isAtStart && !isPlaying) {
            dispatch({ type: 'STEP_BACKWARD' });
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (isStarted && !isComplete && !isPlaying) {
            dispatch({ type: 'STEP_FORWARD' });
          }
          break;
        case ' ':
          e.preventDefault();
          if (isStarted) {
            if (isPlaying) {
              dispatch({ type: 'PAUSE' });
            } else if (!isComplete) {
              dispatch({ type: 'PLAY' });
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isPlaying, currentStepIndex, steps.length]);
}
