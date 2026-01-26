import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Debug logging
console.log("[Email] Resend initialized:", !!resend);
console.log("[Email] RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);

const FROM_EMAIL = "The Dramaturgy <noreply@thedramaturgy.com>";
const SITE_URL = process.env.NEXTAUTH_URL || "https://thedramaturgy.com";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!resend) {
    console.warn(`Email sending skipped (no API key): ${subject}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    // Don't throw - we don't want email failures to break the app
  }
}

/**
 * Email template wrapper with consistent styling
 */
function emailTemplate(content: string, options?: { showMemberFooter?: boolean }): string {
  const showMemberFooter = options?.showMemberFooter ?? true;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #FFFEF8;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 3px solid #0A0A0A;
    }
    .header {
      background-color: #ffffff;
      padding: 32px 24px;
      text-align: center;
      border-bottom: 3px solid #0A0A0A;
    }
    .logo {
      max-width: 160px;
      height: auto;
    }
    .content {
      padding: 32px 24px;
      background-color: #ffffff;
    }
    .button {
      display: inline-block;
      background-color: #C8372D;
      color: #ffffff !important;
      text-decoration: none !important;
      padding: 14px 28px;
      font-weight: 700;
      margin: 20px 0;
      border: 3px solid #0A0A0A;
      font-size: 16px;
    }
    .button:hover {
      background-color: #B12F26;
      color: #ffffff !important;
    }
    .button:visited {
      color: #ffffff !important;
    }
    .footer {
      padding: 24px;
      text-align: center;
      font-size: 13px;
      color: #666;
      border-top: 3px solid #0A0A0A;
      background-color: #FFFEF8;
    }
    .footer a {
      color: #C8372D;
      text-decoration: none;
      font-weight: 600;
    }
    h2 {
      margin: 0 0 16px 0;
      font-size: 24px;
      font-weight: 900;
      color: #0A0A0A;
    }
    h3 {
      margin: 16px 0 8px 0;
      font-size: 18px;
      font-weight: 700;
      color: #0A0A0A;
    }
    p {
      margin: 0 0 16px 0;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${SITE_URL}/logo.png" alt="The Dramaturgy" class="logo" width="160" height="53" />
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      ${showMemberFooter ? `
        <p>You're receiving this because you're a member of The Dramaturgy community.</p>
        <p><a href="${SITE_URL}/me/settings">Manage your notification preferences</a></p>
      ` : `
        <p>&copy; ${new Date().getFullYear()} The Dramaturgy</p>
        <p><a href="${SITE_URL}">Visit our website</a></p>
      `}
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send notification when a new reply is posted to a question
 */
export async function sendNewReplyNotification({
  questionAuthorEmail,
  questionAuthorName,
  questionTitle,
  questionId,
  replyAuthorName,
}: {
  questionAuthorEmail: string;
  questionAuthorName: string;
  questionTitle: string;
  questionId: string;
  replyAuthorName: string;
}) {
  const content = `
    <h2>New Answer to Your Question</h2>
    <p>Hi ${questionAuthorName},</p>
    <p><strong>${replyAuthorName}</strong> has answered your question:</p>
    <h3 style="margin: 16px 0;">${questionTitle}</h3>
    <p>
      <a href="${SITE_URL}/questions/${questionId}" class="button">
        View Answer
      </a>
    </p>
  `;

  await sendEmail({
    to: questionAuthorEmail,
    subject: `New answer to: ${questionTitle}`,
    html: emailTemplate(content),
  });
}

/**
 * Send notification to all experts when a new expert request is created
 */
export async function sendExpertRequestNotification({
  expertEmails,
  questionTitle,
  questionId,
  questionAuthorName,
}: {
  expertEmails: string[];
  questionTitle: string;
  questionId: string;
  questionAuthorName: string;
}) {
  const content = `
    <h2>New Expert Request</h2>
    <p>A community member needs your expertise!</p>
    <p><strong>${questionAuthorName}</strong> has requested expert help with:</p>
    <h3 style="margin: 16px 0;">${questionTitle}</h3>
    <p>
      <a href="${SITE_URL}/questions/${questionId}" class="button">
        View Question & Claim
      </a>
    </p>
    <p style="color: #666; font-size: 14px;">
      Be the first to claim this question and help the community!
    </p>
  `;

  // Send to all experts
  for (const email of expertEmails) {
    await sendEmail({
      to: email,
      subject: `New Expert Request: ${questionTitle}`,
      html: emailTemplate(content),
    });
  }
}

/**
 * Send notification when an expert claims a question
 */
export async function sendExpertClaimNotification({
  questionAuthorEmail,
  questionAuthorName,
  questionTitle,
  questionId,
  expertName,
}: {
  questionAuthorEmail: string;
  questionAuthorName: string;
  questionTitle: string;
  questionId: string;
  expertName: string;
}) {
  const content = `
    <h2>An Expert is Working on Your Question!</h2>
    <p>Hi ${questionAuthorName},</p>
    <p>Great news! <strong>${expertName}</strong> has claimed your question and will provide an expert answer.</p>
    <h3 style="margin: 16px 0;">${questionTitle}</h3>
    <p>You'll receive another notification when they post their answer.</p>
    <p>
      <a href="${SITE_URL}/questions/${questionId}" class="button">
        View Question
      </a>
    </p>
  `;

  await sendEmail({
    to: questionAuthorEmail,
    subject: `Expert ${expertName} is answering your question`,
    html: emailTemplate(content),
  });
}

/**
 * Send notification when a question is marked as solved
 */
export async function sendQuestionSolvedNotification({
  replyAuthorEmail,
  replyAuthorName,
  questionTitle,
  questionId,
}: {
  replyAuthorEmail: string;
  replyAuthorName: string;
  questionTitle: string;
  questionId: string;
}) {
  const content = `
    <h2>Your Answer Was Marked as Solution!</h2>
    <p>Hi ${replyAuthorName},</p>
    <p>Congratulations! Your answer has been marked as the solution to:</p>
    <h3 style="margin: 16px 0;">${questionTitle}</h3>
    <p>Thank you for helping the community!</p>
    <p>
      <a href="${SITE_URL}/questions/${questionId}" class="button">
        View Question
      </a>
    </p>
  `;

  await sendEmail({
    to: replyAuthorEmail,
    subject: `Your answer was marked as solution!`,
    html: emailTemplate(content),
  });
}

/**
 * Send contact form submission to admin and confirmation to sender
 */
export async function sendContactEmail({
  name,
  email,
  messageType,
  subject,
  message,
}: {
  name: string;
  email: string;
  messageType: "inquiry" | "feedback";
  subject: string;
  message: string;
}) {
  const adminEmail = "mm@rekombination.de";
  const typeLabel = messageType === "feedback" ? "Feedback" : "Inquiry";

  // Send to admin
  const adminContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Type:</strong> <span style="background-color: ${messageType === "feedback" ? "#C8372D" : "#0A0A0A"}; color: #ffffff; padding: 4px 8px; font-weight: 700; font-size: 12px;">${typeLabel.toUpperCase()}</span></p>
    <p><strong>From:</strong> ${name} (${email})</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <hr style="border: 0; border-top: 2px solid #E5E5E0; margin: 24px 0;" />
    <h3>Message:</h3>
    <p style="white-space: pre-wrap;">${message}</p>
    <hr style="border: 0; border-top: 2px solid #E5E5E0; margin: 24px 0;" />
    <p style="color: #666; font-size: 14px;">
      Reply to: <a href="mailto:${email}" style="color: #C8372D;">${email}</a>
    </p>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `[${typeLabel.toUpperCase()}] ${subject}`,
    html: emailTemplate(adminContent, { showMemberFooter: false }),
  });

  // Send confirmation to sender
  const confirmationContent = `
    <h2>Thank You for Contacting Us</h2>
    <p>Hi ${name},</p>
    <p>We've received your message and will get back to you as soon as possible.</p>
    <h3>Your Message:</h3>
    <p><strong>Subject:</strong> ${subject}</p>
    <p style="white-space: pre-wrap; background-color: #F5F5F0; padding: 16px; border-left: 4px solid #C8372D;">${message}</p>
    <p style="margin-top: 24px;">If you have any urgent questions, feel free to reach out directly at <a href="mailto:hello@thedramaturgy.com" style="color: #C8372D;">hello@thedramaturgy.com</a>.</p>
    <p>Best regards,<br>The Dramaturgy Team</p>
  `;

  await sendEmail({
    to: email,
    subject: `We received your message: ${subject}`,
    html: emailTemplate(confirmationContent, { showMemberFooter: false }),
  });
}
