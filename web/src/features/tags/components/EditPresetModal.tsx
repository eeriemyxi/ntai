import { TooltipActionIcon } from "@/components/TooltipComponents";
import { Box, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Pencil } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { SimpleSwitch } from "@/components/SimpleSwitch";
import { useLogsStore } from "@/features/logs";
import { usePresetStore } from "../stores/preset";

function EditPresetForm({ presetIndex }: { presetIndex?: number; }) {
  const presetStore = usePresetStore(
    useShallow((state) => ({
      presets: state.presets,
      activePresetIndex: state.activePreset,
      removePreset: state.removePreset,
      setPresetName: state.setPresetName,
      setBlacklistStatus: state.setBlacklistStatus,
    })),
  );

  const logsStore = useLogsStore(
    useShallow((state) => ({
      removeLogIndex: state.removeLogIndex,
    })),
  );

  const activePreset = presetStore.presets[presetIndex ?? presetStore.activePresetIndex];

  return (
    <Stack>
      <Text c="dimmed" size="sm">
        Configure preset's name, or remove it
      </Text>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = formData.get("name");
          if (name === null) {
            console.error("Form doesn't have `name` input");
            return;
          }
          presetStore.setPresetName(name.toString());
          modals.closeAll();
        }}>
        <TextInput
          label="Name"
          name="name"
          defaultValue={activePreset.name}
          mb="md"
          data-autofocus />

        <SimpleSwitch
          label="Blacklist"
          description="Dismiss books that are in history when searching"
          checked={activePreset.blacklistEnabled == true}
          onChange={(event) => {
            presetStore.setBlacklistStatus(
              presetStore.activePresetIndex,
              event.currentTarget.checked,
            );
          }} />

        <Box
          bg="light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))"
          mx="-md"
          mt="md"
          mb="-md"
          p="md">
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
                      This action is irrevisible. Your data on this preset will be lost.
                    </Text>
                  ),
                  labels: { confirm: "Remove", cancel: "Cancel" },
                  confirmProps: { color: "red", variant: "outline" },
                  onCancel: () => modals.close("remove-preset-confirm"),
                  onConfirm: () => {
                    presetStore.removePreset(presetStore.activePresetIndex);
                    logsStore.removeLogIndex(presetStore.activePresetIndex);
                    modals.closeAll();
                  },
                });
              }}>
              Remove preset
            </Button>

            <Button variant="default" type="submit">
              Save changes
            </Button>
          </Group>
        </Box>
      </form>
    </Stack>
  );
}

export function EditPresetModal({ presetIndex }: { presetIndex?: number; }) {
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
          children: <EditPresetForm presetIndex={presetIndex} />,
        })}>
      <Pencil size={15} />
    </TooltipActionIcon>
  );
}
