import {
  ActionIcon,
  Badge,
  Divider,
  Group,
  Paper,
  Pill,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { usePresetStore } from "../stores/preset";
import { EditPresetModal } from "./";

export function TagInput({ presetIndex }: { presetIndex?: number }) {
  const activePreset = usePresetStore((state) => {
    const index = presetIndex ?? state.activePreset;
    return state.presets[index];
  });
  const presetStore = usePresetStore(
    useShallow((state) => ({
      addTag: state.addTag,
      removeTag: state.removeTag,
      popTag: state.popTag,
      setActivePreset: state.setActivePreset,
      activePresetIndex: state.activePreset,
      presets: state.presets,
      addPreset: state.addPreset,
      removePreset: state.removePreset,
      setPresetName: state.setPresetName,
    })),
  );

  return (
    <Paper p="md" mx="auto" w={{ base: "80%", sm: "60%" }} withBorder>
      <Stack align="stretch" justify="start" gap="lg">
        <Group align="center" justify="center" my="auto" gap="xs">
          <Badge variant="transparent" color="dark" size="lg">
            Preset Menu
          </Badge>
        </Group>

        <Group align="center" justify="space-between">
          <Text fw="bold" lh={1}>
            {activePreset.name}
          </Text>
          <EditPresetModal />
        </Group>

        <Divider
          my="xs"
          label={
            <Badge size="lg" variant="default">
              {presetStore.activePresetIndex + 1} / {presetStore.presets.length}
            </Badge>
          }
          labelPosition="center"
        />

        {activePreset.tagList.length > 0 ? (
          <Pill.Group h={21}>
            {activePreset.tagList.map((tag) => (
              <Pill
                key={tag}
                withRemoveButton
                onRemove={() => presetStore.removeTag(tag)}
              >
                {tag}
              </Pill>
            ))}
          </Pill.Group>
        ) : (
          <Text c="dimmed" size="sm">
            No tags yet.
          </Text>
        )}

        <Group wrap="nowrap" gap="sm">
          <ActionIcon
            variant="default"
            size="lg"
            radius="md"
            onClick={() =>
              presetStore.setActivePreset(presetStore.activePresetIndex - 1)
            }
          >
            <ChevronLeft size={18} />
          </ActionIcon>

          <TextInput
            placeholder="Type the tag then hit enter/tab to add"
            style={{ flex: 1 }}
            onKeyDown={(event) => {
              switch (event.key) {
                case "Enter":
                case "Tab":
                  event.preventDefault();
                  if (event.currentTarget.value.trim() == "") {
                    event.currentTarget.ariaInvalid = "";
                    break;
                  }
                  presetStore.addTag(event.currentTarget.value.trim());
                  event.currentTarget.value = "";
                  break;
                case "Backspace":
                  if (event.currentTarget.value != "") break;
                  presetStore.popTag();
                  break;
              }
            }}
          />

          <ActionIcon
            variant="default"
            size="lg"
            radius="md"
            onClick={() =>
              presetStore.setActivePreset(presetStore.activePresetIndex + 1)
            }
          >
            <ChevronRight size={18} />
          </ActionIcon>

          <ActionIcon
            variant="filled"
            size="lg"
            radius="xl"
            onClick={() => {
              presetStore.addPreset();
              presetStore.setActivePreset(presetStore.presets.length); // This is before a rerender, so we don't subtract 1.
            }}
          >
            <Plus size={18} />
          </ActionIcon>
        </Group>
      </Stack>
    </Paper>
  );
}
