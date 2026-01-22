import { resend, emailConfig } from "./resend";
import { render } from "@react-email/components";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { QuestionPublishedEmail } from "@/emails/QuestionPublishedEmail";
import { NewReplyEmail } from "@/emails/NewReplyEmail";

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const html = await render(WelcomeEmail({ name }));

    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to,
      subject: "Welcome to The Dramaturgy!",
      html,
    });

    if (error) {
      console.error("Failed to send welcome email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error };
  }
}

export async function sendQuestionPublishedEmail(
  to: string,
  name: string,
  questionTitle: string,
  questionId: string
) {
  try {
    const questionUrl = `https://thedramaturgy.com/questions/${questionId}`;
    const html = await render(
      QuestionPublishedEmail({ name, questionTitle, questionUrl })
    );

    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to,
      subject: "Your question has been published!",
      html,
    });

    if (error) {
      console.error("Failed to send question published email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send question published email:", error);
    return { success: false, error };
  }
}

export async function sendNewReplyEmail(
  to: string,
  name: string,
  questionTitle: string,
  questionId: string,
  replyAuthor: string,
  replyPreview: string,
  isExpertReply: boolean
) {
  try {
    const questionUrl = `https://thedramaturgy.com/questions/${questionId}`;
    const html = await render(
      NewReplyEmail({
        name,
        questionTitle,
        questionUrl,
        replyAuthor,
        replyPreview:
          replyPreview.length > 200
            ? replyPreview.substring(0, 200) + "..."
            : replyPreview,
        isExpertReply,
      })
    );

    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to,
      subject: isExpertReply
        ? `Expert perspective on: ${questionTitle}`
        : `New reply to: ${questionTitle}`,
      html,
    });

    if (error) {
      console.error("Failed to send new reply email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send new reply email:", error);
    return { success: false, error };
  }
}

export async function sendBatchEmails(
  emails: Array<{
    to: string;
    subject: string;
    html: string;
  }>
) {
  try {
    const { data, error } = await resend.batch.send(
      emails.map((email) => ({
        from: emailConfig.from,
        ...email,
      }))
    );

    if (error) {
      console.error("Failed to send batch emails:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send batch emails:", error);
    return { success: false, error };
  }
}
