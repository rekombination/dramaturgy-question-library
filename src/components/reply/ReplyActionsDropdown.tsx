"use client";

import { IconDots, IconPencil, IconTrash, IconFlag } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReplyActionsDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onFlag?: () => void;
  isDeleting?: boolean;
}

export function ReplyActionsDropdown({
  onEdit,
  onDelete,
  onFlag,
  isDeleting = false,
}: ReplyActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-muted transition-colors border-2 border-foreground">
          <IconDots size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-2 border-foreground">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} className="font-medium cursor-pointer">
            <IconPencil className="mr-2" size={16} />
            Edit
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isDeleting}
            className="font-medium cursor-pointer text-destructive"
          >
            <IconTrash className="mr-2" size={16} />
            {isDeleting ? "Deleting..." : "Delete"}
          </DropdownMenuItem>
        )}
        {onFlag && (
          <DropdownMenuItem onClick={onFlag} className="font-medium cursor-pointer">
            <IconFlag className="mr-2" size={16} />
            Report
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
