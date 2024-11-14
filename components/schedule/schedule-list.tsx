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
import { useEffect, useState } from "react";
import { Flight } from "@/lib/types/flight";
import { format } from "date-fns";

interface ScheduleListProps {
  date: Date;
  flights: Flight[];
}

export default function ScheduleList({ date, flights }: ScheduleListProps) {
  const [flightsData, setFlightsData] = useState(flights ?? []);

  useEffect(() => {
    setFlightsData(flights);
  }, [flights]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Flight</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {flightsData.map((flight) => {
          return (
            <TableRow key={flight.id}>
              <TableCell>
                {format(new Date(flight.scheduledDeparture), "HH:mm")}
              </TableCell>
              <TableCell className="font-medium">
                {flight.flightNumber}
              </TableCell>
              <TableCell>{flight.type}</TableCell>
              <TableCell>{flight.destination}</TableCell>

              <TableCell>
                <Badge variant="secondary" className="bg-green-500 text-white">
                  {flight.status}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
