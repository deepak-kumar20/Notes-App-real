# Notes App Frontend

Frontend React application for the Notes App built with React, TypeScript, and Vite.

## Features

- Modern React 18 with TypeScript
- OTP-based authentication UI
- Responsive design with TailwindCSS
- Form validation with React Hook Form + Zod
- Toast notifications
- Protected routes
- Notes CRUD interface

## Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your backend API URL:
```bash
VITE_BASE_URL=http://localhost:3001/api
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   └── ui/             # Base UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Environment Variables

- `VITE_BASE_URL` - Backend API base URL

## Routes

- `/` - Dashboard (protected)
- `/signin` - Sign in page
- `/signup` - Sign up page

## Dependencies

- React Router for navigation
- Radix UI for accessible components
- TailwindCSS for styling
- React Hook Form for form handling
- Zod for schema validation
