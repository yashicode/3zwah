import { randomUUID } from "crypto";
import type {
  Appointment,
  ConsentRecord,
  ConsentScope,
  Enrollment,
  Service,
  SupportTicket,
  TicketPriority,
  TrainingSession,
  User,
} from "../types";
import { CONSENT_SCOPES } from "../types";
import type { CaregiverProfile } from "../types";
import { centers, partners, services, trainings } from "./seed";

const CONSENT_VERSION = "2026-06-01";

interface DB {
  users: Map<string, User>;
  consents: ConsentRecord[];
  enrollments: Enrollment[];
  appointments: Appointment[];
  tickets: SupportTicket[];
  trainings: TrainingSession[];
}

// Persist across hot reloads in dev. Replaced by Postgres/Prisma in production.
const g = globalThis as unknown as { __sanadDB?: DB };

function init(): DB {
  return {
    users: new Map(),
    consents: [],
    enrollments: [],
    appointments: [],
    tickets: [],
    trainings: trainings.map((t) => ({ ...t })),
  };
}

export const db: DB = g.__sanadDB ?? (g.__sanadDB = init());

/* ---------------- Users ---------------- */

export function findUser(id: string): User | undefined {
  return db.users.get(id);
}

export function upsertUserByPhone(phone: string, fullName?: string): User {
  for (const u of db.users.values()) {
    if (u.phone === phone) return u;
  }
  const user: User = {
    id: randomUUID(),
    role: "caregiver",
    fullName: fullName?.trim() || "Caregiver",
    phone,
    preferredLanguage: "en",
    emirate: "abu_dhabi",
    createdAt: new Date().toISOString(),
  };
  db.users.set(user.id, user);
  // Default consents: everything off until the user opts in.
  for (const scope of CONSENT_SCOPES) {
    db.consents.push({
      id: randomUUID(),
      userId: user.id,
      scope,
      granted: false,
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
    });
  }
  return user;
}

export function updateUser(id: string, patch: Partial<User>): User | undefined {
  const u = db.users.get(id);
  if (!u) return undefined;
  const next = { ...u, ...patch, id: u.id };
  db.users.set(id, next);
  return next;
}

// Save the caregiver questionnaire answers (also mirrors preferredLanguage/emirate).
export function setProfile(id: string, profile: CaregiverProfile): User | undefined {
  return updateUser(id, { profile });
}

/* ---------------- Partners ---------------- */

export function listPartners() {
  return partners;
}

/* ---------------- Consent ---------------- */

export function getConsents(userId: string): ConsentRecord[] {
  // Latest record per scope.
  const latest = new Map<ConsentScope, ConsentRecord>();
  for (const c of db.consents.filter((c) => c.userId === userId)) {
    const prev = latest.get(c.scope);
    if (!prev || c.timestamp > prev.timestamp) latest.set(c.scope, c);
  }
  return CONSENT_SCOPES.map(
    (scope) =>
      latest.get(scope) ?? {
        id: randomUUID(),
        userId,
        scope,
        granted: false,
        version: CONSENT_VERSION,
        timestamp: new Date(0).toISOString(),
      },
  );
}

export function hasConsent(userId: string, scope: ConsentScope): boolean {
  return getConsents(userId).find((c) => c.scope === scope)?.granted ?? false;
}

export function setConsent(
  userId: string,
  scope: ConsentScope,
  granted: boolean,
): ConsentRecord {
  const record: ConsentRecord = {
    id: randomUUID(),
    userId,
    scope,
    granted,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  };
  db.consents.push(record);
  return record;
}

/* ---------------- Training ---------------- */

export function listTrainings(filters?: {
  topic?: string;
  format?: string;
}): TrainingSession[] {
  return db.trainings.filter(
    (t) =>
      (!filters?.topic || t.topic === filters.topic) &&
      (!filters?.format || t.format === filters.format),
  );
}

export function getTraining(id: string): TrainingSession | undefined {
  return db.trainings.find((t) => t.id === id);
}

export function listCenters() {
  return centers;
}

export function enroll(
  userId: string,
  sessionId: string,
): { ok: boolean; enrollment?: Enrollment; reason?: string } {
  const session = getTraining(sessionId);
  if (!session) return { ok: false, reason: "not_found" };
  const existing = db.enrollments.find(
    (e) => e.userId === userId && e.sessionId === sessionId,
  );
  if (existing) return { ok: true, enrollment: existing };
  if (session.seatsTaken >= session.capacity)
    return { ok: false, reason: "full" };

  session.seatsTaken += 1;
  const enrollment: Enrollment = {
    id: randomUUID(),
    userId,
    sessionId,
    status: "enrolled",
    progressPct: 0,
    certificateId: undefined,
  };
  db.enrollments.push(enrollment);
  return { ok: true, enrollment };
}

export function listEnrollments(userId: string): Enrollment[] {
  return db.enrollments.filter((e) => e.userId === userId);
}

/* ---------------- Services ---------------- */

export function listServices(query?: string, category?: string): Service[] {
  const q = query?.trim().toLowerCase();
  return services.filter((s) => {
    if (category && s.category !== category) return false;
    if (!q) return true;
    const hay = [
      s.name.en,
      s.description.en,
      s.category,
      ...s.tags,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function serviceCategories(): string[] {
  return Array.from(new Set(services.map((s) => s.category)));
}

export function checkEligibility(
  serviceId: string,
  user: User,
): { eligible: boolean; messages: string[] } {
  const service = getService(serviceId);
  if (!service) return { eligible: false, messages: ["Service not found."] };
  const messages: string[] = [];
  let eligible = true;
  for (const rule of service.eligibilityRules) {
    if (rule.field === "emirate") {
      const ok =
        rule.op === "in"
          ? (rule.value as string[]).includes(user.emirate)
          : user.emirate === rule.value;
      if (!ok) {
        eligible = false;
        messages.push(rule.message.en);
      }
    } else if (rule.field === "hasConsent") {
      const ok = hasConsent(user.id, rule.value as ConsentScope);
      if (!ok) {
        eligible = false;
        messages.push(rule.message.en);
      }
    }
  }
  return { eligible, messages };
}

/* ---------------- Appointments ---------------- */

const PROVIDER_NAMES: Record<string, string> = {
  doctor: "Dr. Yusuf Al Hashimi",
  nurse: "Nurse Maria Santos",
  counselor: "Counselor Grace Mendoza",
  support_agent: "Agent Fatima Noor",
};

export function createAppointment(
  userId: string,
  serviceId: string,
  startsAt: string,
): { ok: boolean; appointment?: Appointment; reason?: string } {
  const service = getService(serviceId);
  if (!service) return { ok: false, reason: "not_found" };
  const appointment: Appointment = {
    id: randomUUID(),
    userId,
    serviceId,
    providerName: PROVIDER_NAMES[service.providerType] ?? "Care provider",
    startsAt,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  db.appointments.push(appointment);
  return { ok: true, appointment };
}

export function listAppointments(userId: string): Appointment[] {
  return db.appointments.filter((a) => a.userId === userId);
}

/* ---------------- Support tickets ---------------- */

export function createTicket(input: {
  userId: string;
  origin: SupportTicket["origin"];
  category: string;
  priority?: TicketPriority;
  contextSnapshot?: { role: "user" | "assistant"; text: string }[];
}): SupportTicket {
  const priority = input.priority ?? "normal";
  const slaHours: Record<TicketPriority, number> = {
    urgent: 1,
    high: 4,
    normal: 24,
    low: 72,
  };
  const ticket: SupportTicket = {
    id: randomUUID(),
    userId: input.userId,
    origin: input.origin,
    category: input.category,
    priority,
    status: "open",
    // Honor consent: only persist conversation context if AI processing is allowed.
    contextSnapshot: hasConsent(input.userId, "ai_processing")
      ? input.contextSnapshot
      : undefined,
    sla: {
      respondBy: new Date(
        Date.now() + slaHours[priority] * 3600_000,
      ).toISOString(),
    },
    createdAt: new Date().toISOString(),
  };
  db.tickets.push(ticket);
  return ticket;
}

export function listTickets(userId: string): SupportTicket[] {
  return db.tickets
    .filter((t) => t.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
