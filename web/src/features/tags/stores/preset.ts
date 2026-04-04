import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const DEFAULT_PRESET = { name: "Default Preset", tagList: [] };

interface PresetState {
  activePreset: number;
  setActivePreset: (presetIndex: number) => void;
  presets: { name: string; tagList: string[] }[];
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
        presets: [DEFAULT_PRESET],
        addPreset: (name?: string, tagList?: string[]) => {
          set((state) => {
            if (!name || !tagList) {
              state.presets.push(DEFAULT_PRESET);
            } else {
              state.presets.push({ name: name, tagList: tagList });
            }
            toast.success("Added a new preset");
          });
        },
        removePreset: (presetIndex?: number) => {
          set((state) => {
            const index = presetIndex ?? state.activePreset;

            const successText = `Removed preset "${state.presets[index].name}"`;
            state.presets.splice(index, 1);
            toast.success(successText);

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
            const successText = `Updated preset name from "${state.presets[index].name}" to "${name}"`;
            state.presets[index].name = name;
            toast.success(successText);
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
              toast.success(`Added tag "${tag}"`);
            } else {
              toast.info(
                `Skipping adding tag "${tag}" because it already existed`,
              );
            }
          });
        },
        removeTag: (tag: string, presetIndex?: number) => {
          set((state) => {
            const index = presetIndex ?? state.activePreset;
            state.presets[index].tagList = state.presets[index].tagList.filter(
              (t) => t != tag,
            );
            toast.success(`Removed tag "${tag}"`);
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
              toast.success(`Popped last tag "${lastTag}"`);
            }
          });
          return lastTag;
        },
      })),
    ),
    { name: "preset" },
  ),
);
