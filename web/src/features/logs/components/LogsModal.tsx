import {
  Button,
  Center,
  Image,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { History } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { TooltipButton } from "@/components/TooltipComponents";
import { usePresetStore } from "@/features/tags/";
import { bookUrl, thumbnailUrl } from "@/fetching";
import { useCoreStore } from "@/stores/core";
import { useLogsStore } from "../";
import classes from "./Styles.module.css";

function LogsModalContent() {
  const useCubariLinks = useCoreStore((state) => state.useCubariLinks);

  const logStore = useLogsStore(
    useShallow((state) => ({
      items: state.items,
      logItem: state.logItem,
      removeLogItem: state.removeLogItem,
    })),
  );

  const presetStore = usePresetStore(
    useShallow((state) => ({
      activePresetIndex: state.activePreset,
      presets: state.presets,
    })),
  );

  return (
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
              {Object.values(books).map((model, idx) => (
                <Paper
                  key={idx}
                  withBorder
                  component="a"
                  href={bookUrl(model, useCubariLinks)}
                  target="_blank"
                  className={classes.nativeMantineFeel}
                  p="md">
                  <Stack h="100%">
                    <Image
                      src={thumbnailUrl(model)}
                      alt={model.english_title}
                      fit="scale-down"
                      h="250" />
                    <Center flex={1} w="100%">
                      <Stack w="100%">
                        <Text c="white" ta="center" lineClamp={3}>{model.english_title}</Text>
                        <TooltipButton
                          label="Remove this entry from logs"
                          variant="outline"
                          color="red"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            logStore.removeLogItem(presetStore.activePresetIndex, undefined, idx);
                          }}>
                          Dismiss
                        </TooltipButton>
                      </Stack>
                    </Center>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Stack>
  );
}

export function LogsModal() {
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
          children: <LogsModalContent />,
        })}>
      History
    </Button>
  );
}
