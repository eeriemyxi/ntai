import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { type GalleryItem } from "@/fetching";

interface LogsState {
  items: Record<number, GalleryItem[]>;
  logItem: (presetIndex: number, item: GalleryItem) => void;
  removeLogItem: (presetIndex: number, item?: number | GalleryItem, index?: number) => void;
  removeLogIndex: (presetIndex: number) => void;
  isAlreadyLogged: (presetIndex: number, item: GalleryItem) => boolean;
}

export const useLogsStore = create<LogsState>()(
  persist(
    immer(
      devtools((set, get): LogsState => ({
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
        removeLogIndex: (presetIndex: number) => {
          set(state => {
            delete state.items[presetIndex];
          });
        },
        removeLogItem: (presetIndex: number, item?: number | GalleryItem, index?: number) => {
          set(state => {
            if (index !== undefined) {
              state.items[presetIndex].splice(index, 1);
              return;
            }

            if (item instanceof Object) item = item.id;

            for (const pitem of state.items[presetIndex]) {
              if (pitem.id === item) {
                state.items[presetIndex] = state.items[presetIndex].filter(i => i.id != item);
              }
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
