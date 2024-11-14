"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Flight } from "@/lib/types/flight";
import { useEffect, useState } from "react";

const flightFormSchema = z.object({
  flightNumber: z.string().min(3).max(10),
  origin: z.string().min(3).max(3),
  destination: z.string().min(3).max(3),
  scheduledDeparture: z.string(),
  scheduledArrival: z.string(),
  type: z.enum(["Commercial", "Military", "Private"]),
  airline: z.string().min(2),
  aircraft: z.string().min(2),
  capacity: z.string().transform((val) => parseInt(val, 10)),
  status: z.enum(["Scheduled", "Delayed", "Cancelled", "In-flight", "Landed"]),
});

type FlightFormValues = z.infer<typeof flightFormSchema>;

interface EditFlightDialogProps {
  flightData: Flight;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFlightUpdated: (flight: Flight) => void;
}

export default function EditFlightDialog({
  flightData,
  open,
  onOpenChange,
  onFlightUpdated,
}: EditFlightDialogProps) {
  const { toast } = useToast();

  const [flight, setFlightData] = useState(flightData);

  useEffect(() => {
    setFlightData(flightData);
  }, [flightData]);

  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      scheduledDeparture: new Date(flight.scheduledDeparture)
        .toISOString()
        .slice(0, 16),
      scheduledArrival: new Date(flight.scheduledArrival)
        .toISOString()
        .slice(0, 16),
      type: flight.type,
      airline: flight.airline,
      aircraft: flight.aircraft,
      capacity: flight.capacity.toString(),
      status: flight.status,
    },
  });

  async function onSubmit(data: FlightFormValues) {
    try {
      const response = await fetch(`/api/flights/${flight.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update flight");

      const updatedFlight = await response.json();
      onFlightUpdated(updatedFlight);
      toast({
        title: "Success",
        description: "Flight has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update flight. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Flight</DialogTitle>
          <DialogDescription>
            Update the flight details below. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="flightNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flight Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Delayed">Delayed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="In-flight">In-flight</SelectItem>
                        <SelectItem value="Landed">Landed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduledDeparture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scheduledArrival"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arrival Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="airline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Airline</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aircraft"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aircraft</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flight Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select flight type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Military">Military</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Flight</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
