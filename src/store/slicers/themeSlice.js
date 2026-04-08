// src/store/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const themeColors = {
  dark: {
    background: {
      default: "#050505",
      paper: "#121212",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
    divider: "rgba(255, 255, 255, 0.05)",
    header: "#080808",
    sidebar: {
      background: "#080808",
      activeItem: "rgba(16, 185, 129, 0.15)",
      text: "#f8fafc",
      hover: "rgba(16, 185, 129, 0.08)",
    },
  },
  light: {
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#6b7280",
    },
    divider: "rgba(0, 0, 0, 0.08)",
    header: "#ffffff",
    sidebar: {
      background: "#ffffff",
      activeItem: "rgba(16, 185, 129, 0.1)",
      text: "#1a1a1a",
      hover: "rgba(16, 185, 129, 0.05)",
    },
  },
};

const getThemeColors = (darkMode) => {
  const mode = darkMode ? "dark" : "light";
  return {
    primary: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
    },
    ...themeColors[mode],
  };
};

// Load theme from localStorage or default to true (dark)
const savedTheme = localStorage.getItem("darkMode");
const initialDarkMode = savedTheme !== null ? JSON.parse(savedTheme) : true;

const initialState = {
  darkMode: initialDarkMode,
  sidebar: {
    open: true,
    width: 260,
    collapsedWidth: 72,
    variant: "persistent",
  },
  colors: getThemeColors(initialDarkMode),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      state.colors = getThemeColors(state.darkMode);
      // Save to localStorage
      localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
    },
    toggleSidebar: (state) => {
      state.sidebar.open = !state.sidebar.open;
    },
  },
});

export const { toggleTheme, toggleSidebar } = themeSlice.actions;
export const selectDarkMode = (state) => state.theme.darkMode;
export const selectSidebarOpen = (state) => state.theme.sidebar.open;
export const selectColors = (state) => state.theme.colors;

export default themeSlice.reducer;
