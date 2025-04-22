import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Laptop,
  Users,
  School,
  GraduationCap,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Heart,
} from "lucide-react";

const Index = () => {
  const { isLoggedIn } = useApp();

  return (
    <Layout>
      <HeroSection />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
              Ready to Join Our Community?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience the future of education with Arc School Portal.
              Register today and gain access to our comprehensive learning
              platform.
            </p>
            {isLoggedIn ? (
              <Link to="/dashboard">
                <Button size="lg" className="group">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/login">
                  <Button size="lg">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
