'use strict';
const { toIFC, toGregorian, isLeap } = require('../src/index.js');

// ─── isLeap ───────────────────────────────────────────────────────────────────
describe('isLeap', () => {
  test('2024 is a leap year', () => expect(isLeap(2024)).toBe(true));
  test('2023 is not a leap year', () => expect(isLeap(2023)).toBe(false));
  test('1900 is not a leap year (div by 100)', () => expect(isLeap(1900)).toBe(false));
  test('2000 is a leap year (div by 400)', () => expect(isLeap(2000)).toBe(true));
});

// ─── toIFC ────────────────────────────────────────────────────────────────────
describe('toIFC', () => {
  test('normal date — Mar 22 2026', () => {
    expect(toIFC('2026-03-22')).toMatchObject({
      year: 2026, month: 3, day: 25, isLeapDay: false, isYearDay: false
    });
  });

  test('first day of Sol — 2026', () => {
    expect(toIFC('2026-06-18')).toMatchObject({
      year: 2026, month: 7, day: 1, isLeapDay: false, isYearDay: false
    });
  });

  test('Leap Day — 2024', () => {
    expect(toIFC('2024-06-17')).toMatchObject({
      year: 2024, month: 6, day: 29, isLeapDay: true, isYearDay: false, weekday: null
    });
  });

  test('day before Leap Day is Jun 28 — 2024', () => {
    expect(toIFC('2024-06-16')).toMatchObject({
      year: 2024, month: 6, day: 28, isLeapDay: false, isYearDay: false, weekday: 6
    });
  });

  test('day after Leap Day is Sol 1 — 2024', () => {
    expect(toIFC('2024-06-18')).toMatchObject({
      year: 2024, month: 7, day: 1, isLeapDay: false, isYearDay: false
    });
  });

  test('Year Day non-leap — 2026', () => {
    expect(toIFC('2026-12-31')).toMatchObject({
      year: 2026, month: 13, day: 29, isLeapDay: false, isYearDay: true, weekday: null
    });
  });

  test('Year Day leap — 2024', () => {
    expect(toIFC('2024-12-31')).toMatchObject({
      year: 2024, month: 13, day: 29, isLeapDay: false, isYearDay: true, weekday: null
    });
  });

  test('Dec 28 non-leap — last normal day before Year Day', () => {
    expect(toIFC('2026-12-30')).toMatchObject({
      year: 2026, month: 13, day: 28, isLeapDay: false, isYearDay: false, weekday: 6
    });
  });

  test('Jan 1 — first day of IFC year', () => {
    expect(toIFC('2026-01-01')).toMatchObject({
      year: 2026, month: 1, day: 1, isLeapDay: false, isYearDay: false, weekday: 0
    });
  });

  test('Gregorian Feb 29 (leap) maps to IFC Mar 4', () => {
    expect(toIFC('2024-02-29')).toMatchObject({
      year: 2024, month: 3, day: 4, isLeapDay: false, isYearDay: false
    });
  });

  test('Sol 1 non-leap is not affected by leap offset', () => {
    expect(toIFC('2026-06-18')).toMatchObject({
      year: 2026, month: 7, day: 1
    });
  });

  test('throws on invalid date', () => {
    expect(() => toIFC('not-a-date')).toThrow('Invalid date: not-a-date');
  });

  test('weekday is always 0 (Sun) for day 1 of any month', () => {
    const result = toIFC('2026-01-01');
    expect(result.weekday).toBe(0);
  });

  test('weekday is always 6 (Sat) for day 28 of any month', () => {
    const result = toIFC('2026-01-28');
    expect(result.weekday).toBe(6);
  });

  test('weekday is consistent across months — Sol 1 is always Sunday', () => {
    expect(toIFC('2026-06-18').weekday).toBe(0);
    expect(toIFC('2024-06-18').weekday).toBe(0);
  });
});

// ─── toGregorian ──────────────────────────────────────────────────────────────
describe('toGregorian', () => {
  test('normal date — IFC Mar 22', () => {
    expect(toGregorian('IFC:2026-03-22')).toBe('2026-03-19');
  });

  test('Sol 1 2026', () => {
    expect(toGregorian('IFC:2026-07-01')).toBe('2026-06-18');
  });

  test('Leap Day 2024', () => {
    expect(toGregorian('IFC:2024-06-29')).toBe('2024-06-17');
  });

  test('Year Day 2026', () => {
    expect(toGregorian('IFC:2026-13-29')).toBe('2026-12-31');
  });

  test('Jan 1 — first day of IFC year', () => {
    expect(toGregorian('IFC:2026-01-01')).toBe('2026-01-01');
  });

  test('Dec 28 — last normal IFC day before Year Day', () => {
    expect(toGregorian('IFC:2026-13-28')).toBe('2026-12-30');
  });

  test('throws without IFC: prefix', () => {
    expect(() => toGregorian('2024-06-17')).toThrow('IFC dates must be prefixed with "IFC:" e.g. IFC:2024-07-15');
  });

  test('throws on invalid month', () => {
    expect(() => toGregorian('IFC:2024-14-01')).toThrow('IFC month must be 1-13, got 14');
  });

  test('throws on day 30', () => {
    expect(() => toGregorian('IFC:2026-03-30')).toThrow('IFC day must be 1-29, got 30');
  });

  test('throws on day 29 in non-leap year June', () => {
    expect(() => toGregorian('IFC:2026-06-29')).toThrow('Leap Day only exists in leap years');
  });

  test('throws on day 29 for non-special month', () => {
    expect(() => toGregorian('IFC:2024-03-29')).toThrow('Day 29 only valid for June (leap years) or December');
  });

  test('round trip — Gregorian → IFC → Gregorian', () => {
    const start = '2024-08-15';
    const ifc   = toIFC(start);
    const back  = toGregorian(`IFC:${ifc.year}-${ifc.month}-${ifc.day}`);
    expect(back).toBe(start);
  });

  test('round trip — post leap day 2024', () => {
    const start = '2024-09-01';
    const ifc   = toIFC(start);
    const back  = toGregorian(`IFC:${ifc.year}-${ifc.month}-${ifc.day}`);
    expect(back).toBe(start);
  });

  test('round trip — Jan 1', () => {
    const start = '2026-01-01';
    const ifc   = toIFC(start);
    const back  = toGregorian(`IFC:${ifc.year}-${ifc.month}-${ifc.day}`);
    expect(back).toBe(start);
  });
});
