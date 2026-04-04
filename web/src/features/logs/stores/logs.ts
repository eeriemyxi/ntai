import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { type GalleryItem } from "@/fetching";

interface LogsState {
  items: Record<number, GalleryItem>;
  logItem: (item: GalleryItem) => void;
}

export const useLogsStore = create<LogsState>()(
  persist(
    immer(
      devtools((set) => ({
        items: {},
        logItem: (item: GalleryItem) => {
          set((state) => {
            state.items[item.id] = item;
          });
        },
      })),
    ),
    { name: "logs" },
  ),
);
