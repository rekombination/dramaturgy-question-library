import { IconCircleCheckFilled } from "@tabler/icons-react";

export function SolutionBadge() {
  return (
    <div className="border-b-2 border-foreground bg-muted px-4 md:px-6 py-3 flex items-center gap-2">
      <IconCircleCheckFilled className="text-muted-foreground" size={20} />
      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
        Highlighted Answer
      </span>
    </div>
  );
}
