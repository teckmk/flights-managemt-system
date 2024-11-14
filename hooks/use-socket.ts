import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { logger } from "@/lib/utils/logger";

type SocketStore = {
  socket: Socket | null;
  connectionStatus: "connected" | "disconnected" | "connecting";
  initializeSocket: (
    onConnected?: () => void,
    onDisconnected?: () => void
  ) => void;
  disconnectSocket: () => void;
};

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  connectionStatus: "disconnected",

  initializeSocket: (onConnected, onDisconnected) => {
    set({ connectionStatus: "connecting" });

    const _socket = io();

    _socket.on("connect", () => {
      set({ connectionStatus: "connected" });
      set({ socket: _socket });
      onConnected?.();
      console.log("Socket connected");
    });

    _socket.on("message", (data) => {
      logger.info(`Message received: ${data}`);
    });

    _socket.on("connect_error", (error) => {
      set({ connectionStatus: "disconnected" });
      onDisconnected?.();
      console.error("Socket connection error:", error);
    });

    _socket.on("disconnect", (reason) => {
      set({ connectionStatus: "disconnected" });
      onDisconnected?.();
      console.log("Socket disconnected:", reason);
    });

    set({ socket: _socket });
  },

  disconnectSocket: () => {
    const { socket } = useSocketStore.getState();
    if (socket) {
      socket.disconnect();
      set({ socket: null, connectionStatus: "disconnected" });
    }
  },
}));
