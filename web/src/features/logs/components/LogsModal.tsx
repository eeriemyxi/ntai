import {
  Button,
  Center,
  Image,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Tabs,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { History } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { bookUrl, thumbnailUrl } from "@/fetching";

import { usePresetStore } from "@/features/tags/";
import { useLogsStore } from "../";
import classes from "./Styles.module.css";

export function LogsModal() {
  const logStore = useLogsStore(
    useShallow((state) => ({ items: state.items, logItem: state.logItem })),
  );
  const presetStore = usePresetStore(
    useShallow((state) => ({
      activePresetIndex: state.activePreset,
      presets: state.presets,
    })),
  );
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Button
      leftSection={<History size={16} />}
      variant="default"
      color="dark"
      size="xs"
      fw="normal"
      onClick={() =>
        modals.open({
          title: "History",
          size: "90%",
          fullScreen: isMobile,
          scrollAreaComponent: (props) => (
            <ScrollArea.Autosize
              {...props}
              type="scroll"
              scrollbarSize={6}
              scrollHideDelay={100}
              offsetScrollbars />
          ),
          children: (
            <Stack>
              <Tabs defaultValue={presetStore.activePresetIndex.toString()}>
                <Tabs.List mb="md">
                  {presetStore.presets.map((preset, index) => (
                    <Tabs.Tab key={index} value={index.toString()}>
                      {`(${index + 1}) ${preset.name}`}
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
                {Object.entries(logStore.items).map(([index, books]) => (
                  <Tabs.Panel value={index.toString()} key={index}>
                    <SimpleGrid cols={{ base: 1, sm: 3, md: 4, lg: 5 }}>
                      {Object.values(books).map((model, index) => (
                        <Paper
                          key={index}
                          withBorder
                          component="a"
                          href={bookUrl(model)}
                          target="_blank"
                          className={classes.nativeMantineFeel}
                          p="md">
                          <Stack h="100%">
                            <Image
                              src={thumbnailUrl(model)}
                              alt={model.english_title}
                              fit="scale-down"
                              h="90%" />
                            <Center flex={1}>
                              <Title order={6} c="white" ta="center">{model.english_title}</Title>
                            </Center>
                          </Stack>
                        </Paper>
                      ))}
                    </SimpleGrid>
                  </Tabs.Panel>
                ))}
              </Tabs>
            </Stack>
          ),
        })}>
      History
    </Button>
  );
}
