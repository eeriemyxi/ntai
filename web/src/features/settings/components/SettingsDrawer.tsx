import { SimpleSwitch } from "@/components/SimpleSwitch";
import { Theme, useThemeStore } from "@/features/theming/";
import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Settings } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

export function SettingsDrawer() {
  const [theme, setTheme] = useThemeStore(
    useShallow((state) => [state.activeTheme, state.setActiveTheme]),
  );
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Settings" position="right">
        <SimpleSwitch
          label="Dark Mode"
          description="Enable dark mode"
          checked={theme === Theme.Dark}
          onChange={(event) => {
            setTheme(event.currentTarget.checked ? Theme.Dark : Theme.Light);
          }} />
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
