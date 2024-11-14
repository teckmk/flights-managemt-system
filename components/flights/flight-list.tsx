"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  MoreHorizontal,
  Plane,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { Flight, FlightStatus } from "@/lib/types/flight";
import { useRealTimeUpdates } from "@/hooks/use-real-time-updates";
import EditFlightDialog from "./edit-flight-dialog";
import { logger } from "@/lib/utils/logger";
import { useSocketStore } from "@/hooks/use-socket";
import { flightChannel } from "@/lib/constants/socket";

interface FlightListProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
}

const statusColors = {
  Scheduled: "bg-blue-500",
  "In-flight": "bg-green-500",
  Delayed: "bg-yellow-500",
  Cancelled: "bg-red-500",
  Landed: "bg-gray-500",
};

const statusIcons = {
  Scheduled: Plane,
  "In-flight": CheckCircle2,
  Delayed: Clock,
  Cancelled: AlertTriangle,
  Landed: CheckCircle2,
};

export default function FlightList({
  searchQuery,
  statusFilter,
  typeFilter,
}: FlightListProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { toast } = useToast();

  // Add real-time updates
  const { socket } = useSocketStore();

  useEffect(() => {
    logger.info("Subscribing to topics");
    if (socket?.disconnected) {
      socket.connect();
    }
    socket?.on(flightChannel.FLIGHT_UPDATE, (updatedFlight) => {
      setFlights((prevFlights) =>
        prevFlights.map((f) => (f.id === updatedFlight.id ? updatedFlight : f))
      );
      logger.info(`Socket data ${updatedFlight}`);
    });

    socket?.on(flightChannel.FLIGHT_CREATE, (newFlight) => {
      setFlights((prevFlights) => [
        newFlight,
        ...prevFlights.filter((f) => f.id !== newFlight.id),
      ]);
      logger.info(`Socket data ${newFlight}`);
    });
  }, [socket]);

  useEffect(() => {
    fetchFlights();
  }, [searchQuery, statusFilter, typeFilter]);

  const fetchFlights = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);

      const response = await fetch(`/api/flights?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch flights");

      const data = await response.json();
      const filteredFlights = data.flights.filter(
        (flight: Flight) =>
          flight.flightNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          flight.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          flight.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFlights(filteredFlights);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch flights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlight = async () => {
    if (!selectedFlight) return;

    try {
      const response = await fetch(`/api/flights/${selectedFlight.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete flight");

      setFlights((prevFlights) =>
        prevFlights.filter((f) => f.id !== selectedFlight.id)
      );

      toast({
        title: "Success",
        description: "Flight has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete flight. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteOpen(false);
      setSelectedFlight(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flight Number</TableHead>
            <TableHead>Airline</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flights.map((flight) => {
            const StatusIcon =
              statusIcons[flight.status as keyof typeof statusIcons];
            return (
              <TableRow key={flight.id}>
                <TableCell className="font-medium">
                  {flight.flightNumber}
                </TableCell>
                <TableCell>{flight.airline}</TableCell>
                <TableCell>
                  {flight.origin} → {flight.destination}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      Dep:{" "}
                      {format(new Date(flight.scheduledDeparture), "HH:mm")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Arr: {format(new Date(flight.scheduledArrival), "HH:mm")}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{flight.type}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${
                      statusColors[flight.status as keyof typeof statusColors]
                    } text-white flex items-center gap-1`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {flight.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedFlight(flight);
                          setIsEditOpen(true);
                        }}
                      >
                        Edit flight
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelectedFlight(flight);
                          setIsDeleteOpen(true);
                        }}
                      >
                        Delete flight
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedFlight && (
        <EditFlightDialog
          flightData={selectedFlight}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onFlightUpdated={(updatedFlight) => {
            setFlights((prevFlights) =>
              prevFlights.map((f) =>
                f.id === updatedFlight.id ? updatedFlight : f
              )
            );
            setSelectedFlight(null);
          }}
        />
      )}

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              flight and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFlight}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
