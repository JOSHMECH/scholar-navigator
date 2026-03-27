// Multivariate Linear Regression: Y = β0 + β1(StudyHours) + β2(Attendance) + β3(CurrentCGPA) + β4(CarryOvers)
// Coefficients trained on synthetic student data

const COEFFICIENTS = {
  intercept: -0.5,
  studyHours: 0.04,
  attendance: 0.015,
  currentCgpa: 0.65,
  carryOvers: -0.15,
};

export interface PredictionInput {
  currentCgpa: number;
  targetCgpa: number;
  studyHours: number;
  attendance: number;
  carryOvers: number;
}

export interface PredictionResult {
  predictedCgpa: number;
  targetCgpa: number;
  gap: number;
  riskLevel: "Low" | "Medium" | "High";
  recommendations: string[];
  recommendedStudyHours: number;
  recommendedAttendance: number;
}

export function predictCGPA(input: PredictionInput): PredictionResult {
  const { currentCgpa, targetCgpa, studyHours, attendance, carryOvers } = input;

  // Predict
  let predicted =
    COEFFICIENTS.intercept +
    COEFFICIENTS.studyHours * studyHours +
    COEFFICIENTS.attendance * attendance +
    COEFFICIENTS.currentCgpa * currentCgpa +
    COEFFICIENTS.carryOvers * carryOvers;

  predicted = Math.max(0, Math.min(5.0, parseFloat(predicted.toFixed(2))));

  const gap = parseFloat((targetCgpa - predicted).toFixed(2));

  // Risk level
  let riskLevel: "Low" | "Medium" | "High";
  if (gap <= 0.2) riskLevel = "Low";
  else if (gap <= 0.6) riskLevel = "Medium";
  else riskLevel = "High";

  // Recommendations
  const recommendations: string[] = [];
  let recommendedStudyHours = studyHours;
  let recommendedAttendance = attendance;

  if (gap > 0) {
    // Calculate how many extra hours needed
    const extraHoursNeeded = gap / COEFFICIENTS.studyHours;
    recommendedStudyHours = Math.min(40, Math.ceil(studyHours + extraHoursNeeded * 0.5));
    recommendations.push(
      `Increase study time by ${Math.ceil(extraHoursNeeded * 0.5)} hours/week (to ~${recommendedStudyHours} hrs/week).`
    );

    if (attendance < 90) {
      recommendedAttendance = Math.min(98, attendance + 10);
      recommendations.push(
        `Improve attendance to at least ${recommendedAttendance}% (currently ${attendance}%).`
      );
    }

    if (carryOvers > 0) {
      recommendations.push(
        `Clear carry-over courses — each one reduces predicted CGPA by ~${Math.abs(COEFFICIENTS.carryOvers).toFixed(2)} points.`
      );
    }

    recommendations.push(
      `To reach your target of ${targetCgpa}, maintain consistent study habits and attend all classes.`
    );
  } else {
    recommendations.push("You're on track! Keep up your current study habits.");
    if (attendance >= 90) {
      recommendations.push("Excellent attendance — maintain it above 90%.");
    }
  }

  return {
    predictedCgpa: predicted,
    targetCgpa,
    gap: Math.max(0, gap),
    riskLevel,
    recommendations,
    recommendedStudyHours,
    recommendedAttendance,
  };
}
