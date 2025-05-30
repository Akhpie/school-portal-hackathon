# ARC School Portal

![ARC School Portal](https://cdn.prod.website-files.com/6724e8c2371a456c6ffa4031/6807ffaaf22a979cbd751777_our%20ARC%20img.png)

## Overview

ARC School Portal is a comprehensive educational management system designed to streamline administrative processes and enhance the learning experience for students, teachers, and parents. Built with modern web technologies, this platform provides a centralized hub for academic activities, communication, and resource management.

## Features

### Student Features

- **Dashboard**: Personalized dashboard with quick access to assignments, grades, schedule, and notifications
- **Courses**: Browse and access course materials, syllabi, and resources
- **Assignments**: View, submit, and track assignments with due dates and feedback
- **Grades**: Real-time grade tracking and performance analytics
- **Schedule**: Interactive timetable with class schedules and important events
- **Portfolio**: Digital portfolio to showcase academic achievements and projects
- **Career Pathway**: Career guidance and educational pathway planning tools
- **Wellness**: Resources for mental health, physical wellness, and student support
- **Rewards**: Gamified learning incentives and recognition system
- **Internships**: Available Internships and Jobs are shown to the students for easy apply.
- **Mentornship**: Mentorship given by school seniors and Alumni's.
- **Themes**: Four themes ( Light, dark, Blue, Pink ). Choose the Aesthetic you feel and go with the flow!

### Communication Tools

- **Messages**: Secure messaging system between students, teachers, and parents ( mockup )
- **Notifications**: Real-time alerts for deadlines, events, and important announcements ( mockup )

### Additional Resources

- **Resources**: Centralized library of educational materials and references
- **Games**: Educational games and interactive learning activities

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Shadcn UI components with Tailwind CSS
- **Build Tool**: Vite
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Data Visualization**: Recharts
- **Date Management**: date-fns
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Akhpie/school-portal-hackathon.git
   cd hackathon-arc-portal
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## Build for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configuration
├── pages/            # Application pages
│   ├── Dashboard.tsx
│   ├── Courses.tsx
│   ├── Assignments.tsx
│   ├── Grades.tsx
│   └── ... (other pages)
├── styles/           # Global styles and theme configuration
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component
└── main.tsx         # Application entry point
```
