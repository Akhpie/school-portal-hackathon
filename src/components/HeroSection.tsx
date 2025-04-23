import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Lightbulb, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Futuristic background with subtle animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-background -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Moving particles */}
      <div className="absolute inset-0 -z-5">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10 animate-float-random"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              animationDuration: `${Math.random() * 10 + 15}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Glowing orbit element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] -z-5">
        <div className="absolute inset-0 rounded-full border border-primary/10 animate-spin-slow"></div>
        <div className="absolute inset-0 rounded-full border-2 border-primary/5 animate-reverse-spin"></div>
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-slow"></div>

        {/* Orbital points */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary/20 animate-pulse"></div>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary/20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/20 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/20 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1
            className={`text-5xl pb-2 md:text-6xl font-bold mb-6 gradient-text leading-tight transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            The Future of Learning
          </h1>
          <p
            className={`text-lg text-foreground/70 mb-8 max-w-md mx-auto transition-all duration-1000 delay-300 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            Seamless education experience for the next generation
          </p>
          <div
            className={`flex flex-row gap-4 justify-center transition-all duration-1000 delay-500 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <Link to="/login">
              <Button
                size="lg"
                className="group bg-primary/90 hover:bg-primary backdrop-blur-sm border border-primary/30 hover:shadow-glow transition-all duration-300"
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Timeline style feature display with staggered animations */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-1/2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/40 before:to-primary/10 md:before:mx-auto md:before:translate-x-0">
            <div
              className={`relative flex flex-col md:flex-row items-center md:space-x-12 transition-all duration-700 delay-700 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 backdrop-blur-md md:ml-0 z-10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="glass-card w-full md:w-5/12 p-6 backdrop-blur-sm hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-semibold text-xl mb-2">
                  Interactive Learning
                </h3>
                <p className="text-muted-foreground">
                  Engage with dynamic content that adapts to your learning style
                </p>
              </div>
            </div>

            <div
              className={`relative flex flex-col md:flex-row-reverse items-center md:space-x-reverse md:space-x-12 transition-all duration-700 delay-900 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 backdrop-blur-md md:mr-0 z-10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div className="glass-card w-full md:w-5/12 p-6 backdrop-blur-sm hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-semibold text-xl mb-2">
                  AI-Powered Progress
                </h3>
                <p className="text-muted-foreground">
                  Smart analytics track your journey and suggest optimal paths
                </p>
              </div>
            </div>

            <div
              className={`relative flex flex-col md:flex-row items-center md:space-x-12 transition-all duration-700 delay-1100 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 backdrop-blur-md md:ml-0 z-10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="glass-card w-full md:w-5/12 p-6 backdrop-blur-sm hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-semibold text-xl mb-2">
                  Wellness Integration
                </h3>
                <p className="text-muted-foreground">
                  Mental health resources seamlessly integrated with your
                  learning
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
