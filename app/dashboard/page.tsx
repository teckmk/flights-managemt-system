"use client";

import { Card } from "@/components/ui/card";
import {
  Plane,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  LucideIcon,
} from "lucide-react";
import FlightStatusChart from "@/components/dashboard/flight-status-chart";
import FlightTypeDistribution from "@/components/dashboard/flight-type-distribution";
import RecentFlights from "@/components/dashboard/recent-flights";
import { useEffect, useState } from "react";

interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/flights/stats");
      const data = await response.json();
      setStats([
        {
          label: "Total Flights Today",
          value: data.totalFlightsToday,
          icon: Plane,
          color: "text-blue-500",
        },
        {
          label: "Delayed Flights",
          value: data.delayedFlights,
          icon: Clock,
          color: "text-yellow-500",
        },
        {
          label: "Cancelled",
          value: data.cancelledFlights,
          icon: AlertTriangle,
          color: "text-red-500",
        },
        {
          label: "On Time",
          value: data.onTimeFlights,
          icon: CheckCircle2,
          color: "text-green-500",
        },
        {
          label: "Total Passengers",
          value: data.totalPassengers,
          icon: Users,
          color: "text-purple-500",
        },
      ]);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-6">
          <h2 className="text-lg font-semibold mb-4">Flight Status Overview</h2>
          <FlightStatusChart />
        </Card>
        <Card className="col-span-3 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Flight Type Distribution
          </h2>
          <FlightTypeDistribution />
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Flights</h2>
        <RecentFlights />
      </Card>
    </div>
  );
}
