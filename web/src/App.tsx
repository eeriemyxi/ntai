import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { useLogsStore } from "@/features/logs";
import { LogsDialog } from "@/features/logs";
import { SettingsSheet } from "@/features/settings/components/SettingsSheet";
import { TagInput } from "@/features/tags/components/TagInput";
import { usePresetStore } from "@/features/tags/stores/preset";
import { useTheme } from "@/features/theming/theme";
import { NHENTAI_ORIGIN, randomNhentai } from "@/fetching";

function App() {
  useTheme();
  const activePreset = usePresetStore((state) => {
    const index = state.activePreset;
    return state.presets[index];
  });
  const logStore = useLogsStore(
    useShallow((state) => ({ items: state.items, logItem: state.logItem })),
  );
  return (
    <div className="flex flex-col items-center w-full h-full min-h-svh p-4">
      <div className="flex self-end gap-2">
        <LogsDialog />
        <SettingsSheet />
      </div>
      <div className="flex flex-col items-center w-full max-w-md gap-2 flex-1 justify-center">
        <TagInput />
        <Button
          onClick={async () => {
            const result = await randomNhentai(activePreset.tagList);
            if (!result) {
              console.error("Couldn't find any. TODO");
              return;
            }
            logStore.logItem(result);
            window.open(new URL(`/g/${result?.id}`, NHENTAI_ORIGIN), "_blank");
          }}
        >
          Search
        </Button>
      </div>
    </div>
  );
}

export default App;
