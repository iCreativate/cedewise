# Cedewise - Reinsurance Risk Placement Platform

Cedewise is a modern web application that streamlines the reinsurance risk placement process, facilitating seamless interaction between insurers, retail brokers, and reinsurance brokers.

## Features

- Risk Placement Management
- Real-time Collaboration
- Interactive Communication Tools
- Document Management
- Status Tracking
- Secure Authentication

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (Database ORM)
- NextAuth.js (Authentication)
- PostgreSQL

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/your-username/cedewise.git
cd cedewise
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Set up the database
```bash
npx prisma migrate dev
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/              # App router pages and layouts
├── components/       # Reusable UI components
├── lib/             # Utility functions and shared logic
├── types/           # TypeScript type definitions
└── prisma/          # Database schema and migrations
```

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

MIT
