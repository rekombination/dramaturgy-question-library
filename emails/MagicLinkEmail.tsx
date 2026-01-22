import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
  url: string;
  host: string;
}

export function MagicLinkEmail({ url, host }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sign in to The Dramaturgy</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>The Dramaturgy</Heading>
          <Section style={section}>
            <Text style={text}>
              Click the button below to sign in to your account at {host}
            </Text>
            <Button style={button} href={url}>
              Sign in to The Dramaturgy
            </Button>
            <Text style={text}>
              If you didn&apos;t request this email, you can safely ignore it.
            </Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            This link will expire in 24 hours. If the button doesn&apos;t work,
            copy and paste this URL into your browser:{" "}
            <Link href={url} style={link}>
              {url}
            </Link>
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
  textAlign: "center" as const,
};

const text = {
  margin: "0 0 20px",
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#525f7f",
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
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

const link = {
  color: "#556cd6",
};

export default MagicLinkEmail;
