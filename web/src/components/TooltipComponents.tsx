import { ActionIcon, Tooltip, type ActionIconProps, Button, type ButtonProps } from '@mantine/core';
import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

export type TooltipActionIconProps = ActionIconProps & ComponentPropsWithoutRef<'button'> & {
  label: ReactNode;
  children: ReactNode;
};

export function TooltipActionIcon({ label, children, ...props }: TooltipActionIconProps) {
  return (
    <Tooltip label={label}>
      <ActionIcon {...props}>
        {children}
      </ActionIcon>
    </Tooltip>
  );
}

export type TooltipButtonProps = ButtonProps & ComponentPropsWithoutRef<'button'> & {
  label: ReactNode;
  children: ReactNode;
};

export function TooltipButton({ label, children, ...props }: TooltipButtonProps) {
  return (
    <Tooltip label={label}>
      <Button {...props}>
        {children}
      </Button>
    </Tooltip>
  );
}
