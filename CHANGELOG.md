# Changelog

All notable changes to `ifc-js` will be documented here.

> This library's core calendar math originated in
> [pebble-ifc-complication](https://github.com/gooddadmike/pebble-ifc-complication),
> a Pebble watch widget package. It was extracted, corrected, and
> published here as a standalone universal library. For pre-extraction
> history see that repo's commit log.

## [1.0.0] - 2026-03-22
### Added
- `toIFC(date?)` — Gregorian ISO string or Date to IFC result object
- `toGregorian(ifcString)` — IFC: prefixed string to Gregorian ISO string
- `isLeap(year)` — leap year utility export
- CLI via `ifc` command — no args for today, accepts Gregorian or IFC: strings
- CommonJS and ES module exports
- Full Jest test suite covering edge cases, special days, and round trips

### Fixed
- DST off-by-one: date strings parsed manually via split('-') rather than
  new Date() to avoid 1-hour spring-forward causing wrong day-of-year
- Leap Day correctly at doy 169, not 181
- All months after Sol correctly offset by 1 in leap years

