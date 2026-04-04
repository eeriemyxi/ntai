import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface ThemeState {
  activeTheme: Theme;
  setActiveTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    immer(
      devtools((set) => ({
        activeTheme: "light",
        setActiveTheme: (theme: Theme) => {
          set((state) => {
            state.activeTheme = theme;
          });
        },
      })),
    ),
    { name: "core" },
  ),
);
