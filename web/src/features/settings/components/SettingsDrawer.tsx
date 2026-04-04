import {
  Button,
  Drawer,
  Group,
  Paper,
  Switch,
  type SwitchProps,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Settings } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Theme, useThemeStore } from "@/features/theming/";

interface SimpleSwitchProps extends SwitchProps {
  label: string;
  description: string;
}

export function SettingsDrawer() {
  const [theme, setTheme] = useThemeStore(
    useShallow((state) => [state.activeTheme, state.setActiveTheme]),
  );
  const [opened, { open, close }] = useDisclosure(false);
  function SimpleSwitch({ label, description, ...props }: SimpleSwitchProps) {
    return (
      <Paper withBorder p="sm">
        <Group justify="space-between" wrap="nowrap">
          <div>
            <Text size="sm" fw={500}>
              {label}
            </Text>
            <Text size="xs" c="dimmed">
              {description}
            </Text>
          </div>
          <Switch {...props} />
        </Group>
      </Paper>
    );
  }
  return (
    <>
      <Drawer opened={opened} onClose={close} title="Settings" position="right">
        <SimpleSwitch
          label="Dark Mode"
          description="Enable dark mode"
          checked={theme === Theme.Dark}
          onChange={(event) => {
            setTheme(event.currentTarget.checked ? Theme.Dark : Theme.Light);
          }}
        />
      </Drawer>

      <Button
        variant="default"
        color="dark"
        size="xs"
        fw="normal"
        onClick={open}
        leftSection={<Settings size={16} />}
      >
        Settings
      </Button>
    </>
  );
}
