import { Server } from "socket.io";
import { NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { FlightService } from "@/lib/services/FlightService";
import { logger } from "@/lib/utils/logger";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const ioHandler = (req: any, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new Server(httpServer, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Initialize FlightService with socket.io instance
    FlightService.initialize(io);

    io.on("connection", (socket) => {
      logger.info("Client connected:", socket.id);

      socket.on("disconnect", () => {
        logger.info("Client disconnected:", socket.id);
      });

      socket.on("error", (error) => {
        logger.error("Socket error:", error);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};
