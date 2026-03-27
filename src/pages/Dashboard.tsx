import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { predictCGPA, PredictionInput } from "@/lib/prediction";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<PredictionInput>({
    currentCgpa: 3.0,
    targetCgpa: 3.5,
    studyHours: 15,
    attendance: 80,
    carryOvers: 0,
  });

  const update = (field: keyof PredictionInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.currentCgpa < 0 || form.currentCgpa > 5) {
      toast({ title: "Invalid CGPA", description: "CGPA must be between 0 and 5", variant: "destructive" });
      return;
    }
    if (form.attendance < 0 || form.attendance > 100) {
      toast({ title: "Invalid Attendance", description: "Attendance must be 0–100%", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = predictCGPA(form);

      // Save input
      const { error: inputErr } = await supabase.from("student_inputs").insert({
        user_id: user!.id,
        current_cgpa: form.currentCgpa,
        target_cgpa: form.targetCgpa,
        study_hours: form.studyHours,
        attendance: form.attendance,
        carry_overs: form.carryOvers,
      });
      if (inputErr) throw inputErr;

      // Save prediction
      const { error: predErr } = await supabase.from("predictions").insert({
        user_id: user!.id,
        predicted_cgpa: result.predictedCgpa,
        recommendations: result.recommendations,
        risk_level: result.riskLevel,
      });
      if (predErr) throw predErr;

      // Navigate to results with state
      navigate("/results", { state: { result, input: form } });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Academic Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Enter your details to predict your CGPA.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card space-y-6 rounded-2xl p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="currentCgpa">Current CGPA</Label>
            <Input id="currentCgpa" type="number" step="0.01" min="0" max="5" value={form.currentCgpa} onChange={(e) => update("currentCgpa", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="targetCgpa">Target CGPA</Label>
            <Input id="targetCgpa" type="number" step="0.01" min="0" max="5" value={form.targetCgpa} onChange={(e) => update("targetCgpa", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="studyHours">Weekly Study Hours</Label>
            <Input id="studyHours" type="number" min="0" max="80" value={form.studyHours} onChange={(e) => update("studyHours", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="attendance">Attendance Rate (%)</Label>
            <Input id="attendance" type="number" min="0" max="100" value={form.attendance} onChange={(e) => update("attendance", e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="carryOvers">Number of Carry-Overs</Label>
            <Input id="carryOvers" type="number" min="0" max="20" value={form.carryOvers} onChange={(e) => update("carryOvers", e.target.value)} required />
          </div>
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          <Sparkles className="mr-2 h-5 w-5" />
          {loading ? "Analyzing..." : "Analyze My Performance"}
        </Button>
      </form>
    </div>
  );
};

export default Dashboard;
