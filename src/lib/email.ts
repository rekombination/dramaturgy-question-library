import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

const FROM_EMAIL = "The Dramaturgy <noreply@thedramaturgy.com>";
const SITE_URL = process.env.NEXTAUTH_URL || "https://thedramaturgy.com";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailOptions) {
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
function emailTemplate(content: string): string {
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
      color: #ffffff;
      text-decoration: none;
      padding: 14px 28px;
      font-weight: 700;
      margin: 20px 0;
      border: 3px solid #0A0A0A;
      font-size: 16px;
    }
    .button:hover {
      background-color: #B12F26;
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
      <p>You're receiving this because you're a member of The Dramaturgy community.</p>
      <p><a href="${SITE_URL}/me/settings">Manage your notification preferences</a></p>
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
