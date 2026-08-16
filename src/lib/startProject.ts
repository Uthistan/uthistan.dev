/**
 * Shared contract for the /start-project client declaration.
 *
 * Imported by both the client form and the API route so the field list,
 * declaration text and validation rules can never drift apart. Contains no
 * Node-only code, so it is safe in the client bundle.
 */

export const PROJECT_TYPES = [
  "Website",
  "Web Application",
  "E-commerce",
  "Website Redesign",
  "Other",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const DECLARATION = [
  "I confirm that the information, content, images, logos, documents, and other materials I provide for this project are accurate and that I have the necessary rights or permissions to use them.",
  "I understand that the project will be developed based on the scope and requirements agreed upon with Uthistan. Any requirements or changes outside the agreed scope may affect the project timeline and cost and will be discussed separately.",
  "I understand that timely feedback, approvals, content, and required access from my side are necessary to keep the project on schedule.",
  "I understand that by submitting this declaration and proceeding with the project, I am confirming my commitment to the project. Once the project has been confirmed and work has commenced, I agree not to cancel or withdraw from the project. Any advance or other payments made towards the project are non-refundable, subject to the terms agreed upon before the project begins.",
] as const;

export const CONSENT_LABEL =
  "I have read, understood, and agree to the above declaration.";

export const TIME_ZONE = "Asia/Kolkata";

export type DeclarationInput = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  projectName: string;
  projectType: string;
  description: string;
  consent: boolean;
};

export type FieldErrors = Partial<Record<keyof DeclarationInput, string>>;

export const EMPTY_DECLARATION: DeclarationInput = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  projectName: "",
  projectType: "",
  description: "",
  consent: false,
};

// Validated top-to-bottom so the first error is also the first field on the page
export const REQUIRED_ORDER: (keyof DeclarationInput)[] = [
  "fullName",
  "company",
  "email",
  "projectName",
  "projectType",
  "description",
  "consent",
];

// Caps keep a hostile payload from producing an enormous PDF
const LIMITS = {
  fullName: 120,
  company: 160,
  email: 200,
  phone: 40,
  projectName: 160,
  projectType: 60,
  description: 4000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Coerce unknown input to a trimmed, length-capped, control-char-free string. */
function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  let out = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    // Drop C0/DEL control characters, keeping tab, newline and carriage return
    const isControl = (code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127;
    if (!isControl) out += char;
  }
  return out.trim().slice(0, max);
}

export type ValidationResult =
  | { ok: true; value: DeclarationInput }
  | { ok: false; errors: FieldErrors };

/**
 * Normalises and validates a submission. Accepts `unknown` so the API route can
 * run it directly on a parsed request body without trusting the client.
 */
export function validateDeclaration(raw: unknown): ValidationResult {
  const input = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;

  const value: DeclarationInput = {
    fullName: clean(input.fullName, LIMITS.fullName),
    company: clean(input.company, LIMITS.company),
    email: clean(input.email, LIMITS.email),
    phone: clean(input.phone, LIMITS.phone),
    projectName: clean(input.projectName, LIMITS.projectName),
    projectType: clean(input.projectType, LIMITS.projectType),
    description: clean(input.description, LIMITS.description),
    consent: input.consent === true,
  };

  const errors: FieldErrors = {};
  if (!value.fullName) errors.fullName = "Please enter your full name.";
  if (!value.company) errors.company = "Please enter your company or business name.";
  if (!value.email) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(value.email)) errors.email = "Please enter a valid email address.";
  if (!value.projectName) errors.projectName = "Please enter the project name.";
  if (!value.projectType) errors.projectType = "Please choose a project type.";
  else if (!(PROJECT_TYPES as readonly string[]).includes(value.projectType)) {
    errors.projectType = "Please choose a valid project type.";
  }
  if (!value.description) errors.description = "Please add a short description of the project.";
  if (!value.consent) errors.consent = "Please agree to the declaration before continuing.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value };
}

/** `Client-Declaration-Acme-Studio-2026-08-16.pdf` */
export function declarationFileName(company: string, submittedAt: Date): string {
  const slug =
    company
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .replace(/[\s-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "Client";

  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(submittedAt);

  return `Client-Declaration-${slug}-${day}.pdf`;
}

/** `16 August 2026 · 6:45 pm IST` — always rendered server-side. */
export function formatSubmittedAt(submittedAt: Date): string {
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(submittedAt);

  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(submittedAt);

  return `${date} · ${time} IST`;
}
