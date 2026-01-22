const siteUrl = "https://thedramaturgy.com";

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Dramaturgy",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "A community platform for dramaturgical questions and knowledge sharing in theatre and performing arts.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${siteUrl}/contact`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Dramaturgy - Question Library",
    url: siteUrl,
    description:
      "A community platform for dramaturgical questions and knowledge sharing in theatre and performing arts.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/explore?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: ["en", "de"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface QuestionJsonLdProps {
  question: {
    id: string;
    title: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    author: {
      name: string | null;
    };
    replyCount: number;
    voteCount: number;
  };
  replies?: {
    id: string;
    body: string;
    createdAt: Date;
    voteCount: number;
    author: {
      name: string | null;
    };
  }[];
}

export function QuestionJsonLd({ question, replies = [] }: QuestionJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question.title,
      text: question.body,
      dateCreated: question.createdAt,
      dateModified: question.updatedAt,
      author: {
        "@type": "Person",
        name: question.author.name || "Anonymous",
      },
      answerCount: question.replyCount,
      upvoteCount: question.voteCount,
      url: `${siteUrl}/questions/${question.id}`,
      ...(replies.length > 0 && {
        acceptedAnswer: {
          "@type": "Answer",
          text: replies[0].body,
          dateCreated: replies[0].createdAt,
          upvoteCount: replies[0].voteCount,
          author: {
            "@type": "Person",
            name: replies[0].author.name || "Anonymous",
          },
          url: `${siteUrl}/questions/${question.id}#reply-${replies[0].id}`,
        },
        suggestedAnswer: replies.slice(1).map((reply) => ({
          "@type": "Answer",
          text: reply.body,
          dateCreated: reply.createdAt,
          upvoteCount: reply.voteCount,
          author: {
            "@type": "Person",
            name: reply.author.name || "Anonymous",
          },
          url: `${siteUrl}/questions/${question.id}#reply-${reply.id}`,
        })),
      }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished: Date;
  dateModified: Date;
  authorName: string;
  images?: string[];
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  images = [],
}: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "The Dramaturgy",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    ...(images.length > 0 && { image: images }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FAQJsonLdProps {
  questions: { question: string; answer: string }[];
}

export function FAQJsonLd({ questions }: FAQJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BlogPostingListJsonLdProps {
  posts: {
    title: string;
    description: string;
    url: string;
    datePublished: string;
    dateModified?: string;
    author: string;
    image?: string;
  }[];
}

export function BlogPostingListJsonLd({ posts }: BlogPostingListJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The Dramaturgy Blog",
    description:
      "Articles, insights, and resources about dramaturgy and theatre practice.",
    url: `${siteUrl}/blog`,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: post.url,
      datePublished: post.datePublished,
      dateModified: post.dateModified || post.datePublished,
      author: {
        "@type": "Person",
        name: post.author,
      },
      publisher: {
        "@type": "Organization",
        name: "The Dramaturgy",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.png`,
        },
      },
      ...(post.image && { image: post.image }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
