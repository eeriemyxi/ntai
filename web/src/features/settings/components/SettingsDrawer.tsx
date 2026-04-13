import { SimpleSwitch } from "@/components/SimpleSwitch";
import { Theme, useThemeStore } from "@/features/theming/";
import { useCoreStore } from "@/stores/core";
import { Button, Drawer, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Settings } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

export function SettingsDrawer() {
  const coreStore = useCoreStore(
    useShallow((state) => ({
      useCubariLinks: state.useCubariLinks,
      setUseCubariLinks: state.setUseCubariLinks,
    })),
  );

  const [theme, setTheme] = useThemeStore(
    useShallow((state) => [state.activeTheme, state.setActiveTheme]),
  );
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Settings" position="right">
        <Stack gap="md">
          <SimpleSwitch
            label="Dark Mode"
            description="Enable dark mode"
            checked={theme === Theme.Dark}
            onChange={(event) => {
              setTheme(event.currentTarget.checked ? Theme.Dark : Theme.Light);
            }} />
          <SimpleSwitch
            label="Use Cubari"
            description="Use Cubari's nHentai proxy for the links"
            checked={coreStore.useCubariLinks === true}
            onChange={(event) => {
              coreStore.setUseCubariLinks(event.currentTarget.checked);
            }} />
        </Stack>
      </Drawer>

      <Button
        variant="default"
        color="dark"
        size="xs"
        fw="normal"
        onClick={open}
        leftSection={<Settings size={16} />}>
        Settings
      </Button>
    </>
  );
}
