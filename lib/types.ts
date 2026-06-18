// Domain model — maps 1:1 to the brief's §7.1 schema and to a future
// PostgreSQL/Prisma schema. The caregiver is always the data subject.

import type { Locale } from "./i18n/config";

export type LocalizedText = Partial<Record<Locale, string>> & { en: string };

export type Role = "caregiver" | "agent" | "trainer" | "clinician" | "admin";
export type Emirate = "abu_dhabi" | "dubai" | "sharjah" | "other";

export type ConsentScope =
  | "ai_processing"
  | "health_data"
  | "reminders_whatsapp"
  | "location";

export const CONSENT_SCOPES: ConsentScope[] = [
  "ai_processing",
  "health_data",
  "reminders_whatsapp",
  "location",
];

export interface ConsentRecord {
  id: string;
  userId: string;
  scope: ConsentScope;
  granted: boolean;
  version: string;
  timestamp: string;
}

export interface User {
  id: string;
  role: Role;
  fullName: string;
  phone: string;
  email?: string;
  preferredLanguage: Locale;
  emirate: Emirate;
  geo?: { lat: number; lng: number };
  createdAt: string;
  // Set after the caregiver completes the /welcome questionnaire.
  profile?: CaregiverProfile;
}

// ## [WHAT CAN WE EDIT] The caregiver intake captured at /welcome. Used to tailor
// the dashboard, workshops, and support matches to this caregiver.
export type CareRelationship = "parent" | "spouse" | "child" | "sibling" | "other";
export type CareNeed =
  | "mobility"
  | "chronic_illness"
  | "dementia"
  | "post_hospital"
  | "nutrition"
  | "medical_devices"
  | "palliative";
export type CareGoal =
  | "skills"
  | "self_care"
  | "financial"
  | "respite"
  | "appointments";

export interface CaregiverProfile {
  careRelationship: CareRelationship;
  recipientAgeBand: string; // e.g. "60-69", "70-79", "80+"
  livesWithCaregiver: boolean;
  needs: CareNeed[];
  goals: CareGoal[];
  onboarded: boolean;
  updatedAt: string;
}

// ## [WHAT CAN WE EDIT] Care partners shown in the strip and on /partners.
export type PartnerCategory =
  | "government"
  | "hospital"
  | "clinic"
  | "homecare"
  | "insurance"
  | "finance"
  | "wellbeing"
  | "staffing";

export interface Partner {
  id: string;
  name: LocalizedText;
  category: PartnerCategory;
  blurb: LocalizedText;
  logo: string; // /images/partners/<id>.png  (client provides; falls back to a chip)
}

export type TrainingTopic =
  | "mental_health"
  | "self_care"
  | "financial_literacy"
  | "medical_devices";
export type TrainingFormat = "in_person" | "online" | "hybrid";

export interface ResourceRef {
  id: string;
  title: LocalizedText;
  kind: "recording" | "download" | "audio";
  offline: boolean;
}

export interface TrainingSession {
  id: string;
  topic: TrainingTopic;
  title: LocalizedText;
  summary: LocalizedText;
  format: TrainingFormat;
  centerId?: string;
  trainerName: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  seatsTaken: number;
  certificationOffered: boolean;
  materials: ResourceRef[];
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface BusinessHours {
  // Honors UAE working week + Ramadan/holiday overrides (data-driven).
  weekly: { day: number; open: string; close: string }[];
  notes?: LocalizedText;
}

export interface Center {
  id: string;
  name: LocalizedText;
  geo: { lat: number; lng: number };
  address: LocalizedText;
  hours: BusinessHours;
}

export type EnrollmentStatus =
  | "enrolled"
  | "attended"
  | "no_show"
  | "completed";

export interface Enrollment {
  id: string;
  userId: string;
  sessionId: string;
  status: EnrollmentStatus;
  progressPct: number;
  certificateId?: string;
}

export type ProviderType = "doctor" | "nurse" | "counselor" | "support_agent";

export interface EligibilityRule {
  // Minimal, declarative rules the eligibility-check endpoint evaluates.
  field: "emirate" | "hasConsent";
  op: "in" | "equals";
  value: string[] | string;
  message: LocalizedText;
}

export interface Service {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  category: string;
  eligibilityRules: EligibilityRule[];
  providerType: ProviderType;
  bookable: boolean;
  tags: string[];
  free: boolean;
}

export type AppointmentStatus =
  | "requested"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  providerName: string;
  startsAt: string;
  status: AppointmentStatus;
  createdAt: string;
}

export type TicketStatus = "open" | "assigned" | "resolved";
export type TicketPriority = "low" | "normal" | "high" | "urgent";

export interface SupportTicket {
  id: string;
  userId: string;
  origin: "chatbot_handoff" | "direct";
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  // Only stored when the user consented to AI processing.
  contextSnapshot?: { role: "user" | "assistant"; text: string }[];
  assignedAgentName?: string;
  sla: { respondBy: string };
  createdAt: string;
}
