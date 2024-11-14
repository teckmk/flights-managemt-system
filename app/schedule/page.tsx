"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScheduleTimeline from "@/components/schedule/schedule-timeline";
import ScheduleList from "@/components/schedule/schedule-list";

export default function SchedulePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState("timeline");
  const [flights, setFlights] = useState([]);
  const [overview, setOverview] = useState({
    total: 0,
    departures: 0,
    arrivals: 0,
  });

  useEffect(() => {
    (async () => {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await fetch(
        `/api/flights/schedule?date=${formattedDate}`
      );
      if (response.ok) {
        const { flights: data } = await response.json();
        setFlights(data);

        // Calculate overview counts
        const departures = data.filter(
          (flight: { type: string }) => flight.type === "Departure"
        ).length;
        const arrivals = data.filter(
          (flight: { type: string }) => flight.type === "Arrival"
        ).length;
        setOverview({
          total: data.length,
          departures,
          arrivals,
        });
      } else {
        console.error("Failed to fetch flights");
      }
    })();
  }, [date]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Flight Schedule</h1>
        {/* <AddScheduleFlight /> */}
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md"
            />
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Today's Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Flights
                </span>
                <Badge variant="secondary">{overview.total}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Departures
                </span>
                <Badge variant="secondary">{overview.departures}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Arrivals</span>
                <Badge variant="secondary">{overview.arrivals}</Badge>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setDate(new Date(date.setDate(date.getDate() - 1)))
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setDate(new Date(date.setDate(date.getDate() + 1)))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Tabs value={view} onValueChange={setView}>
                <TabsList>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {view === "timeline" ? (
              <ScheduleTimeline date={date} flights={flights} />
            ) : (
              <ScheduleList date={date} flights={flights} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
