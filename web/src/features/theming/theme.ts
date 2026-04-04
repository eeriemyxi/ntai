import { useEffect } from "react";

import { useShallow } from "zustand/react/shallow";

import { Theme } from "./";
import { useThemeStore } from "./stores/theme";

export function useTheme(theme?: Theme) {
  const [activeTheme] = useThemeStore(
    useShallow((state) => [state.activeTheme]),
  );

  useEffect(() => {
    const html = document.querySelector("html");
    if (html === null) {
      return;
    }
    if ((theme ?? activeTheme) == Theme.Light) {
      html.classList.add("light");
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
      html.classList.remove("light");
    }
  }, [activeTheme]);
}
