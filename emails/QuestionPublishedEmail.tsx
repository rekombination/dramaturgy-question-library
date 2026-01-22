import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface QuestionPublishedEmailProps {
  name: string;
  questionTitle: string;
  questionUrl: string;
}

export function QuestionPublishedEmail({
  name,
  questionTitle,
  questionUrl,
}: QuestionPublishedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your question has been published on The Dramaturgy</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Your Question is Live!</Heading>
          <Section style={section}>
            <Text style={text}>Hi {name || "there"},</Text>
            <Text style={text}>
              Great news! Your question has been reviewed and is now published
              on The Dramaturgy:
            </Text>
            <Text style={questionBox}>&quot;{questionTitle}&quot;</Text>
            <Text style={text}>
              The community can now view and respond to your question. You&apos;ll
              receive notifications when someone replies.
            </Text>
            <Button style={button} href={questionUrl}>
              View Your Question
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Tip: Engage with replies to keep the conversation going and help
            others learn from your experience.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  marginBottom: "64px",
  borderRadius: "8px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "600",
  color: "#0a0a0a",
  padding: "17px 0 0",
  textAlign: "center" as const,
};

const section = {
  padding: "24px",
};

const text = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#525f7f",
};

const questionBox = {
  backgroundColor: "#f8f9fa",
  borderLeft: "4px solid #0a0a0a",
  padding: "16px 20px",
  margin: "20px 0",
  fontSize: "16px",
  fontStyle: "italic",
  color: "#0a0a0a",
  borderRadius: "0 4px 4px 0",
};

const button = {
  backgroundColor: "#0a0a0a",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "24px auto",
  maxWidth: "220px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0 20px",
};

const footer = {
  color: "#8898aa",
  fontSize: "13px",
  lineHeight: "20px",
  textAlign: "center" as const,
};

export default QuestionPublishedEmail;
