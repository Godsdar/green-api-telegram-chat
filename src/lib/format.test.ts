import { describe, expect, it } from 'vitest';
import { initials, isValidPhone, normalizePhone } from './format';

describe('normalizePhone', () => {
  it('keeps international digits', () => {
    expect(normalizePhone('+7 747 345 67 89')).toBe('77473456789');
  });

  it('replaces a leading 8 with 7 (CIS format)', () => {
    expect(normalizePhone('8 (747) 345-67-89')).toBe('77473456789');
  });

  it('does not touch numbers that already start with 7', () => {
    expect(normalizePhone('77473456789')).toBe('77473456789');
  });
});

describe('isValidPhone', () => {
  it('accepts a full number', () => {
    expect(isValidPhone('77473456789')).toBe(true);
  });

  it('rejects a short number', () => {
    expect(isValidPhone('123')).toBe(false);
  });
});

describe('initials', () => {
  it('takes the first letters of two words', () => {
    expect(initials('Ildar Popov')).toBe('IP');
  });

  it('uses a single letter for a one-word name', () => {
    expect(initials('Alice')).toBe('A');
    expect(initials('@alice')).toBe('A');
  });

  it('falls back to the last digits for a phone-only title', () => {
    expect(initials('+7 999 123 45 67')).toBe('67');
  });
});
