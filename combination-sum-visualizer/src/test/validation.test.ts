import { describe, it, expect } from 'vitest';
import { validateCandidates, validateTarget } from '../utils/validation';

describe('validateCandidates', () => {
  it('should accept valid candidates', () => {
    const result = validateCandidates([2, 3, 6, 7]);
    expect(result.isValid).toBe(true);
  });

  it('should reject empty array', () => {
    const result = validateCandidates([]);
    expect(result.isValid).toBe(false);
  });
});

describe('validateTarget', () => {
  it('should accept valid target', () => {
    const result = validateTarget(7);
    expect(result.isValid).toBe(true);
  });

  it('should reject target less than 1', () => {
    const result = validateTarget(0);
    expect(result.isValid).toBe(false);
  });
});
