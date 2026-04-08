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
};

const getThemeColors = () => ({
  primary: {
    main: "#10b981",
    light: "#34d399",
    dark: "#059669",
  },
  ...themeColors.dark,
});

const initialState = {
  darkMode: true, // Only Dark Mode for V3
  sidebar: {
    open: true,
    width: 260,
    collapsedWidth: 72,
    variant: "persistent",
  },
  colors: getThemeColors(),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      // Disabled for V3 - always dark
      state.darkMode = true;
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