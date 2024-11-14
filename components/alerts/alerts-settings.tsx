"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, Phone } from "lucide-react";

export default function AlertsSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="push">Push Notifications</Label>
            </div>
            <Switch id="push" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="email">Email Notifications</Label>
            </div>
            <Switch id="email" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="sms">SMS Notifications</Label>
            </div>
            <Switch id="sms" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="phone">Phone Calls</Label>
            </div>
            <Switch id="phone" />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Alert Preferences</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Critical Alert Threshold</Label>
            <Select defaultValue="immediate">
              <SelectTrigger>
                <SelectValue placeholder="Select threshold" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="5min">5 minutes</SelectItem>
                <SelectItem value="15min">15 minutes</SelectItem>
                <SelectItem value="30min">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Warning Alert Threshold</Label>
            <Select defaultValue="15min">
              <SelectTrigger>
                <SelectValue placeholder="Select threshold" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="5min">5 minutes</SelectItem>
                <SelectItem value="15min">15 minutes</SelectItem>
                <SelectItem value="30min">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Alert Retention Period (days)</Label>
            <Input type="number" defaultValue="30" />
          </div>
        </div>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}