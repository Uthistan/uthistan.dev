/**
 * Server-only PDF rendering for the client project declaration.
 *
 * Uses only the built-in Helvetica family so nothing has to be fetched at
 * runtime — important for cold starts on Vercel. Never import from a Client
 * Component; the API route is the only consumer.
 */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

import {
  CONSENT_LABEL,
  DECLARATION,
  formatSubmittedAt,
  type DeclarationInput,
} from "./startProject";

const INK = "#1a1816";
const DIM = "#5c5751";
const GOLD = "#9a7c5e";
const RULE = "#ded8d0";

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 54,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: INK,
    lineHeight: 1.45,
  },

  /* Masthead */
  brand: { fontFamily: "Helvetica-Bold", fontSize: 15, letterSpacing: 1.4, color: INK },
  brandDot: { color: GOLD },
  brandSub: { fontSize: 8, letterSpacing: 0.8, color: DIM, marginTop: 3, textTransform: "uppercase" },
  rule: { borderBottomWidth: 1, borderBottomColor: GOLD, marginTop: 10, marginBottom: 20 },

  /* Title block */
  title: { fontFamily: "Helvetica-Bold", fontSize: 15, letterSpacing: -0.2, marginBottom: 5 },
  submitted: { fontSize: 8.5, color: DIM, marginBottom: 22 },

  /* Sections */
  sectionLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.3,
    color: GOLD,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  section: { marginBottom: 17 },
  sectionRule: { borderBottomWidth: 0.5, borderBottomColor: RULE, marginBottom: 10 },

  /* Label / value rows */
  row: { flexDirection: "row", marginBottom: 5 },
  rowLabel: { width: 104, fontSize: 8.5, color: DIM },
  rowValue: { flex: 1, fontSize: 9.5, color: INK },

  /* Declaration paragraphs */
  paragraph: { fontSize: 9.5, color: INK, marginBottom: 8, textAlign: "justify" },

  /* Confirmation */
  confirmBox: {
    borderWidth: 0.5,
    borderColor: RULE,
    borderLeftWidth: 2,
    borderLeftColor: GOLD,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  confirmHeading: { fontFamily: "Helvetica-Bold", fontSize: 10, marginBottom: 6 },
  confirmNote: { fontSize: 8.5, color: DIM, marginBottom: 10 },

  footer: {
    position: "absolute",
    bottom: 26,
    left: 54,
    right: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: RULE,
    paddingTop: 8,
    fontSize: 7.5,
    color: DIM,
  },
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row} wrap={false}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.sectionRule} />
      {children}
    </View>
  );
}

function DeclarationDocument({
  data,
  submittedAt,
}: {
  data: DeclarationInput;
  submittedAt: Date;
}) {
  const stamp = formatSubmittedAt(submittedAt);

  return (
    <Document
      title={`Client Project Declaration — ${data.company}`}
      author="Uthistan"
      subject="Client Project Declaration & Acknowledgement"
    >
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.brand}>
            UTHISTAN<Text style={styles.brandDot}>.</Text>
          </Text>
          <Text style={styles.brandSub}>Full-Stack Engineer · Bengaluru, India</Text>
        </View>
        <View style={styles.rule} />

        <Text style={styles.title}>Client Project Declaration &amp; Acknowledgement</Text>
        <Text style={styles.submitted}>Submitted {stamp}</Text>

        <Section label="Client Details">
          <Row label="Full name" value={data.fullName} />
          <Row label="Company" value={data.company} />
          <Row label="Email" value={data.email} />
          {data.phone ? <Row label="Phone / WhatsApp" value={data.phone} /> : null}
        </Section>

        <Section label="Project Details">
          <Row label="Project name" value={data.projectName} />
          <Row label="Project type" value={data.projectType} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Description</Text>
            <Text style={styles.rowValue}>{data.description}</Text>
          </View>
        </Section>

        <Section label="Declaration">
          {DECLARATION.map((paragraph, i) => (
            <Text key={i} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </Section>

        <View style={styles.confirmBox} wrap={false}>
          <Text style={styles.confirmHeading}>Declaration accepted by client</Text>
          <Text style={styles.confirmNote}>{CONSENT_LABEL}</Text>
          <Row label="Client name" value={data.fullName} />
          <Row label="Client email" value={data.email} />
          <Row label="Accepted on" value={stamp} />
        </View>

        <View style={styles.footer} fixed>
          <Text>Client Project Declaration · {data.company}</Text>
          <Text
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}

/** Renders the declaration to a PDF buffer ready for email attachment. */
export function renderDeclarationPdf(
  data: DeclarationInput,
  submittedAt: Date,
): Promise<Buffer> {
  return renderToBuffer(<DeclarationDocument data={data} submittedAt={submittedAt} />);
}
