// client/src/setupTests.js
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Mock window.matchMedia for dark mode testing
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Configure test-id attribute
configure({ testIdAttribute: 'data-test' });