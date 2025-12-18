import { createContext } from 'react';
import type { AlgorithmState, AlgorithmAction, AlgorithmStep } from '../types';

export interface AlgorithmContextValue {
  state: AlgorithmState;
  dispatch: React.Dispatch<AlgorithmAction>;
  currentStep: AlgorithmStep | null;
}

export const AlgorithmContext = createContext<AlgorithmContextValue | null>(null);
