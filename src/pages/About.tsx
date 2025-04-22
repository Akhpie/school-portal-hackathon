import { useEffect, useState, useRef } from "react";
import { BookOpen, Award, Users, Code, Globe, Zap } from "lucide-react";
import Layout from "@/components/Layout";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const handleScroll = () => {
      const pageTop = window.scrollY;
      const pageBottom = pageTop + window.innerHeight;
      const viewportMiddle = pageTop + window.innerHeight / 2;

      sectionRefs.current.forEach((section, index) => {
        if (!section) return;

        const elementTop = section.offsetTop;
        const elementBottom = elementTop + section.offsetHeight;

        // Check if element is in viewport and closest to middle
        if (elementTop <= pageBottom && elementBottom >= pageTop) {
          // Calculate distance from middle of viewport
          const distanceFromMiddle = Math.abs(
            viewportMiddle - (elementTop + elementBottom) / 2
          );

          // Set as active if it's the closest to middle
          const isClosest =
            Math.min(
              ...sectionRefs.current
                .filter(
                  (s) =>
                    s &&
                    s.offsetTop <= pageBottom &&
                    s.offsetTop + s.offsetHeight >= pageTop
                )
                .map((s) =>
                  Math.abs(
                    viewportMiddle -
                      (s!.offsetTop + s!.offsetTop + s!.offsetHeight) / 2
                  )
                )
            ) === distanceFromMiddle;

          if (isClosest) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const milestones = [
    {
      year: "2019",
      title: "Foundation",
      description:
        "Arc Educational Platform was founded with a vision to revolutionize digital learning.",
      icon: <Globe className="h-6 w-6 text-primary" />,
    },
    {
      year: "2020",
      title: "First Release",
      description:
        "Launched our first beta version with core learning management features.",
      icon: <Zap className="h-6 w-6 text-primary" />,
    },
    {
      year: "2021",
      title: "AI Integration",
      description:
        "Introduced machine learning algorithms to personalize learning paths.",
      icon: <Code className="h-6 w-6 text-primary" />,
    },
    {
      year: "2022",
      title: "Global Reach",
      description:
        "Expanded to serve educational institutions across 30+ countries.",
      icon: <Globe className="h-6 w-6 text-primary" />,
    },
    {
      year: "2023",
      title: "Wellness Focus",
      description:
        "Added pioneering mental health and wellness support features.",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
  ];

  const features = [
    {
      title: "Adaptive Learning",
      description:
        "Our AI-driven platform adjusts to each student's pace and learning style, ensuring optimal educational outcomes.",
      icon: <BookOpen className="h-6 w-6" />,
      delay: 200,
    },
    {
      title: "Mental Wellness",
      description:
        "Integrated support tools help maintain balance between academic performance and mental health.",
      icon: <Users className="h-6 w-6" />,
      delay: 400,
    },
    {
      title: "Global Standards",
      description:
        "Curriculum aligned with international educational standards ensuring quality learning.",
      icon: <Award className="h-6 w-6" />,
      delay: 600,
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen pt-16 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-background -z-10">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 -z-5">
          {[...Array(15)].map((_, i) => (
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

        {/* Vertical progress indicator */}
        <div className="hidden lg:block fixed left-[5%] top-1/2 -translate-y-1/2 h-[50vh] w-0.5 bg-foreground/10 z-20">
          <div
            className="absolute top-0 left-0 w-full bg-primary transition-all duration-500 ease-in-out"
            style={{
              height: `${(activeSection / (milestones.length - 1)) * 100}%`,
            }}
          ></div>

          {milestones.map((milestone, index) => (
            <div
              key={index}
              className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                index <= activeSection
                  ? "border-primary bg-primary/20"
                  : "border-foreground/20 bg-background"
              }`}
              style={{
                top: `${(index / (milestones.length - 1)) * 100}%`,
                transform: `translate(-50%, -50%) scale(${
                  index === activeSection ? 1.5 : 1
                })`,
              }}
            >
              <div
                className={`absolute left-6 transition-all duration-300 whitespace-nowrap ${
                  index === activeSection
                    ? "opacity-100 translate-x-0"
                    : "opacity-40 -translate-x-2"
                }`}
              >
                <span className="text-xs font-semibold text-primary/80">
                  {milestone.year}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 pt-12 pb-24">
          {/* Hero section */}
          <div
            className={`max-w-3xl mx-auto text-center mb-20 transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Our Mission
            </h1>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Transforming education through technology that adapts, engages,
              and inspires the next generation of learners.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`glass-card p-8 backdrop-blur-sm hover:shadow-glow hover:-translate-y-1 transition-all duration-500 transform ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${feature.delay}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Timeline sections */}
          <div className="max-w-4xl mx-auto">
            <h2
              className={`text-3xl font-bold mb-12 text-center gradient-text transition-all duration-700 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              Our Journey
            </h2>

            {milestones.map((milestone, index) => (
              <div
                key={index}
                ref={(el) => (sectionRefs.current[index] = el)}
                className="mb-28 relative"
              >
                <div
                  className={`flex flex-col md:flex-row ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
                    <div
                      className={`w-64 h-64 rounded-full bg-primary/5 backdrop-blur-sm flex items-center justify-center transition-all duration-700 transform ${
                        activeSection >= index
                          ? "scale-100 opacity-100"
                          : "scale-90 opacity-30"
                      }`}
                    >
                      <div className="w-56 h-56 rounded-full border border-primary/20 flex items-center justify-center animate-spin-slow">
                        <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center animate-reverse-spin">
                          <div className="text-center">
                            <div className="text-5xl font-bold gradient-text mb-2">
                              {milestone.year}
                            </div>
                            <div className="flex justify-center">
                              {milestone.icon}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`md:w-1/2 ${
                      index % 2 === 0 ? "md:pl-12" : "md:pr-12"
                    } transition-all duration-700 transform ${
                      activeSection >= index
                        ? "translate-y-0 opacity-100"
                        : "translate-y-20 opacity-30"
                    }`}
                  >
                    <h3 className="text-2xl font-bold mb-4">
                      {milestone.title}
                    </h3>
                    <p className="text-foreground/70 text-lg">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Only show connector for all but last item */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-primary/30 to-transparent bottom-[-4rem] md:block hidden"></div>
                )}
              </div>
            ))}
          </div>

          {/* Conclusion */}
          <div
            className={`max-w-2xl mx-auto text-center mt-12 transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <h2 className="text-3xl font-bold mb-6 gradient-text">
              The Future of Education
            </h2>
            <p className="text-xl text-foreground/70">
              Join us as we continue to push the boundaries of what's possible
              in educational technology.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
