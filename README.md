# Flight Management System

A real-time flight management dashboard built with Next.js, TypeScript, and modern web technologies.

## Features

- Real-time flight status monitoring
- Multiple flight types (Commercial, Military, Private)
- Advanced search and filtering
- User authentication and authorization
- Real-time updates using Socket.io
- Beautiful UI with Shadcn UI (Radix) and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Shadcn UI, Tailwind CSS
- **Backend**: MongoDB, Redis, Kafka, Next.js 14
- **Infrastructure**: Docker, Docker Compose
- **Authentication**: NextAuth.js
- **Testing**: Jest

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development environment:
   ```bash
   docker-compose up -d
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/               # Next.js app directory
│   ├── api/           # API routes
│   ├── flights/       # Flight management pages
│   └── page.tsx       # Dashboard page
├── components/        # React components
│   ├── dashboard/     # Dashboard-specific components
│   ├── flights/       # Flight-related components
│   └── ui/           # Shadcn UI components
├── lib/              # Utility functions and types
└── docker-compose.yml # Docker services configuration
```
## Development

### Environment Setup

1. Create a `.env` file:
```env
MONGODB_URI=mongodb://admin:password@localhost:27017
SERVER_HOST=localhost
SERVER_PORT=3000
```

2. Start the services:
```bash
docker-compose up -d
```

3. Run database seeders:
```bash
npx tsx lib/seeders/users.ts
npx tsx lib/seeders/flight.ts
```

### Testing

Run the test suite:
```bash
npm test
```

### Code Style

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy on preffered platform (Vercel, AWS, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details