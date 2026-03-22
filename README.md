# @gooddadmike/ifc-js

A lightweight JavaScript library for converting dates between the normal
Gregorian calendar and the International Fixed Calendar (IFC).

---

## What is the International Fixed Calendar?

The International Fixed Calendar is a proposed alternative calendar featuring
13 months with 28 days in each month for a total of 364 days in a normal
year. Every date falls on the same weekday every year. Your birthday is always
on the same day of the week. The first of every month is always a Sunday.
Most civil holidays stay put.

Got something you want to do every other day? Using IFC you can just plan to
do it on even or odd days and the date number alone tells you whether today
is your day — just watch out for the two bonus days explained below.

Months: Jan, Feb, Mar, Apr, May, Jun, **Sol**, Jul, Aug, Sep, Oct, Nov, Dec

### Bonus Days

The IFC has two special days called intercalary days. Intercalary means
inserted between — these days exist outside the normal week structure. They
have no weekday name and do not belong to any week.

- 🎆 **Year Day** (Dec 29) — the last day of every year. It sits after
  December 28th, outside the week, before the new year begins. Think of it
  as New Years Eve given its own special status outside the normal calendar.

- ☀️ **Leap Day** (Jun 29) — appears only in leap years, after June 28th.
  Like Year Day it has no weekday. It is a midsummer holiday that shows up
  once every four years, completely outside the flow of the week.

---

## Live Demos

Both demos are built entirely on this package via CDN. View source to see
the reference implementation.

### 🕐 IFC Desk Clock
[Open Desk Clock →](https://gooddadmike.github.io/ifc-js/desk-clock.html)

A desk clock is something you keep open for reference. Seeing the IFC date
alongside the Gregorian date every time you glance at the time is how the
IFC date starts to become meaningful rather than abstract. The same way
someone learning military time sets their watch and lets their brain gradually
build the mapping — the desk clock keeps both systems in view so the IFC date
becomes familiar over time. The IFC date might start feeling as natural as
the Gregorian one depending on your other obligations.

### 📅 IFC Calendars
[Open Calendars →](https://gooddadmike.github.io/ifc-js/calendars.html)

An interactive dual calendar. Find any date on either side and the equivalent
date in the other calendar is shown instantly. Browse by month and year
independently on each side. Handles all edge cases — Leap Day, Year Day, and
the Sol month.

---

## How the Math Works

This is a plain English explanation of how a Gregorian date becomes an IFC
date. No code required.

Every date in a year has a position — January 1st is day 1, January 2nd is
day 2, and so on up to day 365 (or 366 in a leap year). This is called the
day of year.

To get the day of year for any Gregorian date, add up the days in each month
before it then add the day of the month. March 22nd for example: January has
31 days, February has 28 days in a normal year, so 31 + 28 + 22 = day 81.

Now divide by 28. Each IFC month is exactly 28 days so this tells you which
month you are in. Day 81 divided by 28 is 2 remainder 25 — IFC month 3
(March), day 25. That is how March 22nd Gregorian becomes IFC March 25th.

The day of year is the bridge. Both calendars describe the same sequence of
days — they just slice it differently. A small adjustment is made in the
calculation to account for Leap Day and Year Day.

---

## Install
```bash
npm install @gooddadmike/ifc-js
```

For the CLI:
```bash
npm install -g @gooddadmike/ifc-js
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
const { toIFC } = require('@gooddadmike/ifc-js');

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
const { toGregorian } = require('@gooddadmike/ifc-js');

toGregorian('IFC:2024-06-29');  // '2024-06-17'  (Leap Day)
toGregorian('IFC:2026-07-01');  // '2026-06-18'  (Sol 1)
toGregorian('IFC:2026-13-29');  // '2026-12-31'  (Year Day)
```

---

### `isLeap(year)`

Returns `true` if the given year is a leap year.
```js
const { isLeap } = require('@gooddadmike/ifc-js');

isLeap(2024);  // true
isLeap(2026);  // false
isLeap(1900);  // false
isLeap(2000);  // true
```

---

### ES Modules
```js
import { toIFC, toGregorian, isLeap } from '@gooddadmike/ifc-js';
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

## Timezones

`toIFC()` with no argument uses the local system time. To use a specific
timezone, pass an ISO string calculated in that zone:
```js
const iso = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'UTC'
}).format(new Date());

toIFC(iso);
```

Replace `'UTC'` with any IANA timezone string such as `'America/New_York'`,
`'Europe/London'`, or `'Pacific/Auckland'`.

---

## Implementations

- [pebble-ifc-complication](https://github.com/gooddadmike/pebble-ifc-complication) — Pebble watch face complication built on this package

---

## Contributing

See [CONTRIBUTING.md](https://github.com/gooddadmike/ifc-js/blob/main/CONTRIBUTING.md) for guidelines.

---

## Credits

- [Lucide Icons](https://lucide.dev) — MIT
- [Marked.js](https://marked.js.org) — MIT
- [jsDelivr](https://jsdelivr.com) — free open source CDN

---

## License

MIT

