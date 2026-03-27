import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface HistoryEntry {
  id: string;
  predicted_cgpa: number;
  recommendations: string[];
  risk_level: string;
  created_at: string;
}

const riskColors: Record<string, string> = {
  Low: "bg-success/10 text-success border-success/30",
  Medium: "bg-warning/10 text-warning border-warning/30",
  High: "bg-danger/10 text-danger border-danger/30",
};

const HistoryPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("predictions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setEntries((data as HistoryEntry[]) || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="container max-w-3xl py-12">
      <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Analysis History</h1>
      <p className="mb-8 text-muted-foreground">Track your progress over time.</p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No analyses yet. Run your first prediction from the Dashboard!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(entry.created_at), "MMM d, yyyy · h:mm a")}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-foreground">
                    CGPA: <span className="text-primary">{entry.predicted_cgpa}</span>
                  </p>
                </div>
                <Badge variant="outline" className={riskColors[entry.risk_level] || ""}>
                  {entry.risk_level} Risk
                </Badge>
              </div>
              {entry.recommendations && entry.recommendations.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {entry.recommendations.slice(0, 2).map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
