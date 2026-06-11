require('@testing-library/jest-dom');

// Polyfill TextEncoder for jsdom (required by react-dom/server)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
