'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  isDeleting?: boolean
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[min(92vw,28rem)] rounded-2xl px-4 py-5 sm:px-6 sm:py-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-xl">Delete Bookmark?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            This action cannot be undone. The bookmark will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col-reverse justify-end gap-2 pt-2 sm:flex-row sm:gap-3">
          <AlertDialogCancel className="h-11 text-sm sm:h-10" disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-11 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 sm:h-10"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
