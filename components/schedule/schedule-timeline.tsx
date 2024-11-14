"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flight } from "@/lib/types/flight";
import { useEffect, useState } from "react";

interface ScheduleTimelineProps {
  date: Date;
  flights: Flight[];
}

export default function ScheduleTimeline({
  date,
  flights,
}: ScheduleTimelineProps) {
  const [flightsData, setFlightsData] = useState(flights ?? []);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    setFlightsData(flights);
  }, [flights]);

  return (
    <ScrollArea className="h-[600px]">
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="flex">
            <div className="w-20 py-4 text-sm text-muted-foreground">
              {hour.toString().padStart(2, "0")}:00
            </div>
            <div className="flex-1 border-l">
              <div className="h-16 border-b relative">
                {flightsData
                  .filter(
                    (f) => new Date(f.scheduledDeparture).getHours() === hour
                  )
                  .map((flight) => (
                    <Card
                      key={flight.id}
                      className="absolute left-2 right-2 p-2 cursor-pointer hover:shadow-md transition-shadow"
                      style={{
                        top: `${
                          (new Date(flight.scheduledDeparture).getMinutes() /
                            60) *
                          64
                        }px`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {flight.flightNumber}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {flight.type} • {flight.destination}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-green-500 text-white"
                        >
                          {flight.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
