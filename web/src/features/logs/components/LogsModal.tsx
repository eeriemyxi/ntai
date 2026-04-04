import {
  Button,
  Stack,
  Image,
  Paper,
  ScrollArea,
  SimpleGrid,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { Logs } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { bookUrl, thumbnailUrl } from "@/fetching";
import classes from './Styles.module.css';
import { useLogsStore } from "../";

export function LogsModal() {
  const logStore = useLogsStore(
    useShallow((state) => ({ items: state.items, logItem: state.logItem })),
  );

  return (
    <Button
      variant="default"
      color="dark"
      size="xs"
      fw="normal"
      onClick={() =>
        modals.open({
          title: "History",
          size: "70%",
          scrollAreaComponent: (props) => (
            <ScrollArea.Autosize {...props} type="scroll" scrollbarSize={6} scrollHideDelay={100} offsetScrollbars />
          ),
          children: (
            <>
              <SimpleGrid cols={5}>
                {Object.values(logStore.items).map((model, index) => (
                  <Paper
                    key={index}
                    withBorder
                    component="a"
                    href={bookUrl(model)}
                    target="_blank"
                    className={classes.nativeMantineFeel}
                    p="md"
                  >
                    <Stack>
                      <Image
                        src={thumbnailUrl(model)}
                        alt={model.english_title}
                        fit="scale-down"
                        h={250}
                      />
                      <h1 className="font-bold">{model.english_title}</h1>
                    </Stack>
                  </Paper>
                ))}
              </SimpleGrid>
            </>
          ),
        })
      }
      leftSection={<Logs size={16} />}
    >
      Logs
    </Button>
  );
}
