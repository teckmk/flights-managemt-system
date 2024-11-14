"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage how you receive notifications and alerts
        </p>
      </div>
      <Separator />

      <div className="space-y-4">
        <div className="space-y-4">
          <Label>Email Notifications</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="flight-updates" className="flex-1">
                Flight Updates
              </Label>
              <Switch id="flight-updates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="system-alerts" className="flex-1">
                System Alerts
              </Label>
              <Switch id="system-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance" className="flex-1">
                Maintenance Notifications
              </Label>
              <Switch id="maintenance" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Push Notifications</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-critical" className="flex-1">
                Critical Alerts
              </Label>
              <Switch id="push-critical" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-updates" className="flex-1">
                Status Updates
              </Label>
              <Switch id="push-updates" defaultChecked />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Notification Frequency</Label>
          <Select defaultValue="realtime">
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="hourly">Hourly Digest</SelectItem>
              <SelectItem value="daily">Daily Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}