import { useEffect, useRef } from 'react';
import { useAlgorithm } from './useAlgorithm';

export function useAnimationPlayer() {
  const { state, dispatch } = useAlgorithm();
  const { isPlaying, speed, currentStepIndex, steps } = state;
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      const baseInterval = 1000; // 1 second at 1x speed
      const interval = baseInterval / speed;

      intervalRef.current = window.setInterval(() => {
        dispatch({ type: 'STEP_FORWARD' });
      }, interval);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, speed, currentStepIndex, steps.length, dispatch]);

  // Auto-pause when reaching the end
  useEffect(() => {
    if (isPlaying && currentStepIndex >= steps.length - 1) {
      dispatch({ type: 'PAUSE' });
    }
  }, [isPlaying, currentStepIndex, steps.length, dispatch]);
}
