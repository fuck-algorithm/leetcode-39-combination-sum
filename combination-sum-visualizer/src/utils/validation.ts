import type { ValidationResult } from '../types';

const MIN_CANDIDATE = 2;
const MAX_CANDIDATE = 40;
const MIN_CANDIDATES_LENGTH = 1;
const MAX_CANDIDATES_LENGTH = 30;
const MIN_TARGET = 1;
const MAX_TARGET = 40;

export function validateCandidates(candidates: number[]): ValidationResult {
  if (!Array.isArray(candidates)) {
    return { isValid: false, error: '候选数组必须是数组类型' };
  }

  if (candidates.length < MIN_CANDIDATES_LENGTH) {
    return { isValid: false, error: '请输入至少一个候选数字' };
  }

  if (candidates.length > MAX_CANDIDATES_LENGTH) {
    return { isValid: false, error: `候选数组长度不能超过 ${MAX_CANDIDATES_LENGTH}` };
  }

  for (const num of candidates) {
    if (!Number.isInteger(num)) {
      return { isValid: false, error: '请输入有效的整数' };
    }
    if (num < MIN_CANDIDATE || num > MAX_CANDIDATE) {
      return { isValid: false, error: `候选数字必须在 ${MIN_CANDIDATE}-${MAX_CANDIDATE} 之间` };
    }
  }

  const uniqueSet = new Set(candidates);
  if (uniqueSet.size !== candidates.length) {
    return { isValid: false, error: '候选数字不能重复' };
  }

  return { isValid: true };
}

export function validateTarget(target: number): ValidationResult {
  if (!Number.isInteger(target)) {
    return { isValid: false, error: '请输入有效的整数' };
  }

  if (target < MIN_TARGET || target > MAX_TARGET) {
    return { isValid: false, error: `目标值必须在 ${MIN_TARGET}-${MAX_TARGET} 之间` };
  }

  return { isValid: true };
}

export function validateInput(candidates: number[], target: number): ValidationResult {
  const candidatesResult = validateCandidates(candidates);
  if (!candidatesResult.isValid) {
    return candidatesResult;
  }

  return validateTarget(target);
}
