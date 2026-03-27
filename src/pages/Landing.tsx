import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GraduationCap, TrendingUp, Target, BarChart3, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "CGPA Prediction",
    description: "Multivariate regression model predicts your academic trajectory with precision.",
  },
  {
    icon: Target,
    title: "Personalized Goals",
    description: "Actionable recommendations tailored to your target CGPA and current performance.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Track improvements over time with saved analysis history and visual trends.",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Color-coded risk levels help you identify areas needing immediate attention.",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Get results in seconds — no waiting, no complex setup required.",
  },
  {
    icon: GraduationCap,
    title: "Student-First Design",
    description: "Built by students, for students. Clean, intuitive, and mobile-friendly.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="container flex min-h-[85vh] flex-col items-center justify-center py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              Predictive Academic Analytics
            </div>
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
              Turn Academic Goals
              <br />
              <span className="text-gradient">Into Action Plans</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              ScholarLens uses statistical modeling to predict your CGPA and deliver
              personalized study recommendations — so you can focus on what matters.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/auth">Start Your Analysis</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/auth">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features */}
      <section className="container py-24">
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Everything You Need to Excel
          </h2>
          <p className="mt-4 text-muted-foreground">
            Data-driven insights to transform your academic performance.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card group rounded-xl p-6 transition-all duration-300 hover:shadow-xl"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 ScholarLens. Built with ❤️ by JOSH.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
