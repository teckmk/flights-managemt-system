"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";

interface ChangeRoleDialogProps {
  user: {
    id: string;
    name: string;
    role: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleChanged: (userId: string, newRole: string) => void;
}

const roles = [
  {
    value: "Admin",
    label: "Admin",
    description: "Full system access and management capabilities",
    icon: ShieldAlert,
    color: "text-red-500",
  },
  {
    value: "Manager",
    label: "Manager",
    description: "Department-level management and reporting",
    icon: ShieldCheck,
    color: "text-blue-500",
  },
  {
    value: "Operator",
    label: "Operator",
    description: "Standard operational access",
    icon: Shield,
    color: "text-green-500",
  },
];

export default function ChangeRoleDialog({
  user,
  open,
  onOpenChange,
  onRoleChanged,
}: ChangeRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleRoleChange() {
    if (selectedRole === user.role) {
      onOpenChange(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      onRoleChanged(user.id, selectedRole);
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: `Role updated to ${selectedRole}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Change role and permission level for {user.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select new role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  <div className="flex items-center space-x-2">
                    <role.icon className={`h-4 w-4 ${role.color}`} />
                    <div>
                      <div className="font-medium">{role.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {role.description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRoleChange}
              disabled={isLoading || selectedRole === user.role}
            >
              {isLoading ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}