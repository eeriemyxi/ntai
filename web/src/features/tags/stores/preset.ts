import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { notify } from "@/components/Notifications";

const DEFAULT_PRESET = { name: "Default Preset", tagList: [], blacklistEnabled: false };

interface PresetState {
  activePreset: number;
  setActivePreset: (presetIndex: number) => void;
  setBlacklistStatus: (presetIndex: number, status: boolean) => void;
  presets: { name: string; tagList: string[]; blacklistEnabled: boolean; }[];
  addPreset: (name?: string, tagList?: string[]) => void;
  removePreset: (presetIndex?: number) => void;
  setPresetName: (name: string, presetIndex?: number) => void;
  getTags: (presetIndex?: number) => string[];
  addTag: (tag: string, presetIndex?: number) => void;
  removeTag: (tag: string, presetIndex?: number) => void;
  popTag: (presetIndex?: number) => string | undefined;
}

export const usePresetStore = create<PresetState>()(
  persist(
    immer(
      devtools((set, get) => ({
        activePreset: 0,
        setActivePreset: (presetIndex: number) => {
          set((state) => {
            if (presetIndex >= state.presets.length) {
              console.warn(
                `${presetIndex} >= ${state.presets.length}, ignoring`,
              );
              return;
            }
            if (presetIndex < 0) {
              console.warn(`${presetIndex} <= 0, ignoring`);
              return;
            }
            state.activePreset = presetIndex;
          });
        },
        setBlacklistStatus: (presetIndex: number, status: boolean) => {
          set(state => {
            state.presets[presetIndex].blacklistEnabled = status;
          });
        },
        presets: [DEFAULT_PRESET],
        addPreset: (name?: string, tagList?: string[], blacklistEnabled: boolean = false) => {
          set((state) => {
            if (!name || !tagList) {
              state.presets.push(DEFAULT_PRESET);
            } else {
              state.presets.push({
                name: name,
                tagList: tagList,
                blacklistEnabled: blacklistEnabled,
              });
            }
            notify({ message: "Added a new preset" });
          });
        },
        removePreset: (presetIndex?: number) => {
          set((state) => {
            const index = presetIndex ?? state.activePreset;

            const successText = `Removed preset "${state.presets[index].name}"`;
            state.presets.splice(index, 1);
            notify({ message: successText });

            if (state.presets.length == 0) {
              state.presets.push(DEFAULT_PRESET);
            }
            if (state.activePreset >= state.presets.length) {
              state.activePreset = state.presets.length - 1;
            }
          });
        },
        setPresetName: (name: string, presetIndex?: number) => {
          set((state) => {
            const index = presetIndex ?? state.activePreset;
            const successText = `Updated preset name from "${
              state.presets[index].name
            }" to "${name}"`;
            state.presets[index].name = name;
            notify({ message: successText });
          });
        },
        getTags: (presetIndex?: number) => {
          const state = get();
          const index = presetIndex ?? state.activePreset;
          return state.presets[index].tagList;
        },
        addTag: (tag: string, presetIndex?: number) => {
          set((state) => {
            const index = presetIndex ?? state.activePreset;
            if (!state.presets[index].tagList.includes(tag)) {
              state.presets[index].tagList.push(tag);
              notify({ message: `Added tag "${tag}"` });
            } else {
              notify({
                message: `Skipping adding tag "${tag}" because it already existed`,
              });
            }
          });
        },
        removeTag: (tag: string, presetIndex?: number) => {
          set((state) => {
            const index = presetIndex ?? state.activePreset;
            state.presets[index].tagList = state.presets[index].tagList.filter(
              (t) => t != tag,
            );
            notify({ message: `Removed tag "${tag}"` });
          });
        },
        popTag: (presetIndex?: number) => {
          const state = get();
          const index = presetIndex ?? state.activePreset;
          const lastTag = state.presets[index].tagList.at(-1);
          set((state) => {
            if (lastTag !== undefined) {
              state.presets[index].tagList = state.presets[index].tagList.slice(
                0,
                -1,
              );
              notify({ message: `Popped last tag "${lastTag}"` });
            }
          });
          return lastTag;
        },
      })),
    ),
    {
      name: "preset",
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          for (const key of Object.keys(persistedState.presets)) {
            persistedState.presets[key].blacklistEnabled = false;
          }
        }
      },
    },
  ),
);
