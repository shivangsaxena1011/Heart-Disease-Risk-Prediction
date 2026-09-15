export interface PatientData {
  age: number;
  sex: number; // 1 = Male, 0 = Female
  cp: number; // 1 = Typical, 2 = Atypical, 3 = Non-anginal, 4 = Asymptomatic
  trestbps: number; // mmHg
  chol: number; // mg/dL
  fbs: number; // 1 = True (>120), 0 = False
  restecg: number; // 0 = Normal, 1 = ST-T wave abnormality, 2 = LVH
  thalach: number; // bpm
  exang: number; // 1 = Yes, 0 = No
  oldpeak: number; // mm
  slope: number; // 1 = Upsloping, 2 = Flat, 3 = Downsloping
  ca: number; // 0 - 3
  thal: number; // 3 = Normal, 6 = Fixed defect, 7 = Reversible defect
}

export interface FactorAttribution {
  feature: string;
  label: string;
  patient_value: number | string;
  impact_score: number;
  direction: "elevating" | "lowering" | "neutral";
}

export interface RiskClassification {
  level: "Lower" | "Intermediate" | "Higher";
  title: string;
  badge_color: "emerald" | "amber" | "rose";
  summary: string;
}

export interface Recommendation {
  category: string;
  title: string;
  detail: string;
}

export interface PredictionResult {
  assessment_id: string;
  timestamp: string;
  model_name: string;
  model_version?: string;
  raw_prediction: number;
  risk_probability: number;
  risk_percentage: number;
  risk_classification: RiskClassification;
  top_contributing_factors: FactorAttribution[];
  all_factor_attributions: FactorAttribution[];
  recommendations: Recommendation[];
  input_summary: PatientData;
  disclaimer: string;
  emergency_notice: string;
}

export interface StoredAssessment {
  id: string;
  date: string;
  riskLevel: "Lower" | "Intermediate" | "Higher";
  riskPercentage: number;
  result: PredictionResult;
}

export interface ModelMetricDetails {
  name: string;
  cv_accuracy_mean: number;
  cv_accuracy_std: number;
  cv_roc_auc_mean: number;
  cv_f1_mean: number;
  test_accuracy: number;
  test_precision: number;
  test_recall: number;
  test_f1: number;
  test_roc_auc: number;
  confusion_matrix: {
    raw: number[][];
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
  roc_curve: { fpr: number; tpr: number }[];
}

export interface ModelInfoResponse {
  metadata: {
    dataset_name: string;
    source: string;
    total_samples: number;
    total_features: number;
    target_variable: string;
    class_distribution: {
      negative_lower_risk_count: number;
      positive_higher_risk_count: number;
      negative_pct: number;
      positive_pct: number;
    };
    selected_model: string;
    model_version?: string;
    selection_rationale: string;
    training_date: string;
    preprocessing_pipeline: {
      numerical_scaling: string;
      categorical_encoding: string;
      numerical_features: string[];
      categorical_features: string[];
    };
  };
  metrics: {
    models: Record<string, ModelMetricDetails>;
    best_model: string;
    selected_metrics: ModelMetricDetails;
  };
  feature_importance: {
    feature: string;
    importance: number;
    std: number;
    relative_weight: number;
    label: string;
  }[];
}
