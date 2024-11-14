"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSocketStore } from "@/hooks/use-socket";

export default function ConnectionStatus() {
  const [status, setStatus] = useState<"connected" | "disconnected">(
    "disconnected"
  );

  const { initializeSocket } = useSocketStore();

  useEffect(() => {
    initializeSocket(
      // on connection
      () => {
        setStatus("connected");
      },
      // on disconnect, or error
      () => {
        setStatus("disconnected");
      }
    );
  }, []);

  return (
    <Badge
      variant="outline"
      className={`${
        status === "connected"
          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
          : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      } flex items-center gap-1`}
    >
      {status === "connected" ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Disconnected</span>
        </>
      )}
    </Badge>
  );
}
