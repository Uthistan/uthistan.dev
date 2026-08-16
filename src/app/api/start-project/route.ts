import { NextResponse } from "next/server";
import { Resend } from "resend";

import { renderDeclarationPdf } from "@/lib/declarationPdf";
import {
  declarationFileName,
  formatSubmittedAt,
  validateDeclaration,
  type DeclarationInput,
} from "@/lib/startProject";

// PDF rendering needs the Node runtime; POST responses are never cached.
export const runtime = "nodejs";
export const maxDuration = 30;

const DEFAULT_TO_EMAIL = "uthistanravi@gmail.com";
// Sends from the verified uthistan.com domain in Resend.
const DEFAULT_FROM_EMAIL = "Uthistan <declarations@uthistan.com>";

const MAX_BODY_BYTES = 32 * 1024;

/**
 * Best-effort throttle so a public endpoint can't be used to spam the inbox.
 * Per-instance only — serverless runs several instances, so treat this as a
 * speed bump rather than a guarantee.
 */
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 500) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(k);
    }
  }
  return recent.length > RATE_LIMIT.max;
}

/**
 * Stage logging for production debugging.
 *
 * Deliberately records only non-sensitive metadata — never API keys, client
 * names, emails, phone numbers or project text. Values are booleans, counts,
 * durations and byte sizes only.
 */
function log(requestId: string, stage: string, detail?: Record<string, unknown>) {
  const suffix = detail
    ? " " + Object.entries(detail).map(([k, v]) => `${k}=${v}`).join(" ")
    : "";
  console.log(`[start-project] ${requestId} ${stage}${suffix}`);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const FONT_STACK =
  "-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif";

/** Internal notification for my inbox — full submission detail. */
function buildEmail(data: DeclarationInput, stamp: string) {
  const rows: [string, string][] = [
    ["Client", data.fullName],
    ["Company", data.company],
    ["Project", data.projectName],
    ["Project type", data.projectType],
    ["Email", data.email],
    ...(data.phone ? ([["Phone", data.phone]] as [string, string][]) : []),
    ["Submitted", stamp],
  ];

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nThe accepted declaration is attached as a PDF.`;

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:#1a1816">
  <p style="margin:0 0 16px">A new client project declaration has been submitted.</p>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 20px 4px 0;color:#5c5751;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
      )
      .join("")}
  </table>
  <p style="margin:0 0 8px"><strong>Project description</strong></p>
  <p style="margin:0 0 20px;white-space:pre-wrap">${escapeHtml(data.description)}</p>
  <p style="margin:0;color:#5c5751">The accepted declaration is attached as a PDF.</p>
</div>`;

  return { text, html };
}

/**
 * The client's confirmation receipt.
 *
 * Deliberately separate from the internal notification above: it is addressed
 * to the client, carries no admin framing, and exposes nothing about how the
 * submission is processed on my side.
 */
function buildClientEmail(data: DeclarationInput, stamp: string) {
  const rows: [string, string][] = [
    ["Project", data.projectName],
    ["Project Type", data.projectType],
    ["Submitted", stamp],
  ];

  const text = `Hi ${data.fullName},

Thank you for submitting your project declaration to Uthistan.

Your declaration for ${data.projectName} has been successfully received and recorded.

${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}

A copy of the declaration you submitted and accepted is attached to this email for your records.

Please keep this email and the attached PDF for your reference.

Regards,
Uthistan`;

  const html = `<div style="font-family:${FONT_STACK};font-size:14px;line-height:1.7;color:#1a1816">
  <p style="margin:0 0 16px">Hi ${escapeHtml(data.fullName)},</p>
  <p style="margin:0 0 16px">Thank you for submitting your project declaration to Uthistan.</p>
  <p style="margin:0 0 20px">Your declaration for <strong>${escapeHtml(data.projectName)}</strong> has been successfully received and recorded.</p>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 20px 4px 0;color:#5c5751;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
      )
      .join("")}
  </table>
  <p style="margin:0 0 16px">A copy of the declaration you submitted and accepted is attached to this email for your records.</p>
  <p style="margin:0 0 20px">Please keep this email and the attached PDF for your reference.</p>
  <p style="margin:0">Regards,<br />Uthistan</p>
</div>`;

  return { text, html };
}

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).slice(2, 8);
  const startedAt = Date.now();
  log(requestId, "request received");

  // --- Throttle -----------------------------------------------------------
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    log(requestId, "rejected: rate limited");
    return NextResponse.json(
      { ok: false, message: "Too many submissions. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  // --- Parse --------------------------------------------------------------
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    log(requestId, "rejected: body too large", { bytes: raw.length });
    return NextResponse.json(
      { ok: false, message: "That submission is too large." },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    log(requestId, "rejected: malformed JSON");
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // --- Validate (never trust the client) ----------------------------------
  const result = validateDeclaration(body);
  if (!result.ok) {
    log(requestId, "rejected: validation failed", {
      fields: Object.keys(result.errors).length,
    });
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", errors: result.errors },
      { status: 400 },
    );
  }
  const data = result.value;
  log(requestId, "payload validated");

  // --- Config -------------------------------------------------------------
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      `[start-project] ${requestId} FATAL: RESEND_API_KEY is not set in this environment. ` +
        `Set it in Vercel > Settings > Environment Variables and redeploy.`,
    );
    return NextResponse.json(
      { ok: false, message: "Submissions aren't configured yet. Please email me directly." },
      { status: 500 },
    );
  }

  // Read at request time so a Vercel env change takes effect on the next
  // invocation rather than being frozen into module scope at cold start.
  const toEmail = process.env.DECLARATION_TO_EMAIL ?? DEFAULT_TO_EMAIL;
  const fromEmail = process.env.DECLARATION_FROM_EMAIL ?? DEFAULT_FROM_EMAIL;

  log(requestId, "config ok", {
    hasApiKey: true,
    hasToOverride: Boolean(process.env.DECLARATION_TO_EMAIL),
    hasFromOverride: Boolean(process.env.DECLARATION_FROM_EMAIL),
  });

  const submittedAt = new Date();
  const stamp = formatSubmittedAt(submittedAt);

  // --- PDF ----------------------------------------------------------------
  let pdf: Buffer;
  const pdfStartedAt = Date.now();
  log(requestId, "pdf generation started");
  try {
    pdf = await renderDeclarationPdf(data, submittedAt);
  } catch (error) {
    console.error(`[start-project] ${requestId} PDF generation failed`, error);
    return NextResponse.json(
      { ok: false, message: "We couldn't generate your declaration PDF. Please try again." },
      { status: 500 },
    );
  }

  log(requestId, "pdf generation completed", {
    bytes: pdf.length,
    ms: Date.now() - pdfStartedAt,
  });

  // --- Email --------------------------------------------------------------
  // The PDF is rendered once above; both recipients get this exact same buffer
  // as the same attachment, so the two copies are byte-for-byte identical.
  const resend = new Resend(apiKey);
  const attachments = [
    {
      filename: declarationFileName(data.company, submittedAt),
      content: pdf,
    },
  ];

  const emailStartedAt = Date.now();
  log(requestId, "resend call started");
  try {
    const { text, html } = buildEmail(data, stamp);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: `New Client Project Declaration — ${data.company}`,
      text,
      html,
      attachments,
    });

    if (error) {
      console.error(`[start-project] ${requestId} Resend rejected the message`, error);
      return NextResponse.json(
        { ok: false, message: "We couldn't send your declaration. Please try again." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error(`[start-project] ${requestId} Email sending failed`, error);
    return NextResponse.json(
      { ok: false, message: "We couldn't send your declaration. Please try again." },
      { status: 502 },
    );
  }

  log(requestId, "resend response received", { ms: Date.now() - emailStartedAt });

  // --- Client confirmation ------------------------------------------------
  // Sent after mine, not in parallel, so a Resend rate limit can never cost me
  // the submission. Failures here are logged rather than returned: the
  // declaration has already reached my inbox, so the submission did succeed and
  // asking the client to send it again would only duplicate it.
  const clientEmailStartedAt = Date.now();
  log(requestId, "client confirmation started");
  let clientEmailSent = true;
  try {
    const { text, html } = buildClientEmail(data, stamp);
    // No replyTo — replies go to the verified sending address rather than
    // exposing the inbox that receives the internal notification.
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: `Your Project Declaration Has Been Received — ${data.company}`,
      text,
      html,
      attachments,
    });

    if (error) {
      clientEmailSent = false;
      console.error(
        `[start-project] ${requestId} Resend rejected the client confirmation`,
        error,
      );
    }
  } catch (error) {
    clientEmailSent = false;
    console.error(`[start-project] ${requestId} Client confirmation failed`, error);
  }

  log(requestId, "client confirmation finished", {
    sent: clientEmailSent,
    ms: Date.now() - clientEmailStartedAt,
  });
  log(requestId, "completed", { totalMs: Date.now() - startedAt });

  return NextResponse.json({ ok: true });
}
