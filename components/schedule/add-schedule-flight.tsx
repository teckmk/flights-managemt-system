"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";

const scheduleFormSchema = z.object({
  flightNumber: z.string().min(3).max(10),
  origin: z.string().min(3).max(3),
  destination: z.string().min(3).max(3),
  scheduledDeparture: z.string(),
  scheduledArrival: z.string(),
  type: z.enum(["Commercial", "Military", "Private"]),
  airline: z.string().min(2),
  aircraft: z.string().min(2),
  terminal: z.string().min(1),
  gate: z.string().min(1),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

export default function AddScheduleFlight() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      flightNumber: "",
      origin: "",
      destination: "",
      scheduledDeparture: "",
      scheduledArrival: "",
      type: "Commercial",
      airline: "",
      aircraft: "",
      terminal: "",
      gate: "",
    },
  });

  async function onSubmit(data: ScheduleFormValues) {
    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to schedule flight");

      toast({
        title: "Success",
        description: "Flight has been scheduled successfully",
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule flight. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Flight
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule New Flight</DialogTitle>
          <DialogDescription>
            Enter flight schedule details. All fields are required.
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
                      <Input placeholder="AA1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl>
                      <Input placeholder="JFK" {...field} />
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
                      <Input placeholder="LAX" {...field} />
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
                      <Input placeholder="American Airlines" {...field} />
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
                      <Input placeholder="Boeing 737" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="terminal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terminal</FormLabel>
                    <FormControl>
                      <Input placeholder="T1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gate</FormLabel>
                    <FormControl>
                      <Input placeholder="A1" {...field} />
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
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Schedule Flight</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}