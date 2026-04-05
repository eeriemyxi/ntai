import { Group, Paper, Switch, type SwitchProps, Text } from "@mantine/core";

interface SimpleSwitchProps extends SwitchProps {
  label: string;
  description: string;
}

export function SimpleSwitch({ label, description, ...props }: SimpleSwitchProps) {
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
