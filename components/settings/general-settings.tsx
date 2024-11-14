"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">System Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configure general system settings and preferences
        </p>
      </div>
      <Separator />
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select defaultValue="UTC">
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="EST">Eastern Time</SelectItem>
              <SelectItem value="CST">Central Time</SelectItem>
              <SelectItem value="PST">Pacific Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="dateFormat">Date Format</Label>
          <Select defaultValue="MM/DD/YYYY">
            <SelectTrigger id="dateFormat">
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="language">Language</Label>
          <Select defaultValue="en">
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Automatic Updates</Label>
            <p className="text-sm text-muted-foreground">
              Receive automatic system updates
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Analytics</Label>
            <p className="text-sm text-muted-foreground">
              Share anonymous usage data
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}