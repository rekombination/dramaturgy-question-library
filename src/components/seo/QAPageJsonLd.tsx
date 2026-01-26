interface Answer {
  id: string;
  body: string;
  createdAt: Date;
  author: {
    name: string | null;
    username: string | null;
  };
  voteCount: number;
  isExpertPerspective: boolean;
}

interface QAPageJsonLdProps {
  question: {
    id: string;
    title: string;
    body: string;
    createdAt: Date;
    author: {
      name: string | null;
      username: string | null;
    };
    replies: Answer[];
    solvedByReply?: {
      id: string;
    } | null;
  };
}

export function QAPageJsonLd({ question }: QAPageJsonLdProps) {
  const siteUrl = "https://thedramaturgy.com";
  const questionUrl = `${siteUrl}/questions/${question.id}`;

  // Find accepted answer (solution)
  const acceptedAnswer = question.solvedByReply
    ? question.replies.find((r) => r.id === question.solvedByReply?.id)
    : null;

  // Sort other answers by votes
  const otherAnswers = question.replies
    .filter((r) => r.id !== acceptedAnswer?.id)
    .sort((a, b) => b.voteCount - a.voteCount);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question.title,
      text: question.body,
      dateCreated: question.createdAt.toISOString(),
      author: {
        "@type": "Person",
        name: question.author.name || question.author.username || "Anonymous",
      },
      answerCount: question.replies.length,
      ...(acceptedAnswer && {
        acceptedAnswer: {
          "@type": "Answer",
          text: acceptedAnswer.body,
          dateCreated: acceptedAnswer.createdAt.toISOString(),
          upvoteCount: acceptedAnswer.voteCount,
          author: {
            "@type": "Person",
            name:
              acceptedAnswer.author.name ||
              acceptedAnswer.author.username ||
              "Anonymous",
          },
          url: `${questionUrl}#reply-${acceptedAnswer.id}`,
        },
      }),
      ...(otherAnswers.length > 0 && {
        suggestedAnswer: otherAnswers.map((answer) => ({
          "@type": "Answer",
          text: answer.body,
          dateCreated: answer.createdAt.toISOString(),
          upvoteCount: answer.voteCount,
          author: {
            "@type": "Person",
            name: answer.author.name || answer.author.username || "Anonymous",
          },
          url: `${questionUrl}#reply-${answer.id}`,
        })),
      }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
