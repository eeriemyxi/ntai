import { AppShell, Button, Center, Group, MantineProvider, Stack, Tooltip } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { useShallow } from "zustand/react/shallow";

import { useLogsStore } from "@/features/logs/stores/logs";
import { TagMenu } from "@/features/tags/";
import { usePresetStore } from "@/features/tags/stores/preset";
import { bookUrl, ErrorType, randomNhentai } from "@/fetching";

import { Notifications } from "@mantine/notifications";
import { Search } from "lucide-react";
import { notify } from "./components/Notifications";
import { LogsModal } from "./features/logs/";
import { SettingsDrawer } from "./features/settings/";
import { useThemeStore } from "./features/theming";

function App() {
  const theme = useThemeStore((state) => state.activeTheme);
  const [activePreset, activePresetIndex] = usePresetStore(useShallow((state) => {
    const index = state.activePreset;
    return [state.presets[index], index];
  }));
  const logStore = useLogsStore(
    useShallow((state) => ({ items: state.items, logItem: state.logItem })),
  );

  return (
    <MantineProvider forceColorScheme={theme}>
      <Notifications />
      <ModalsProvider>
        <AppShell>
          <AppShell.Main pos="relative">
            <Group pos="absolute" top="1rem" right="1rem" gap="sm">
              <LogsModal />
              <SettingsDrawer />
            </Group>
            <Center h="100vh">
              <Stack w="100%">
                <TagMenu />
                <Tooltip label="Search for a random book based on this preset">
                  <Button
                    variant="default"
                    leftSection={<Search size={16} />}
                    w={{ base: "30%", sm: "20%" }}
                    mx="auto"
                    onClick={async () => {
                      const [result, err] = await randomNhentai(
                        activePreset.tagList,
                        undefined,
                        activePreset.blacklistEnabled
                          ? logStore.items[activePresetIndex]
                          : undefined,
                      );
                      console.log(result, err);

                      if (err === ErrorType.NO_PAGES) {
                        const msg = `No pages found.` + (activePreset.blacklistEnabled
                          ? " Note: you have blacklist feature enabled."
                          : "");
                        notify({ message: msg, color: "red" });
                        return;
                      }

                      if (result) {
                        logStore.logItem(activePresetIndex, result);
                        window.open(bookUrl(result), "_blank");
                      }
                    }}>
                    Search
                  </Button>
                </Tooltip>
              </Stack>
            </Center>
          </AppShell.Main>
        </AppShell>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
