# ifc-js

A lightweight JavaScript library for converting dates between the Gregorian
calendar and the International Fixed Calendar (IFC).

## What is the International Fixed Calendar?

The Gregorian calendar has months of 28, 29, 30, and 31 days so your
birthday falls on a different weekday every year and nothing lines up
neatly. The International Fixed Calendar fixes this.

13 months x 28 days = 364 days. Every date falls on the same weekday every
year. Your birthday is always on the same day of the week. The first of every
month is always a Sunday. Most civil holidays stay put.

Got something you do every other day? Water the plants, take a supplement,
whatever it is. With IFC you can just look at the date number and know. With
Gregorian, months can end on an odd day so you would have to skip a day just
to stay on schedule. IFC months always end on day 28. No skipping. Ever.

Months: Jan, Feb, Mar, Apr, May, Jun, **Sol**, Jul, Aug, Sep, Oct, Nov, Dec

### Bonus Days

The remaining day (or two in a leap year) becomes something more interesting
than just another Tuesday. These intercalary days sit at the end of their
month like a 29th day but belong to no week and no weekday.

- 🎆 **Year Day** (Dec 29) — after the last day of December every year.
  New Year's Eve elevated: a day outside the week, a pause between years.
- ☀️ **Leap Day** (Jun 29) — after June 28 in leap years only. In any
  normal IFC month, day 28 is a Saturday. Instead of a lost Sunday, this
  becomes a once every four years midsummer holiday outside the week entirely.

---

## Install
```bash
npm install ifc-js
```

For the CLI:
```bash
npm install -g ifc-js
```

---

## CLI
```bash
# Today's date in IFC
ifc

# Gregorian to IFC
ifc 2024-06-17

# IFC to Gregorian
ifc IFC:2024-06-29
```

Output:
```
IFC:2026-03-25
IFC:2024-06-29
2024-06-17
```

---

## API

### `toIFC(date?)`

Converts a Gregorian date to an IFC result object.
```js
const { toIFC } = require('ifc-js');

toIFC('2026-03-22');
// {
//   year: 2026,
//   month: 3,
//   day: 25,
//   weekday: 4,       // 0=Sun, 1=Mon ... 6=Sat
//   isLeapDay: false,
//   isYearDay: false
// }

toIFC('2024-06-17');
// { year: 2024, month: 6, day: 29, weekday: null, isLeapDay: true, isYearDay: false }

toIFC('2026-12-31');
// { year: 2026, month: 13, day: 29, weekday: null, isLeapDay: false, isYearDay: true }

// No argument uses today
toIFC();
```

Months are 1-based: 1=January, 7=Sol, 13=December.
`weekday` is `null` for Leap Day and Year Day as they have no weekday.

---

### `toGregorian(ifcString)`

Converts an IFC date string to a Gregorian ISO date string.
```js
const { toGregorian } = require('ifc-js');

toGregorian('IFC:2024-06-29');  // '2024-06-17'  (Leap Day)
toGregorian('IFC:2026-07-01');  // '2026-06-18'  (Sol 1)
toGregorian('IFC:2026-13-29');  // '2026-12-31'  (Year Day)
```

---

### `isLeap(year)`

Returns `true` if the given year is a leap year.
```js
const { isLeap } = require('ifc-js');

isLeap(2024);  // true
isLeap(2026);  // false
isLeap(1900);  // false
isLeap(2000);  // true
```

---

### ES Modules
```js
import { toIFC, toGregorian, isLeap } from 'ifc-js';
```

---

## IFC Date Format

IFC dates must use the `IFC:` prefix. Without it the parser assumes
Gregorian. This is not optional. The same numeric string means different
things in each calendar:
```
2024-07-15       -> Gregorian July 15
IFC:2024-07-15   -> IFC Sol 15 (Gregorian July 2nd)
```

IFC month numbers are 1-based and go up to 13:

| Number | Month   |
|--------|---------|
| 1 - 6  | Jan-Jun |
| 7      | Sol     |
| 8 - 13 | Jul-Dec |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT
