"use client";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Props {
  /** What is being deleted — shown in the confirmation dialog title */
  itemName?: string;
  /** Called when user confirms deletion */
  onConfirm: () => void | Promise<void>;
  /** Optional custom trigger element. Defaults to a destructive trash icon button. */
  trigger?: React.ReactNode;
}

/**
 * Reusable delete confirmation dialog.
 * Wraps the ShadCN AlertDialog pattern that was previously copy-pasted across 6+ components.
 */
export function ConfirmDeleteDialog({ itemName = "item", onConfirm, trigger }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive shrink-0">
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemName}?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
