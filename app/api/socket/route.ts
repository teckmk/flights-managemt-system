import { Server } from 'socket.io';
import { NextApiResponse } from 'next';
import { Server as NetServer } from 'http';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: any, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new Server(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;