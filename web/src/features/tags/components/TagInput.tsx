import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { SimpleTooltip } from "@/components/SimpleTooltip";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { usePresetStore } from "../stores/preset";
import { EditPresetDialog, TagList } from "./";

export function TagInput({ presetIndex }: { presetIndex?: number }) {
  const activePreset = usePresetStore((state) => {
    const index = presetIndex ?? state.activePreset;
    return state.presets[index];
  });
  const [
    addTag,
    popTag,
    setActivePreset,
    activePresetIndex,
    presets,
    addPreset,
  ] = usePresetStore(
    useShallow((state) => [
      state.addTag,
      state.popTag,
      state.setActivePreset,
      state.activePreset,
      state.presets,
      state.addPreset,
    ]),
  );

  return (
    <div className="border-border border-1 flex flex-col w-150 p-5 gap-5">
      <p className="uppercase text-foreground/85 font-bold text-xs text-center select-none">
        Preset Menu
      </p>
      <div className="flex justify-between items-center relative">
        <h1 className="text-accent-foreground font-medium">
          {activePreset.name}
        </h1>
        <EditPresetDialog />
      </div>
      <Separator />
      <TagList tags={activePreset.tagList} />
      <div className="flex gap-2">
        <SimpleTooltip tooltip="Previous preset">
          <Button
            onClick={() => {
              setActivePreset(activePresetIndex - 1);
            }}
          >
            <ChevronLeft />{" "}
          </Button>
        </SimpleTooltip>
        <Field>
          <Input
            placeholder="Type the tag then hit enter/tab to add"
            onKeyDown={(event) => {
              switch (event.key) {
                case "Enter":
                case "Tab":
                  event.preventDefault();
                  if (event.currentTarget.value.trim() == "") {
                    event.currentTarget.ariaInvalid = "";
                    break;
                  }
                  addTag(event.currentTarget.value.trim());
                  event.currentTarget.value = "";
                  break;
                case "Backspace":
                  if (event.currentTarget.value != "") break;
                  popTag();
                  break;
              }
            }}
          />
        </Field>
        <SimpleTooltip tooltip="Next preset">
          <Button
            onClick={() => {
              setActivePreset(activePresetIndex + 1);
            }}
          >
            <ChevronRight />{" "}
          </Button>
        </SimpleTooltip>
        <SimpleTooltip tooltip="Creaet a preset">
          <Button
            className="rounded-full"
            variant="outline"
            size="icon"
            onClick={() => {
              addPreset();
              setActivePreset(presets.length); // This is before a rerender, so we don't subtract 1.
            }}
          >
            <Plus className="w-100 h-100" />{" "}
          </Button>
        </SimpleTooltip>
      </div>
    </div>
  );
}
