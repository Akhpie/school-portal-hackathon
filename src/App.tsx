import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { RewardsProvider } from "@/contexts/RewardsContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Schedule from "./pages/Schedule";
import Grades from "./pages/Grades";
import Wellness from "./pages/Wellness";
import Settings from "./pages/Settings";
import Portfolio from "./pages/Portfolio";
import Resources from "./pages/Resources";
import CareerPathway from "./pages/CareerPathway";
import NotFound from "./pages/NotFound";
import Games from "./pages/games/Games";
import WordPuzzleGame from "./pages/games/word-puzzle";
import MemoryMatchGame from "./pages/games/memory-match";
import MathQuizGame from "./pages/games/math-quiz";
import TypingSpeedGame from "./pages/games/typing-speed";
import HangmanGame from "./pages/games/hangman";
import About from "./pages/About";
import Rewards from "./pages/Rewards";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <RewardsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/wellness" element={<Wellness />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/career-pathway" element={<CareerPathway />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/word-puzzle" element={<WordPuzzleGame />} />
            <Route path="/games/memory-match" element={<MemoryMatchGame />} />
            <Route path="/games/math-quiz" element={<MathQuizGame />} />
            <Route path="/games/typing-speed" element={<TypingSpeedGame />} />
            <Route path="/games/hangman" element={<HangmanGame />} />
            <Route path="/rewards" element={<Rewards />} />
            {/* Add other routes as needed */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </RewardsProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
