"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Flight } from "@/lib/types/flight";

const statusColors = {
  "In-flight": "bg-blue-500",
  Delayed: "bg-yellow-500",
  Cancelled: "bg-red-500",
  Scheduled: "bg-green-500",
  Landed: "bg-gray-500",
};

export default function RecentFlights() {
  const [recentFlights, setRecentFlights] = useState<Flight[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/flights/recent");
      const data = await response.json();
      setRecentFlights(data);
    })();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Flight Number</TableHead>
          <TableHead>Airline</TableHead>
          <TableHead>Origin</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Departure</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentFlights.map((flight) => (
          <TableRow key={flight.id}>
            <TableCell className="font-medium">{flight.flightNumber}</TableCell>
            <TableCell>{flight.airline}</TableCell>
            <TableCell>{flight.origin}</TableCell>
            <TableCell>{flight.destination}</TableCell>
            <TableCell>
              {format(flight.scheduledDeparture, "MMM d, HH:mm")}
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={`${
                  statusColors[flight.status as keyof typeof statusColors]
                } text-white`}
              >
                {flight.status}
              </Badge>
            </TableCell>
            <TableCell>{flight.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
