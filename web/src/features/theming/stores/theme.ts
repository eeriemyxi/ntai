import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { Theme } from "../types";

interface ThemeState {
  activeTheme: Theme;
  setActiveTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    immer(
      devtools((set): ThemeState => ({
        activeTheme: Theme.Light,
        setActiveTheme: (theme: Theme) => {
          set((state) => {
            state.activeTheme = theme;
          });
        },
      })),
    ),
    { name: "themes" },
  ),
);
