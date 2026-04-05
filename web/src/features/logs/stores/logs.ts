import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { type GalleryItem } from "@/fetching";

interface LogsState {
  items: Record<number, GalleryItem[]>;
  logItem: (presetIndex: number, item: GalleryItem) => void;
  isAlreadyLogged: (presetIndex: number, item: GalleryItem) => boolean;
}

export const useLogsStore = create<LogsState>()(
  persist(
    immer(
      devtools((set, get) => ({
        items: {},
        logItem: (presetIndex: number, item: GalleryItem) => {
          set((state) => {
            if (presetIndex in state.items) {
              for (const pitem of state.items[presetIndex]) {
                if (pitem.id == item.id) return;
              }
              state.items[presetIndex].push(item);
            } else {
              state.items[presetIndex] = [item];
            }
          });
        },
        isAlreadyLogged: (presetIndex: number, item: GalleryItem): boolean => {
          const state = get();
          if (presetIndex in state.items) {
            for (const pitem of state.items[presetIndex]) {
              if (pitem.id == item.id) return true;
            }
          }
          return false;
        },
      })),
    ),
    { name: "logs" },
  ),
);
