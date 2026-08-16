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

const TO_EMAIL = process.env.DECLARATION_TO_EMAIL ?? "uthistanravi@gmail.com";
// Resend's shared sender works without a verified domain and can deliver to the
// account owner — override once a custom domain is verified.
const FROM_EMAIL = process.env.DECLARATION_FROM_EMAIL ?? "Uthistan <onboarding@resend.dev>";

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

export async function POST(request: Request) {
  // --- Throttle -----------------------------------------------------------
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many submissions. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  // --- Parse --------------------------------------------------------------
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, message: "That submission is too large." },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // --- Validate (never trust the client) ----------------------------------
  const result = validateDeclaration(body);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", errors: result.errors },
      { status: 400 },
    );
  }
  const data = result.value;

  // --- Config -------------------------------------------------------------
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[start-project] RESEND_API_KEY is not set");
    return NextResponse.json(
      { ok: false, message: "Submissions aren't configured yet. Please email me directly." },
      { status: 500 },
    );
  }

  const submittedAt = new Date();
  const stamp = formatSubmittedAt(submittedAt);

  // --- PDF ----------------------------------------------------------------
  let pdf: Buffer;
  try {
    pdf = await renderDeclarationPdf(data, submittedAt);
  } catch (error) {
    console.error("[start-project] PDF generation failed", error);
    return NextResponse.json(
      { ok: false, message: "We couldn't generate your declaration PDF. Please try again." },
      { status: 500 },
    );
  }

  // --- Email --------------------------------------------------------------
  try {
    const { text, html } = buildEmail(data, stamp);
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: data.email,
      subject: `New Client Project Declaration — ${data.company}`,
      text,
      html,
      attachments: [
        {
          filename: declarationFileName(data.company, submittedAt),
          content: pdf,
        },
      ],
    });

    if (error) {
      console.error("[start-project] Resend rejected the message", error);
      return NextResponse.json(
        { ok: false, message: "We couldn't send your declaration. Please try again." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[start-project] Email sending failed", error);
    return NextResponse.json(
      { ok: false, message: "We couldn't send your declaration. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
