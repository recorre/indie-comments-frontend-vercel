// Setup for Jest testing of Web Components
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.customElements = {
  define: jest.fn(),
  get: jest.fn(),
  whenDefined: jest.fn()
};

// Mock HTMLElement for testing
global.HTMLElement = class MockHTMLElement {
  constructor() {
    this.shadow = {
      innerHTML: '',
      appendChild: jest.fn(),
      querySelector: jest.fn(),
      getElementById: jest.fn(() => ({ value: '', addEventListener: jest.fn(), textContent: '', className: '' }))
    };
    this.attachShadow = jest.fn(() => this.shadow);
    this.getAttribute = jest.fn();
    this.dispatchEvent = jest.fn();
  }
};

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};