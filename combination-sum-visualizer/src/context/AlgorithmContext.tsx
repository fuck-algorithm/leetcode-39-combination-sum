import { useReducer, type ReactNode } from 'react';
import type { AlgorithmState, AlgorithmAction } from '../types';
import { AlgorithmContext } from './AlgorithmContextDef';

const initialState: AlgorithmState = {
  candidates: [2, 3, 6, 7],
  target: 7,
  steps: [],
  currentStepIndex: -1,
  isPlaying: false,
  speed: 1,
  combinations: [],
  treeData: null,
  highlightedPath: null,
};

function algorithmReducer(state: AlgorithmState, action: AlgorithmAction): AlgorithmState {
  switch (action.type) {
    case 'START': {
      const firstStep = action.steps[0];
      return {
        ...state,
        candidates: action.candidates,
        target: action.target,
        steps: action.steps,
        currentStepIndex: 0,
        isPlaying: false,
        combinations: [],
        treeData: firstStep?.treeSnapshot ?? null,
      };
    }
    case 'STEP_FORWARD': {
      if (state.currentStepIndex >= state.steps.length - 1) {
        return { ...state, isPlaying: false };
      }
      const nextIndex = state.currentStepIndex + 1;
      const nextStep = state.steps[nextIndex];
      const newCombinations = nextStep.foundCombination
        ? [...state.combinations, nextStep.foundCombination]
        : state.combinations;
      return {
        ...state,
        currentStepIndex: nextIndex,
        treeData: nextStep.treeSnapshot,
        combinations: newCombinations,
      };
    }
    case 'STEP_BACKWARD': {
      if (state.currentStepIndex <= 0) {
        return state;
      }
      const prevIndex = state.currentStepIndex - 1;
      const prevStep = state.steps[prevIndex];
      // Recalculate combinations up to prevIndex
      const newCombinations: number[][] = [];
      for (let i = 0; i <= prevIndex; i++) {
        const step = state.steps[i];
        if (step.foundCombination) {
          newCombinations.push(step.foundCombination);
        }
      }
      return {
        ...state,
        currentStepIndex: prevIndex,
        treeData: prevStep.treeSnapshot,
        combinations: newCombinations,
        isPlaying: false,
      };
    }
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'RESET': {
      const firstStep = state.steps[0];
      return {
        ...state,
        currentStepIndex: 0,
        isPlaying: false,
        combinations: [],
        treeData: firstStep?.treeSnapshot ?? null,
      };
    }
    case 'SET_SPEED':
      return { ...state, speed: action.speed };
    case 'HIGHLIGHT_PATH':
      return { ...state, highlightedPath: action.path };
    default:
      return state;
  }
}

export function AlgorithmProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(algorithmReducer, initialState);
  
  const currentStep = state.currentStepIndex >= 0 && state.currentStepIndex < state.steps.length
    ? state.steps[state.currentStepIndex]
    : null;

  return (
    <AlgorithmContext.Provider value={{ state, dispatch, currentStep }}>
      {children}
    </AlgorithmContext.Provider>
  );
}
