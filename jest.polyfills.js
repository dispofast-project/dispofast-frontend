/**
 * Polyfills for jsdom test environment.
 * These APIs are not provided by jsdom but are needed by some dependencies.
 */

const { TextDecoder, TextEncoder } = require('util');

Object.defineProperty(globalThis, 'TextDecoder', {
  writable: true,
  value: TextDecoder,
});

Object.defineProperty(globalThis, 'TextEncoder', {
  writable: true,
  value: TextEncoder,
});
