import jsPDF from "jspdf";
import { PredictionResult } from "./types";
import { formatDate } from "./utils";

export function generatePdfReport(result: PredictionResult): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 26, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("HEARTGUARD AI", 14, 12);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(186, 230, 253); // sky-200
  doc.text("AI-Powered Heart Disease Risk Screening Report", 14, 18);

  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text(`ID: ${result.assessment_id}  |  Date: ${formatDate(result.timestamp)}`, pageWidth - 14, 18, { align: "right" });

  y = 34;

  // Notice Alert Box
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(14, y, pageWidth - 28, 14, 2, 2, "FD");
  doc.setTextColor(146, 64, 14); // amber-900
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("IMPORTANT: NOT A MEDICAL DIAGNOSIS", 18, y + 5);
  doc.setFont("helvetica", "normal");
  doc.text("This report provides model-estimated statistical screening based on the UCI Cleveland dataset. Never use for clinical diagnosis.", 18, y + 10);

  y += 20;

  // Screening Estimation Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("SCREENING RESULT SUMMARY", 18, y + 7);

  doc.setFontSize(16);
  if (result.risk_classification.level === "Higher") {
    doc.setTextColor(225, 29, 72); // rose
  } else if (result.risk_classification.level === "Intermediate") {
    doc.setTextColor(217, 119, 6); // amber
  } else {
    doc.setTextColor(5, 150, 105); // emerald
  }
  doc.text(`${result.risk_classification.level} Model-Estimated Risk`, 18, y + 16);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Model-Estimated Probability: ${result.risk_percentage}% (P = ${result.risk_probability.toFixed(3)})`, 18, y + 22);

  doc.setFontSize(8);
  doc.text(`Model: ${result.model_name} (${result.model_version || "HeartGuard Model v1.0"})`, pageWidth - 18, y + 22, { align: "right" });

  y += 32;

  // Clinical Parameters Summary (2 columns)
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ENTERED CLINICAL PARAMETERS", 14, y);
  y += 5;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);

  const p = result.input_summary || ({} as any);
  const col1 = [
    `Patient Age: ${p.age ?? "N/A"} years`,
    `Biological Sex: ${p.sex === 1 ? "Male (1)" : p.sex === 0 ? "Female (0)" : "N/A"}`,
    `Resting Blood Pressure: ${p.trestbps ?? "N/A"} mm Hg`,
    `Serum Cholesterol: ${p.chol ?? "N/A"} mg/dL`,
    `Fasting Blood Sugar > 120: ${p.fbs === 1 ? "Yes (1)" : p.fbs === 0 ? "No (0)" : "N/A"}`,
    `Resting ECG: ${p.restecg === 0 ? "Normal (0)" : p.restecg === 1 ? "ST-T Abnormality (1)" : p.restecg === 2 ? "LV Hypertrophy (2)" : "N/A"}`,
    `Max Heart Rate Achieved: ${p.thalach ?? "N/A"} bpm`,
  ];

  const col2 = [
    `Chest Pain Type: ${p.cp === 1 ? "Typical Angina (1)" : p.cp === 2 ? "Atypical Angina (2)" : p.cp === 3 ? "Non-Anginal (3)" : p.cp === 4 ? "Asymptomatic (4)" : "N/A"}`,
    `Exercise-Induced Angina: ${p.exang === 1 ? "Yes (1)" : p.exang === 0 ? "No (0)" : "N/A"}`,
    `ST Depression (Oldpeak): ${p.oldpeak !== undefined ? `${p.oldpeak} mm` : "N/A"}`,
    `ST Slope: ${p.slope === 1 ? "Upsloping (1)" : p.slope === 2 ? "Flat (2)" : p.slope === 3 ? "Downsloping (3)" : "N/A"}`,
    `Major Fluoroscopy Vessels: ${p.ca !== undefined ? `${p.ca} vessel(s)` : "N/A"}`,
    `Thalassemia Scan: ${p.thal === 3 ? "Normal (3)" : p.thal === 6 ? "Fixed Defect (6)" : p.thal === 7 ? "Reversible Defect (7)" : "N/A"}`,
  ];

  let leftY = y + 2;
  col1.forEach((text) => {
    doc.text(`• ${text}`, 16, leftY);
    leftY += 4.5;
  });

  let rightY = y + 2;
  col2.forEach((text) => {
    doc.text(`• ${text}`, pageWidth / 2 + 6, rightY);
    rightY += 4.5;
  });

  y = Math.max(leftY, rightY) + 6;

  // Contributing Factors
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("PRIMARY MODEL-INFLUENCING FACTORS", 14, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  const safeFactors = Array.isArray(result.top_contributing_factors) ? result.top_contributing_factors : [];
  if (safeFactors.length === 0) {
    doc.text("• Global model weights applied across evaluated clinical features.", 16, y);
    y += 4.5;
  } else {
    safeFactors.slice(0, 4).forEach((factor) => {
      const dir = factor.direction === "elevating" ? "[Elevating Factor]" : factor.direction === "lowering" ? "[Protective Shift]" : "[Neutral]";
      doc.text(`• ${factor.label}: Patient Value ${factor.patient_value}  -  ${dir}`, 16, y);
      y += 4.5;
    });
  }

  y += 4;

  // Educational Guidance
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("EDUCATIONAL RECOMMENDATIONS & DOCTOR DISCUSSION POINTS", 14, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  const safeRecs = Array.isArray(result.recommendations) ? result.recommendations : [];
  safeRecs.slice(0, 3).forEach((rec) => {
    doc.setFont("helvetica", "bold");
    doc.text(`• ${rec.title}: `, 16, y);
    const titleWidth = doc.getTextWidth(`• ${rec.title}: `);
    doc.setFont("helvetica", "normal");
    const wrappedDetail = doc.splitTextToSize(rec.detail, pageWidth - 32 - titleWidth);
    doc.text(wrappedDetail, 16 + titleWidth, y);
    y += Math.max(wrappedDetail.length * 4, 5);
  });

  y += 4;

  // Emergency Medical Notice
  doc.setFillColor(254, 242, 242); // rose-50
  doc.setDrawColor(244, 63, 94);
  doc.roundedRect(14, y, pageWidth - 28, 14, 2, 2, "FD");
  doc.setTextColor(159, 18, 57);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("EMERGENCY MEDICAL WARNING:", 18, y + 5);
  doc.setFont("helvetica", "normal");
  doc.text(doc.splitTextToSize("If experiencing severe chest pain, shortness of breath, radiating discomfort, or loss of consciousness, seek immediate emergency medical care (dial 911/112).", pageWidth - 36), 18, y + 9);

  y += 18;

  // Footer Disclaimer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  const disclaimerText = doc.splitTextToSize(
    "HeartGuard AI is an educational college healthcare application developed with scikit-learn and Next.js. Model metrics reflect empirical performance on the UCI Cleveland dataset and must not be used for diagnosis or altering medical treatment.",
    pageWidth - 28
  );
  doc.text(disclaimerText, 14, y);

  doc.save(`HeartGuard_AI_Screening_Report_${result.assessment_id}.pdf`);
}
