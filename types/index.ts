export type Intent = 'symptom' | 'inquiry' | 'appointment' | 'emergency' | 'general';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency';

export interface Classification {
  intent: Intent;
  symptoms: string[];
  suspected_conditions: string[];
  recommended_department: string;
  is_emergency: boolean;
  urgency_level: UrgencyLevel;
  hospital_guidance: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  classification?: Classification;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  session_id: string;
  history: { role: 'user' | 'assistant'; content: string }[];
}

export interface ChatResponse {
  message: string;
  classification: Classification;
}

export interface Consultation {
  id: string;
  session_id: string;
  patient_message: string;
  ai_response: string;
  classification: Classification;
  created_at: string;
}
