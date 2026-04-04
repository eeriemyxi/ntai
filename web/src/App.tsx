import {
  AppShell,
  Button,
  Center,
  Group,
  MantineProvider,
  Stack,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { useShallow } from "zustand/react/shallow";

import { useLogsStore } from "@/features/logs/stores/logs";
import { TagInput } from "@/features/tags/components/TagInput";
import { usePresetStore } from "@/features/tags/stores/preset";
import { bookUrl, randomNhentai } from "@/fetching";

import { LogsModal } from "./features/logs/";
import { SettingsDrawer } from "./features/settings/";
import { useThemeStore } from "./features/theming";

function App() {
  const theme = useThemeStore((state) => state.activeTheme);
  const activePreset = usePresetStore((state) => {
    const index = state.activePreset;
    return state.presets[index];
  });
  const logStore = useLogsStore(
    useShallow((state) => ({ items: state.items, logItem: state.logItem })),
  );

  return (
    <MantineProvider forceColorScheme={theme}>
      <ModalsProvider>
        <AppShell>
          <AppShell.Main pos="relative">
            <Group pos="absolute" top="1rem" right="1rem" gap="sm">
              <LogsModal />
              <SettingsDrawer />
            </Group>
            <Center h="100vh">
              <Stack w="100%">
                <TagInput />
                <Button
                  variant="default"
                  w={{ base: "30%", sm: "20%" }}
                  mx="auto"
                  onClick={async () => {
                    const result = await randomNhentai(activePreset.tagList);
                    if (!result) {
                      console.error("Couldn't find any. TODO");
                      return;
                    }
                    logStore.logItem(result);
                    window.open(bookUrl(result), "_blank");
                  }}
                >
                  Search
                </Button>
              </Stack>
            </Center>
          </AppShell.Main>
        </AppShell>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
