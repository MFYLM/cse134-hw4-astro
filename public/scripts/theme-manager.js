/**
 * Theme Manager
 * Handles theme initialization and application
 */

import { getCurrentTheme, applyTheme } from './theme-config.js';

(function() {
  'use strict';

  /**
   * Initialize theme on page load
   */
  function initTheme() {
    const theme = getCurrentTheme();
    applyTheme(theme);
    console.log('Theme initialized:', theme.name);
  }

  // Initialize theme immediately to prevent flash of unstyled content
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Listen for theme change events from the settings component
  window.addEventListener('themeChange', (event) => {
    const theme = event.detail;
    applyTheme(theme);
    console.log('Theme changed:', theme.name);
  });

  console.log('Theme manager initialized');
})();
