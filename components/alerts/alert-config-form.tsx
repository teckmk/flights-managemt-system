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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Settings } from "lucide-react";

const alertConfigSchema = z.object({
  flightType: z.enum(["all", "commercial", "military", "private"]),
  delayThreshold: z.string().transform((val) => parseInt(val, 10)),
  notifyEmail: z.boolean(),
  notifyPush: z.boolean(),
  notifySMS: z.boolean(),
  emailRecipients: z.string().optional(),
  phoneNumbers: z.string().optional(),
});

type AlertConfigValues = z.infer<typeof alertConfigSchema>;

export default function AlertConfigForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<AlertConfigValues>({
    resolver: zodResolver(alertConfigSchema),
    defaultValues: {
      flightType: "all",
      delayThreshold: 15,
      notifyEmail: true,
      notifyPush: true,
      notifySMS: false,
      emailRecipients: "",
      phoneNumbers: "",
    },
  });

  async function onSubmit(data: AlertConfigValues) {
    try {
      const response = await fetch("/api/alerts/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save alert configuration");

      toast({
        title: "Success",
        description: "Alert configuration has been saved",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Configure Alerts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Alert Configuration</DialogTitle>
          <DialogDescription>
            Configure your alert preferences and notification settings.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="flightType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monitor Flight Type</FormLabel>
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
                      <SelectItem value="all">All Flights</SelectItem>
                      <SelectItem value="commercial">Commercial Only</SelectItem>
                      <SelectItem value="military">Military Only</SelectItem>
                      <SelectItem value="private">Private Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="delayThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delay Threshold (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="notifyEmail"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Email Notifications</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notifyPush"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Push Notifications</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notifySMS"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>SMS Notifications</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="emailRecipients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Recipients</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email1@example.com, email2@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumbers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Numbers (SMS)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1234567890, +0987654321"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Configuration</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}