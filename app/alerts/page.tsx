"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Settings } from "lucide-react";
import AlertsList from "@/components/alerts/alerts-list";
import AlertsSettings from "@/components/alerts/alerts-settings";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
          <p className="text-muted-foreground">
            Manage and monitor system alerts and notifications
          </p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Configure Alerts
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Alerts</TabsTrigger>
              <TabsTrigger value="critical">
                Critical
                <Badge variant="destructive" className="ml-2">3</Badge>
              </TabsTrigger>
              <TabsTrigger value="warnings">
                Warnings
                <Badge variant="secondary" className="ml-2 bg-yellow-500 text-white">5</Badge>
              </TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <AlertsList type="all" />
            </TabsContent>
            <TabsContent value="critical" className="mt-6">
              <AlertsList type="critical" />
            </TabsContent>
            <TabsContent value="warnings" className="mt-6">
              <AlertsList type="warnings" />
            </TabsContent>
            <TabsContent value="info" className="mt-6">
              <AlertsList type="info" />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Alert Statistics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Critical Issues</span>
                <Badge variant="destructive">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Warnings</span>
                <Badge variant="secondary" className="bg-yellow-500 text-white">5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Resolved Today</span>
                <Badge variant="secondary" className="bg-green-500 text-white">12</Badge>
              </div>
            </div>
          </Card>

          <AlertsSettings />
        </div>
      </div>
    </div>
  );
}