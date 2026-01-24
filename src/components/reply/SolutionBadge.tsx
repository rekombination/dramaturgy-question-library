import { IconCircleCheckFilled } from "@tabler/icons-react";

export function SolutionBadge() {
  return (
    <div className="border-b-2 border-foreground bg-primary/10 px-4 md:px-6 py-3 flex items-center gap-2">
      <IconCircleCheckFilled className="text-primary" size={20} />
      <span className="text-sm font-bold text-primary uppercase tracking-wider">
        Marked as Solution
      </span>
    </div>
  );
}
