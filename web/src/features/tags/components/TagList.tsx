import { X } from "lucide-react";

import { SimpleTooltip } from "@/components/SimpleTooltip";
import { FieldDescription } from "@/components/ui/field";

import { usePresetStore } from "../stores/preset";

export function TagList({ tags = [] }: { tags?: string[] }) {
  const removeTag = usePresetStore((state) => state.removeTag);
  const badges = [];
  for (const tag of tags) {
    badges.push(
      <div
        key={tag}
        className="bg-accent-foreground items-center justify-center text-accent flex rounded-full p-1 pr-2 gap-1"
      >
        <SimpleTooltip tooltip="Remove this tag">
          <button
            onClick={() => removeTag(tag)}
            className="bg-accent text-accent-foreground rounded-full text-sm p-1 hover:bg-accent/90"
          >
            <X size={13} />
          </button>
        </SimpleTooltip>
        <p className="text-xs">{tag}</p>
      </div>,
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {badges.length > 0 ? (
        badges
      ) : (
        <FieldDescription>No tags yet.</FieldDescription>
      )}
    </div>
  );
}
