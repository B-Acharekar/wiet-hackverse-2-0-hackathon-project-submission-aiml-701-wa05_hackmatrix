/**
 * API Service Layer
 * Centralized service to handle all API communications with the deep learning backend.
 */

// Base URLs can be extracted to environment variables later
const API_BASE_URL = "http://localhost:5000";

export interface PredictionResponse {
  prediction: string;
  confidence: number;
  heatmap_url: string;
  explanation: string;
  // Included additional useful fields that a diagnostic AI usually needs
  diseaseId?: string; 
  nextSteps?: string[]; 
  severity?: "low" | "medium" | "high";
}

/**
 * Predict Image Medical Condition
 * Sends a patient image to the Flask DL backend for classification and heatmap generation
 * 
 * @param file The image file (File object) to analyze
 * @param modelType Optional: Specify which model to run (e.g., 'pneumonia-xray', 'skin-lesion')
 * @returns Promise<PredictionResponse>
 */
export async function predictImage(file: File, modelType: string = "default"): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("image", file);
  
  // Future proofing: send the model type if the backend handles multiple pipelines
  formData.append("model", modelType);

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
      // Note: Do not set Content-Type header manually when using FormData
      // The browser will automatically set it to multipart/form-data with the correct boundary
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: PredictionResponse = await response.json();
    return data;
    
  } catch (error) {
    console.error("Diagnosis prediction failed:", error);
    throw error;
  }
}

/**
 * Health Check
 * Verifies the python backend is running
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
