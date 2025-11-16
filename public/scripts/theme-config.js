/**
 * Theme Configuration System
 * Supports multiple predefined themes and custom theme creation
 */

// Predefined color options for user-friendly selection
export const COLOR_OPTIONS = {
  // Text colors
  text: {
    'Black': '#111827',
    'Dark Gray': '#374151',
    'Gray': '#6b7280',
    'White': '#f9fafb',
    'Off-White': '#e5e7eb',
    'Cream': '#fef3c7',
    'Beige': '#d1c4a5'
  },
  // Background colors
  background: {
    'White': '#ffffff',
    'Off-White': '#f9fafb',
    'Light Gray': '#f3f4f6',
    'Beige': '#fef3c7',
    'Cream': '#fef9e7',
    'Navy': '#1e293b',
    'Dark Blue': '#0f172a',
    'Black': '#0a0a0a',
    'Dark Gray': '#1f2937',
    'Forest Green': '#1a3a2e',
    'Deep Purple': '#1a1626',
    'Warm Brown': '#2d2419'
  }
};

// Font family options
export const FONT_OPTIONS = {
  'Sans Serif': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  'Serif': 'Georgia, "Times New Roman", Times, serif',
  'Monospace': '"Courier New", Courier, monospace',
  'Classic': 'Garamond, Baskerville, "Times New Roman", serif',
  'Modern': '"Helvetica Neue", Helvetica, Arial, sans-serif',
  'Rounded': '"Comic Sans MS", "Trebuchet MS", cursive'
};

// Predefined themes
export const THEMES = {
  'Light': {
    name: 'Light',
    textColor: COLOR_OPTIONS.text['Black'],
    backgroundColor: COLOR_OPTIONS.background['White'],
    font: FONT_OPTIONS['Sans Serif'],
    textColorName: 'Black',
    backgroundColorName: 'White',
    fontName: 'Sans Serif'
  },
  'Dark': {
    name: 'Dark',
    textColor: COLOR_OPTIONS.text['White'],
    backgroundColor: COLOR_OPTIONS.background['Dark Gray'],
    font: FONT_OPTIONS['Sans Serif'],
    textColorName: 'White',
    backgroundColorName: 'Dark Gray',
    fontName: 'Sans Serif'
  },
  'High Contrast': {
    name: 'High Contrast',
    textColor: COLOR_OPTIONS.text['White'],
    backgroundColor: COLOR_OPTIONS.background['Black'],
    font: FONT_OPTIONS['Sans Serif'],
    textColorName: 'White',
    backgroundColorName: 'Black',
    fontName: 'Sans Serif'
  },
  'Sepia': {
    name: 'Sepia',
    textColor: COLOR_OPTIONS.text['Dark Gray'],
    backgroundColor: COLOR_OPTIONS.background['Beige'],
    font: FONT_OPTIONS['Serif'],
    textColorName: 'Dark Gray',
    backgroundColorName: 'Beige',
    fontName: 'Serif'
  },
  'Ocean': {
    name: 'Ocean',
    textColor: COLOR_OPTIONS.text['Off-White'],
    backgroundColor: COLOR_OPTIONS.background['Navy'],
    font: FONT_OPTIONS['Sans Serif'],
    textColorName: 'Off-White',
    backgroundColorName: 'Navy',
    fontName: 'Sans Serif'
  },
  'Forest': {
    name: 'Forest',
    textColor: COLOR_OPTIONS.text['Cream'],
    backgroundColor: COLOR_OPTIONS.background['Forest Green'],
    font: FONT_OPTIONS['Modern'],
    textColorName: 'Cream',
    backgroundColorName: 'Forest Green',
    fontName: 'Modern'
  },
  'Midnight': {
    name: 'Midnight',
    textColor: COLOR_OPTIONS.text['White'],
    backgroundColor: COLOR_OPTIONS.background['Deep Purple'],
    font: FONT_OPTIONS['Sans Serif'],
    textColorName: 'White',
    backgroundColorName: 'Deep Purple',
    fontName: 'Sans Serif'
  }
};

// Storage keys
export const STORAGE_KEYS = {
  THEME_NAME: 'theme-name',
  CUSTOM_THEME: 'custom-theme'
};

/**
 * Get the current theme from localStorage
 * @returns {Object} The current theme object
 */
export function getCurrentTheme() {
  try {
    const themeName = localStorage.getItem(STORAGE_KEYS.THEME_NAME);

    // Check if it's a custom theme
    if (themeName === 'Custom') {
      const customTheme = localStorage.getItem(STORAGE_KEYS.CUSTOM_THEME);
      if (customTheme) {
        return JSON.parse(customTheme);
      }
    }

    // Return predefined theme or default to Light
    return THEMES[themeName] || THEMES['Light'];
  } catch (e) {
    console.warn('Could not load theme:', e);
    return THEMES['Light'];
  }
}

/**
 * Save theme to localStorage
 * @param {string} themeName - Name of the theme
 * @param {Object} customTheme - Custom theme object (optional)
 */
export function saveTheme(themeName, customTheme = null) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME_NAME, themeName);

    if (themeName === 'Custom' && customTheme) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_THEME, JSON.stringify(customTheme));
    }

    console.log(`Theme saved: ${themeName}`);
  } catch (e) {
    console.warn('Could not save theme:', e);
  }
}

/**
 * Apply theme to the document
 * @param {Object} theme - Theme object with textColor, backgroundColor, and font
 */
export function applyTheme(theme) {
  document.documentElement.style.setProperty('--theme-text-color', theme.textColor);
  document.documentElement.style.setProperty('--theme-bg-color', theme.backgroundColor);
  document.documentElement.style.setProperty('--theme-font', theme.font);

  // Calculate contrasting colors for UI elements
  const isDark = isColorDark(theme.backgroundColor);
  const cardBg = isDark ? lighten(theme.backgroundColor, 10) : darken(theme.backgroundColor, 5);
  const borderColor = isDark ? lighten(theme.backgroundColor, 20) : darken(theme.backgroundColor, 15);
  const linkColor = isDark ? lighten(theme.textColor, 10) : '#667eea';

  document.documentElement.style.setProperty('--theme-card-bg', cardBg);
  document.documentElement.style.setProperty('--theme-border-color', borderColor);
  document.documentElement.style.setProperty('--theme-link-color', linkColor);
}

/**
 * Check if a color is dark
 * @param {string} hexColor - Hex color code
 * @returns {boolean} True if the color is dark
 */
function isColorDark(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

/**
 * Lighten a hex color
 * @param {string} hexColor - Hex color code
 * @param {number} percent - Percentage to lighten
 * @returns {string} Lightened hex color
 */
function lighten(hexColor, percent) {
  const hex = hexColor.replace('#', '');
  const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.round(255 * percent / 100));
  const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.round(255 * percent / 100));
  const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.round(255 * percent / 100));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Darken a hex color
 * @param {string} hexColor - Hex color code
 * @param {number} percent - Percentage to darken
 * @returns {string} Darkened hex color
 */
function darken(hexColor, percent) {
  const hex = hexColor.replace('#', '');
  const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.round(255 * percent / 100));
  const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.round(255 * percent / 100));
  const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.round(255 * percent / 100));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
