import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { logger } from "./lib/utils/logger";
import { flightChannel } from "./lib/constants/socket";
import { FlightService } from "./lib/services/FlightService";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.SERVER_HOST || "localhost";
const port = process.env.SERVER_PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  globalThis.io = io;

  FlightService.generateRandomFlightsPeriodically();

  io.on("connection", (socket) => {
    logger.info("Client connected:", socket.id);

    socket.on("disconnect", () => {
      logger.info("Client disconnected:", socket.id);
    });

    socket.on("error", (error) => {
      logger.error("Socket error:", error);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
