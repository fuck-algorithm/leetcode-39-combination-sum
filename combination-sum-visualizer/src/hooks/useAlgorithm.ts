import { useContext } from 'react';
import { AlgorithmContext } from '../context/AlgorithmContextDef';

export function useAlgorithm() {
  const context = useContext(AlgorithmContext);
  if (!context) {
    throw new Error('useAlgorithm must be used within an AlgorithmProvider');
  }
  return context;
}
