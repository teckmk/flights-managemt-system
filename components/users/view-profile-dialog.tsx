"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Shield, Mail, Calendar, Activity } from "lucide-react";

interface ViewProfileDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastActive: string;
    avatar: string;
    createdAt?: string;
    department?: string;
    location?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewProfileDialog({
  user,
  open,
  onOpenChange,
}: ViewProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>View detailed user information</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className={`${
                    user.status === "active"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  } text-white`}
                >
                  {user.status}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{user.department || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{user.location || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-sm font-medium">
                    {user.createdAt
                      ? format(new Date(user.createdAt), "MMM d, yyyy")
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Active</p>
                  <p className="text-sm font-medium">{user.lastActive}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}