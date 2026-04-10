import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@app_theme_preference';

// 'system' | 'light' | 'dark'
const ThemeContext = createContext({
  colorScheme: 'light',
  themePreference: 'system', 
  setThemePreference: () => {},
  isDark: false,
});

export function ThemeProvider({ children }) {
  const systemColorScheme = useSystemColorScheme();
  const [themePreference, setThemePreferenceState] = useState('system');
  const [loaded, setLoaded] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setThemePreferenceState(saved);
      }
      setLoaded(true);
    }).catch(() => {
      setLoaded(true);
    });
  }, []);

  const setThemePreference = useCallback(async (pref) => {
    setThemePreferenceState(pref);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, pref);
    } catch (e) {
      console.error('Failed to save theme preference:', e);
    }
  }, []);

  // Resolve the actual color scheme
  const colorScheme = themePreference === 'system'
    ? (systemColorScheme || 'light')
    : themePreference;

  const toggleTheme = useCallback(async () => {
    // Toggle based on current resolved scheme
    const next = colorScheme === 'dark' ? 'light' : 'dark';
    setThemePreferenceState(next);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (e) {
      console.error('Failed to save theme preference:', e);
    }
  }, [colorScheme]);

  const isDark = colorScheme === 'dark';

  // Don't render until preference is loaded to avoid theme flash
  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ colorScheme, themePreference, setThemePreference, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to get the current resolved theme and change theme preference.
 * Returns { colorScheme, themePreference, setThemePreference, isDark }
 */
export function useTheme() {
  return useContext(ThemeContext);
}
