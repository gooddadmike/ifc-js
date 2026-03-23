// ─── Month names ──────────────────────────────────────────────────────────────
const IFC_MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun',
                     'Sol','Jul','Aug','Sep','Oct','Nov','Dec'];
const GREG_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                     'Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAYS    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ─── Core utilities ───────────────────────────────────────────────────────────
function isLeap(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function gregToDoy(year, month0, day) {
  const dim = [31, isLeap(year)?29:28, 31,30,31,30,31,31,30,31,30,31];
  let doy = day;
  for (let i = 0; i < month0; i++) doy += dim[i];
  return doy;
}

function doyToGreg(year, doy) {
  const dim = [31, isLeap(year)?29:28, 31,30,31,30,31,31,30,31,30,31];
  let rem = doy;
  for (let m = 0; m < 12; m++) {
    if (rem <= dim[m]) return { month: m, day: rem };
    rem -= dim[m];
  }
}

function ifcToDoy(year, mi, day) {
  if (mi === 6 && day === 29 && isLeap(year)) return 169;
  let doy = (mi - 1) * 28 + day;
  if (mi > 6 && isLeap(year)) doy += 1;
  return doy;
}

function doyToIfc(year, doy) {
  const leap    = isLeap(year);
  const yearLen = leap ? 366 : 365;
  if (leap && doy === 169) return { month: 6,  day: 29, weekday: null, isLeapDay: true,  isYearDay: false };
  if (doy === yearLen)      return { month: 13, day: 29, weekday: null, isLeapDay: false, isYearDay: true  };
  const adjDoy  = leap && doy > 169 ? doy - 1 : doy;
  const mi      = Math.floor((adjDoy - 1) / 28) + 1;
  const day     = (adjDoy - 1) % 28 + 1;
  const weekday = (day - 1) % 7;
  return { month: mi, day, weekday, isLeapDay: false, isYearDay: false };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Converts a Gregorian ISO date string to an IFC date object.
 * @param {string} [input] - ISO date string e.g. '2024-06-17'. Omit for today.
 * @returns {{ year: number, month: number, day: number, weekday: number|null, isLeapDay: boolean, isYearDay: boolean }}
 */
function toIFC(input) {
  let year, month0, day;
  if (input) {
    const [y, m, d] = String(input).split('-').map(Number);
    year   = y;
    month0 = m - 1;
    day    = d;
    if (isNaN(year) || isNaN(month0) || isNaN(day)) throw new Error(`Invalid date: ${input}`);
  } else {
    const now = new Date();
    year   = now.getFullYear();
    month0 = now.getMonth();
    day    = now.getDate();
  }
  const doy = gregToDoy(year, month0, day);
  return { year, ...doyToIfc(year, doy) };
}

/**
 * Converts an IFC date to a Gregorian ISO date string.
 * Accepts either an IFC date string ('IFC:YYYY-MM-DD') or an IFC date object.
 * @param {string|{ year: number, month: number, day: number }} input
 * @returns {string} Gregorian ISO date string e.g. '2024-06-17'
 */
function toGregorian(input) {
  let year, month, day;

  if (typeof input === 'object' && input !== null) {
    ({ year, month, day } = input);
    if (!year || !month || !day) throw new Error('IFC date object must have year, month and day');
  } else if (typeof input === 'string') {
    if (!input.startsWith('IFC:')) {
      throw new Error('IFC dates must be prefixed with "IFC:" e.g. IFC:2024-07-15');
    }
    const parts = input.slice(4).split('-').map(Number);
    [year, month, day] = parts;
    if (!year || !month || !day) throw new Error(`Invalid IFC date format: ${input}`);
  } else {
    throw new Error('toGregorian requires an IFC date string or object');
  }

  if (month < 1 || month > 13) throw new Error(`IFC month must be 1-13, got ${month}`);
  if (day < 1 || day > 29)     throw new Error(`IFC day must be 1-29, got ${day}`);
  if (day === 29) {
    if (month === 6 && !isLeap(year)) throw new Error('Leap Day only exists in leap years');
    if (month !== 6 && month !== 13)  throw new Error('Day 29 only valid for June (leap years) or December');
  }

  const doy  = ifcToDoy(year, month, day);
  const g    = doyToGreg(year, doy);
  const date = new Date(year, g.month, g.day);
  return date.toISOString().split('T')[0];
}

export { toIFC, toGregorian, isLeap };

