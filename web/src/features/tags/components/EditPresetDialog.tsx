import { useState } from "react";

import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { SimpleTooltip } from "@/components/SimpleTooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { usePresetStore } from "../stores/preset";

export function EditPresetDialog({ presetIndex }: { presetIndex?: number }) {
  const activePreset = usePresetStore((state) => {
    const index = presetIndex ?? state.activePreset;
    return state.presets[index];
  });
  const [setPresetName, activePresetIndex, presets, removePreset] =
    usePresetStore(
      useShallow((state) => [
        state.setPresetName,
        state.activePreset,
        state.presets,
        state.removePreset,
      ]),
    );
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <SimpleTooltip tooltip="Configure preset">
        <DialogTrigger asChild>
          <Button className="flex" variant="outline">
            <Pencil />
          </Button>
        </DialogTrigger>
      </SimpleTooltip>
      <p className="translate-y-9 text-xs font-medium bg-foreground text-background rounded-full p-1 pr-2 pl-2 text-center select-none absolute left-1/2 -translate-x-1/2">
        {activePresetIndex + 1} / {presets.length}
      </p>
      <DialogContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name");
            if (name === null) {
              toast.error("Form doesn't have `name` input");
              return;
            }
            setPresetName(name.toString());
            setIsOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Configure</DialogTitle>
            <DialogDescription>
              Configure preset's name, or remove it
            </DialogDescription>
          </DialogHeader>
          <Field>
            <Label htmlFor="name-1">Name</Label>
            <Input id="name-1" name="name" defaultValue={activePreset.name} />
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsOpen(false);
                  removePreset();
                }}
              >
                Remove preset
              </Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
