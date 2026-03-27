import { useLocation, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PredictionResult, PredictionInput } from "@/lib/prediction";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, ArrowLeft, History } from "lucide-react";

const riskConfig = {
  Low: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "On Track" },
  Medium: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Moderate Risk" },
  High: { icon: XCircle, color: "text-danger", bg: "bg-danger/10", label: "High Risk" },
};

const Results = () => {
  const location = useLocation();
  const state = location.state as { result: PredictionResult; input: PredictionInput } | null;

  if (!state) return <Navigate to="/dashboard" />;

  const { result } = state;
  const risk = riskConfig[result.riskLevel];
  const RiskIcon = risk.icon;
  const progressPercent = Math.min(100, (result.predictedCgpa / result.targetCgpa) * 100);

  return (
    <div className="container max-w-3xl py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Analysis Results</h1>
            <p className="mt-1 text-muted-foreground">Here's your predicted performance.</p>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${risk.bg} ${risk.color}`}>
            <RiskIcon className="h-4 w-4" />
            {risk.label}
          </div>
        </div>

        {/* CGPA Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="glass-card rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">Predicted CGPA</p>
            <p className="font-display text-4xl font-bold text-primary">{result.predictedCgpa}</p>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">Target CGPA</p>
            <p className="font-display text-4xl font-bold text-foreground">{result.targetCgpa}</p>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">Gap</p>
            <p className={`font-display text-4xl font-bold ${result.gap > 0 ? "text-danger" : "text-success"}`}>
              {result.gap > 0 ? `-${result.gap}` : "0"}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="glass-card mb-8 rounded-xl p-6">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to Target</span>
            <span className="font-medium text-foreground">{progressPercent.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        {/* Recommendations */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Recommendations</h2>
          <ul className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 rounded-lg bg-accent/50 p-3 text-sm text-foreground"
              >
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {rec}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex gap-4">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Analysis
            </Link>
          </Button>
          <Button variant="hero" asChild>
            <Link to="/history">
              <History className="mr-2 h-4 w-4" />
              View History
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Results;
