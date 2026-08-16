"use client";
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import Footer from "@/components/sections/Footer";
import {
  CONSENT_LABEL,
  DECLARATION,
  EMPTY_DECLARATION,
  PROJECT_TYPES,
  REQUIRED_ORDER,
  validateDeclaration,
  type DeclarationInput,
  type FieldErrors,
} from "@/lib/startProject";

// Cursor is client-only (uses mouse events) — body sets `cursor: none`, so the
// custom cursor has to render here too.
const Cursor = dynamic(() => import("@/components/ui/Cursor"), { ssr: false });

type Status = "idle" | "submitting" | "error";

/* ---------- Field primitives ---------- */

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[10px] tracking-[0.14em] uppercase mb-2.5"
      style={{ color: "var(--dim2)" }}
    >
      {children}
      {required && (
        <>
          <span aria-hidden="true" style={{ color: "var(--gold)" }}>
            {" "}
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      )}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="mt-2 text-[11px] tracking-[0.02em]"
      style={{ color: "#e07070" }}
    >
      {message}
    </p>
  );
}

function Row({ wide, children }: { wide?: boolean; children: React.ReactNode }) {
  return <div className={wide ? "md:col-span-2" : undefined}>{children}</div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[10px] tracking-[0.18em] uppercase mb-8"
      style={{ color: "var(--dim2)" }}
    >
      {children}
    </h2>
  );
}

/* ---------- Page ---------- */

export default function StartProjectForm() {
  const [form, setForm] = useState<DeclarationInput>(EMPTY_DECLARATION);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState("");
  const [sent, setSent] = useState(false);

  const set = <K extends keyof DeclarationInput>(key: K, value: DeclarationInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    // Clear a field's error as soon as it's touched again
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  // Wires a text control to its state, error and accessible description
  const field = (key: keyof Omit<DeclarationInput, "consent">) => ({
    id: `sp-${key}`,
    name: key,
    className: "sp-field",
    value: form[key],
    disabled: status === "submitting",
    "aria-invalid": errors[key] ? (true as const) : undefined,
    "aria-describedby": errors[key] ? `sp-${key}-error` : undefined,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => set(key, e.target.value),
  });

  function focusFirstInvalid(found: FieldErrors) {
    const first = REQUIRED_ORDER.find((k) => found[k]);
    if (first) document.getElementById(`sp-${first}`)?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    setSubmitError("");

    // Same validator the server runs — the server decides, this is just fast feedback
    const result = validateDeclaration(form);
    if (!result.ok) {
      setErrors(result.errors);
      focusFirstInvalid(result.errors);
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/start-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.value),
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string; errors?: FieldErrors }
        | null;

      if (!response.ok) {
        if (payload?.errors) {
          setErrors(payload.errors);
          focusFirstInvalid(payload.errors);
        }
        setSubmitError(payload?.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("idle");
      setSent(true);
      window.scrollTo({ top: 0 });
    } catch {
      setSubmitError(
        "We couldn't reach the server. Check your connection and try again.",
      );
      setStatus("error");
    }
  }

  const header = (
    <header className="mx-auto w-full max-w-[760px] px-5 md:px-12 py-6 md:py-8">
      <Link
        href="/"
        aria-label="Uthistan — back to portfolio"
        className="text-sm font-semibold tracking-[-0.025em]"
        style={{ color: "var(--ink)" }}
      >
        Uthistan<span style={{ color: "var(--gold)" }}>.</span>
      </Link>
    </header>
  );

  if (sent) {
    return (
      <>
        <Cursor />
        {header}
        <main className="mx-auto w-full max-w-[760px] px-5 md:px-12 py-20 md:py-32">
          <div
            className="text-[10px] tracking-[0.18em] uppercase mb-8"
            style={{ color: "var(--dim2)" }}
          >
            Declaration received
          </div>
          <h1
            tabIndex={-1}
            ref={(el) => {
              el?.focus();
            }}
            className="font-medium leading-[1.05] mb-6 outline-none"
            style={{ fontSize: "clamp(2rem,5vw,3.4rem)", letterSpacing: "-0.04em" }}
          >
            Declaration submitted{" "}
            <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--gold)" }}>
              successfully.
            </em>
          </h1>
          <p
            className="text-[14px] leading-[1.9] max-w-[56ch] mb-12"
            style={{ color: "var(--dim)" }}
          >
            Your project declaration has been received. I&apos;ll review it and get back to
            you with the next steps.
          </p>
          <Link
            href="/"
            className="inline-block text-[11px] tracking-[0.08em] uppercase px-7 py-3.5 rounded-full border transition-all hover:border-(--gold) hover:text-(--ink) hover:shadow-[0_0_18px_rgba(201,185,155,0.35)]"
            style={{ border: "1px solid var(--b2)", color: "var(--dim)" }}
          >
            Back to portfolio
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const submitting = status === "submitting";

  return (
    <>
      <Cursor />
      {header}

      <main className="mx-auto w-full max-w-[760px] px-5 md:px-12 pb-20 md:pb-28">
        {/* Intro */}
        <div className="pt-6 md:pt-12 pb-12 md:pb-16">
          <div
            className="text-[10px] tracking-[0.18em] uppercase mb-8"
            style={{ color: "var(--dim2)" }}
          >
            Client onboarding
          </div>
          <h1
            className="font-medium leading-[1.05] mb-6"
            style={{ fontSize: "clamp(2rem,5vw,3.4rem)", letterSpacing: "-0.04em" }}
          >
            Project
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--gold)" }}>
              declaration.
            </em>
          </h1>
          <p className="text-[14px] leading-[1.9] max-w-[56ch]" style={{ color: "var(--dim)" }}>
            A short confirmation before development begins — your details, the project, and
            an acknowledgement of how we&apos;ll work together.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Details */}
          <div className="py-12 md:py-16" style={{ borderTop: "1px solid var(--border)" }}>
            <SectionLabel>Your details</SectionLabel>

            <div className="grid gap-x-6 gap-y-8 md:grid-cols-2">
              <Row>
                <Label htmlFor="sp-fullName" required>
                  Full name
                </Label>
                <input {...field("fullName")} type="text" autoComplete="name" placeholder="Jane Doe" />
                <FieldError id="sp-fullName-error" message={errors.fullName} />
              </Row>

              <Row>
                <Label htmlFor="sp-company" required>
                  Company / business name
                </Label>
                <input
                  {...field("company")}
                  type="text"
                  autoComplete="organization"
                  placeholder="Acme Studio"
                />
                <FieldError id="sp-company-error" message={errors.company} />
              </Row>

              <Row>
                <Label htmlFor="sp-email" required>
                  Email
                </Label>
                <input {...field("email")} type="email" autoComplete="email" placeholder="jane@acme.com" />
                <FieldError id="sp-email-error" message={errors.email} />
              </Row>

              <Row>
                <Label htmlFor="sp-phone">Phone / WhatsApp</Label>
                <input {...field("phone")} type="tel" autoComplete="tel" placeholder="+91 98765 43210" />
              </Row>

              <Row>
                <Label htmlFor="sp-projectName" required>
                  Project name
                </Label>
                <input {...field("projectName")} type="text" placeholder="Acme storefront" />
                <FieldError id="sp-projectName-error" message={errors.projectName} />
              </Row>

              <Row>
                <Label htmlFor="sp-projectType" required>
                  Project type
                </Label>
                <div className="relative">
                  <select
                    {...field("projectType")}
                    style={{ color: form.projectType ? "var(--ink)" : "var(--dim2)" }}
                  >
                    <option value="">Select a type…</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px]"
                    style={{ color: "var(--dim)" }}
                  >
                    ▼
                  </span>
                </div>
                <FieldError id="sp-projectType-error" message={errors.projectType} />
              </Row>

              <Row wide>
                <Label htmlFor="sp-description" required>
                  Short project description
                </Label>
                <textarea
                  {...field("description")}
                  rows={4}
                  placeholder="A couple of lines on what you need built."
                />
                <FieldError id="sp-description-error" message={errors.description} />
              </Row>
            </div>
          </div>

          {/* Declaration */}
          <div className="py-12 md:py-16" style={{ borderTop: "1px solid var(--border)" }}>
            <SectionLabel>Client declaration</SectionLabel>

            <div className="max-w-[62ch] space-y-6 mb-10">
              {DECLARATION.map((paragraph) => (
                <p key={paragraph} className="text-[14px] leading-[1.9]" style={{ color: "var(--dim)" }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <label
              htmlFor="sp-consent"
              className="flex items-start gap-3.5 text-[13px] leading-[1.8] max-w-[62ch]"
              style={{ color: "var(--ink)" }}
            >
              <input
                id="sp-consent"
                name="consent"
                type="checkbox"
                className="sp-check"
                checked={form.consent}
                disabled={submitting}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? "sp-consent-error" : undefined}
                onChange={(e) => set("consent", e.target.checked)}
              />
              <span>
                {CONSENT_LABEL}
                <span aria-hidden="true" style={{ color: "var(--gold)" }}>
                  {" "}
                  *
                </span>
                <span className="sr-only"> (required)</span>
              </span>
            </label>
            <FieldError id="sp-consent-error" message={errors.consent} />

            {submitError && (
              <p
                role="alert"
                className="mt-8 text-[12px] leading-[1.7] tracking-[0.02em]"
                style={{ color: "#e07070" }}
              >
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="w-full mt-10 py-4 rounded-lg text-[11px] font-semibold tracking-[0.08em] uppercase transition-opacity duration-200 hover:opacity-85 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: "var(--gold)", color: "#070707" }}
            >
              {submitting ? "Sending…" : "Confirm & Start Project ↗"}
            </button>
            <p
              className="mt-4 text-[11px] leading-[1.7] text-center"
              style={{ color: "var(--dim2)" }}
            >
              A copy of your accepted declaration is sent to Uthistan as a PDF.
            </p>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
}
