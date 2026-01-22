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

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to The Dramaturgy - Your dramaturgical community awaits</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to The Dramaturgy</Heading>
          <Section style={section}>
            <Text style={text}>Hi {name || "there"},</Text>
            <Text style={text}>
              Thank you for joining The Dramaturgy! We&apos;re excited to have you as
              part of our community of theatre practitioners, dramaturgs, and
              performing arts enthusiasts.
            </Text>
            <Text style={text}>Here&apos;s what you can do:</Text>
            <ul style={list}>
              <li style={listItem}>
                <strong>Explore questions</strong> - Browse through our collection
                of dramaturgical questions and insights
              </li>
              <li style={listItem}>
                <strong>Ask your own questions</strong> - Share your challenges
                and get perspectives from the community
              </li>
              <li style={listItem}>
                <strong>Discover toolkits</strong> - Find curated collections of
                questions for specific topics
              </li>
              <li style={listItem}>
                <strong>Build your library</strong> - Bookmark questions to create
                your personal resource collection
              </li>
            </ul>
            <Button style={button} href="https://thedramaturgy.com/explore">
              Start Exploring
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Have questions? Check out our{" "}
            <Link href="https://thedramaturgy.com/guidelines" style={link}>
              community guidelines
            </Link>{" "}
            or reply to this email.
          </Text>
          <Text style={footer}>
            The Dramaturgy Team
            <br />
            <Link href="https://thedramaturgy.com" style={link}>
              thedramaturgy.com
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
  fontSize: "28px",
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

const list = {
  margin: "16px 0 24px",
  padding: "0 0 0 24px",
};

const listItem = {
  margin: "8px 0",
  fontSize: "15px",
  lineHeight: "1.6",
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
  maxWidth: "200px",
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
  margin: "8px 0",
};

const link = {
  color: "#556cd6",
};

export default WelcomeEmail;
