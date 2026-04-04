import { Settings } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Theme, useThemeStore } from "@/features/theming/";

export function SettingsSheet() {
  const [theme, setTheme] = useThemeStore(
    useShallow((state) => [state.activeTheme, state.setActiveTheme]),
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="text-xs" variant="outline">
          <Settings />
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Manage preferences</SheetDescription>
        </SheetHeader>
        <div className="p-5">
          <div className="flex items-center justify-center space-x-2">
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>Dark Mode</ItemTitle>
                <ItemDescription>Enable dark mode</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Switch
                  defaultChecked={theme === Theme.Dark}
                  onCheckedChange={(checked: boolean) => {
                    setTheme(checked ? Theme.Dark : Theme.Light);
                  }}
                />
              </ItemActions>
            </Item>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
