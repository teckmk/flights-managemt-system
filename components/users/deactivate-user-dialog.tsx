"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface DeactivateUserDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserDeactivated: (userId: string) => void;
}

export default function DeactivateUserDialog({
  user,
  open,
  onOpenChange,
  onUserDeactivated,
}: DeactivateUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleDeactivate() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}/deactivate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to deactivate user");

      onUserDeactivated(user.id);
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "User has been deactivated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will deactivate the user account for {user.name} ({user.email}).
            They will no longer be able to access the system until reactivated.
            <br />
            <br />
            <span className="font-medium">This action can be reversed later.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeactivate}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Deactivating..." : "Deactivate User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}