import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface CoreState {
  useCubariLinks: boolean;
  setUseCubariLinks: (state: boolean) => void;
}

export const useCoreStore = create<CoreState>()(
  persist(
    immer(
      devtools((set): CoreState => ({
        useCubariLinks: false,
        setUseCubariLinks: (state: boolean) => {
          set((st) => {
            st.useCubariLinks = state;
          });
        },
      })),
    ),
    { name: "core" },
  ),
);
