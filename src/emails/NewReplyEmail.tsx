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

interface NewReplyEmailProps {
  name: string;
  questionTitle: string;
  replyAuthor: string;
  replyPreview: string;
  questionUrl: string;
  isExpertReply: boolean;
}

export function NewReplyEmail({
  name,
  questionTitle,
  replyAuthor,
  replyPreview,
  questionUrl,
  isExpertReply,
}: NewReplyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {isExpertReply ? "Expert reply" : "New reply"} to your question on The
        Dramaturgy
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            {isExpertReply ? "Expert Perspective Added" : "New Reply"} to Your
            Question
          </Heading>
          <Section style={section}>
            <Text style={text}>Hi {name || "there"},</Text>
            <Text style={text}>
              {isExpertReply
                ? `An expert has shared their perspective on your question:`
                : `${replyAuthor} has replied to your question:`}
            </Text>
            <Text style={questionBox}>&quot;{questionTitle}&quot;</Text>
            {isExpertReply && (
              <Text style={expertBadge}>Expert Perspective</Text>
            )}
            <Text style={replyBox}>{replyPreview}</Text>
            <Button style={button} href={questionUrl}>
              View Full Reply
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Continue the conversation by replying or voting on helpful responses.
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
  padding: "12px 16px",
  margin: "16px 0",
  fontSize: "15px",
  fontStyle: "italic",
  color: "#0a0a0a",
  borderRadius: "0 4px 4px 0",
};

const expertBadge = {
  display: "inline-block",
  backgroundColor: "#0a0a0a",
  color: "#ffffff",
  padding: "4px 12px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "8px 0 16px",
};

const replyBox = {
  backgroundColor: "#ffffff",
  border: "1px solid #e6ebf1",
  padding: "16px",
  margin: "16px 0",
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#525f7f",
  borderRadius: "4px",
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
};

export default NewReplyEmail;
