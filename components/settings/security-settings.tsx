"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account security and authentication preferences
        </p>
      </div>
      <Separator />

      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Password Settings</h4>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input type="password" id="current-password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input type="password" id="new-password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input type="password" id="confirm-password" />
            </div>
            <Button>Update Password</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Session Management</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Logout</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically log out after inactivity
                </p>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full">
              Sign Out All Other Sessions
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Login History</h4>
          <div className="space-y-4">
            <div className="rounded-lg border p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Current Session</p>
                  <p className="text-sm text-muted-foreground">
                    Last accessed: Just now
                  </p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}