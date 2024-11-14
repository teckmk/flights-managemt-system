"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface AlertsListProps {
  type: "all" | "critical" | "warnings" | "info";
}

const alerts = [
  {
    id: "1",
    type: "critical",
    title: "System Performance Degradation",
    message: "Database response time exceeding threshold",
    timestamp: new Date(),
    status: "active",
  },
  {
    id: "2",
    type: "warning",
    title: "High Memory Usage",
    message: "Server memory utilization above 80%",
    timestamp: new Date(Date.now() - 3600000),
    status: "active",
  },
  {
    id: "3",
    type: "info",
    title: "Scheduled Maintenance",
    message: "System maintenance scheduled for tonight",
    timestamp: new Date(Date.now() - 7200000),
    status: "resolved",
  },
];

const alertIcons = {
  critical: <AlertCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

export default function AlertsList({ type }: AlertsListProps) {
  const filteredAlerts = alerts.filter(
    (alert) => type === "all" || alert.type === type
  );

  return (
    <div className="space-y-4">
      {filteredAlerts.map((alert) => (
        <Card key={alert.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {alertIcons[alert.type as keyof typeof alertIcons]}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{alert.title}</h3>
                  {alert.status === "resolved" ? (
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Resolved
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className={`${
                        alert.type === "critical"
                          ? "bg-red-500"
                          : alert.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      } text-white`}
                    >
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {alert.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(alert.timestamp, "MMM d, yyyy HH:mm")}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
                <DropdownMenuItem>Snooze alert</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Delete alert
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  );
}