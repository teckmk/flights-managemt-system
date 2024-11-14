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

export default function ApiSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Manage your API keys and access settings
        </p>
      </div>
      <Separator />

      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">API Keys</h4>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Production API Key</p>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last used: 2 hours ago
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Regenerate
                </Button>
              </div>
              <div className="mt-4">
                <Input
                  value="sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  readOnly
                  className="font-mono"
                />
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Development API Key</p>
                    <Badge variant="secondary">Test</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last used: 5 minutes ago
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Regenerate
                </Button>
              </div>
              <div className="mt-4">
                <Input
                  value="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  readOnly
                  className="font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">API Access Control</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rate Limiting</Label>
                <p className="text-sm text-muted-foreground">
                  Limit API requests per minute
                </p>
              </div>
              <Select defaultValue="100">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50 requests/min</SelectItem>
                  <SelectItem value="100">100 requests/min</SelectItem>
                  <SelectItem value="500">500 requests/min</SelectItem>
                  <SelectItem value="1000">1000 requests/min</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>CORS Settings</Label>
                <p className="text-sm text-muted-foreground">
                  Allow cross-origin requests
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="grid gap-2">
              <Label>Allowed Origins</Label>
              <Input placeholder="https://example.com" />
              <p className="text-sm text-muted-foreground">
                Enter origins separated by commas
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Webhook Configuration</h4>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Webhook URL</Label>
              <Input placeholder="https://your-domain.com/webhook" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Webhook Events</Label>
                <p className="text-sm text-muted-foreground">
                  Receive webhook notifications
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}