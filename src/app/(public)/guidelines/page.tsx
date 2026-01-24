export const metadata = {
  title: "Community Guidelines",
  description: "Guidelines for participating in The Dramaturgy community.",
};

const guidelines = [
  {
    number: "01",
    title: "Be Respectful",
    description: "Treat all community members with respect. We come from diverse backgrounds, experiences, and perspectives in theatre and performing arts.",
    points: [
      "Use welcoming and inclusive language",
      "Be considerate of different viewpoints",
      "Accept constructive criticism gracefully",
      "Focus on what is best for the community",
    ],
  },
  {
    number: "02",
    title: "Ask Good Questions",
    description: "The best questions provide context and invite thoughtful responses.",
    points: [
      "Be specific about your situation and context",
      "Explain what you've already tried or considered",
      "Share relevant constraints or parameters",
      "Indicate if you're seeking expert perspectives",
    ],
  },
  {
    number: "03",
    title: "Provide Helpful Answers",
    description: "When responding to questions, aim to be genuinely helpful.",
    points: [
      "Share from your own experience when relevant",
      "Provide practical, actionable suggestions",
      "Acknowledge the complexity of dramaturgical challenges",
      "Cite sources or references when appropriate",
    ],
  },
  {
    number: "04",
    title: "Respect Confidentiality",
    description: "Theatre work often involves sensitive information.",
    points: [
      "Don't share private details about productions without permission",
      "Anonymize examples when discussing specific situations",
      "Respect that some questions may be marked as sensitive",
      "Keep private conversations private",
    ],
  },
  {
    number: "05",
    title: "No Spam or Self-Promotion",
    description: "Keep the community focused on knowledge sharing.",
    points: [
      "Don't post promotional content",
      "Don't repeatedly post the same question",
      "Link to external resources only when genuinely helpful",
    ],
  },
  {
    number: "06",
    title: "Report Issues",
    description: "Help us maintain a healthy community by reporting content that violates these guidelines. Use the flag feature on any question or reply to alert moderators.",
    points: [],
  },
];

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-2 border-foreground bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
            Community
            <br />
            Guidelines
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-primary-foreground/80 max-w-2xl">
            Our guidelines for a respectful and productive community.
            Together, we build a space for meaningful dramaturgical discourse.
          </p>
        </div>
      </section>

      {/* Guidelines Grid */}
      <section className="py-12 md:py-20">
        <div className="container max-w-5xl">
          <div className="space-y-0">
            {guidelines.map((guideline, index) => (
              <div
                key={guideline.number}
                className={`border-2 border-foreground p-8 md:p-12 ${
                  index > 0 ? "border-t-0" : ""
                } hover:bg-muted transition-colors group`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
                  <div className="text-6xl md:text-8xl font-black text-primary group-hover:text-foreground transition-colors shrink-0">
                    {guideline.number}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {guideline.title}
                    </h2>
                    <p className="mt-3 text-lg text-muted-foreground">
                      {guideline.description}
                    </p>
                    {guideline.points.length > 0 && (
                      <ul className="mt-6 space-y-3">
                        {guideline.points.map((point, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-foreground"
                          >
                            <span className="w-2 h-2 bg-primary mt-2 shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t-2 border-foreground bg-foreground text-background py-16 md:py-24">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black">
            Ready to join the conversation?
          </h2>
          <p className="mt-4 text-xl text-background/70 max-w-2xl mx-auto">
            Sign up to ask questions, contribute answers, and be part of our growing community.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors"
            >
              Create Account
            </a>
            <a
              href="/explore"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-background text-background font-bold text-lg hover:bg-background hover:text-foreground transition-colors"
            >
              Browse First
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
