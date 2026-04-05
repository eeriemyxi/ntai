import {
  ActionIcon,
  Box,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { Pencil } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import {TooltipActionIcon} from "@/components/TooltipComponents"

import { usePresetStore } from "../stores/preset";

export function EditPresetModal({ presetIndex }: { presetIndex?: number; }) {
  const activePreset = usePresetStore((state) => {
    const index = presetIndex ?? state.activePreset;
    return state.presets[index];
  });

  const presetStore = usePresetStore(
    useShallow((state) => ({
      removePreset: state.removePreset,
      setPresetName: state.setPresetName,
    })),
  );

  return (
    <TooltipActionIcon
      label="Configure this preset"
      size={30}
      variant="default"
      onClick={() =>
        modals.open({
          title: "Configure",
          centered: true,
          styles: { title: { fontWeight: "bold", fontSize: "1.1rem" } },
          children: (
            <Stack>
              <Text c="dimmed" size="sm" mb="md">
                Configure preset's name, or remove it
              </Text>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get("name");
                  if (name === null) {
                    // toast.error("Form doesn't have `name` input");
                    return;
                  }
                  presetStore.setPresetName(name.toString());
                  modals.closeAll();
                }}
              >
                <TextInput
                  label="Name"
                  name="name"
                  defaultValue={activePreset.name}
                  mb="xl"
                  data-autofocus
                />

                <Box
                  bg="light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))"
                  mx="-md"
                  mb="-md"
                  p="md"
                >
                  <Group justify="flex-end">
                    <Button variant="default" onClick={modals.closeAll}>
                      Cancel
                    </Button>

                    <Button
                      variant="outline"
                      color="red"
                      onClick={() => {
                        modals.openConfirmModal({
                          modalId: "remove-preset-confirm",
                          centered: true,
                          title: "Do you really want to remove this preset?",
                          children: (
                            <Text size="sm">
                              This action is irrevisible. Your data on this
                              preset will be lost.
                            </Text>
                          ),
                          labels: { confirm: "Remove", cancel: "Cancel" },
                          confirmProps: { color: "red", variant: "outline" },
                          onCancel: () => modals.close("remove-preset-confirm"),
                          onConfirm: () => {
                            modals.closeAll();
                            presetStore.removePreset();
                          },
                        });
                      }}
                    >
                      Remove preset
                    </Button>

                    <Button variant="default" type="submit">
                      Save changes
                    </Button>
                  </Group>
                </Box>
              </form>
            </Stack>
          ),
        })}
    >
      <Pencil size={15} />
    </TooltipActionIcon>
  );
}
