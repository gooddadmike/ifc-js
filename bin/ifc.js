#!/usr/bin/env node
'use strict';

const { toIFC, toGregorian } = require('../src/index.js');

const pad = n => String(n).padStart(2, '0');
const fmt = r => `IFC:${r.year}-${pad(r.month)}-${pad(r.day)}`;

const arg = process.argv[2];

try {
  if (!arg) {
    console.log(fmt(toIFC()));
  } else if (arg.startsWith('IFC:')) {
    console.log(toGregorian(arg));
  } else {
    console.log(fmt(toIFC(arg)));
  }
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}

