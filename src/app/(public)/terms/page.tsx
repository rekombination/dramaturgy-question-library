export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for The Dramaturgy platform.",
  alternates: {
    canonical: "https://thedramaturgy.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-2 border-foreground py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using The Dramaturgy, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use
                our platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for maintaining the security of your account and
                for all activities that occur under your account. You must provide
                accurate information when creating an account.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">3. User Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of content you post. By posting content, you grant
                us a non-exclusive license to display and distribute that content on
                our platform. You are responsible for ensuring your content does not
                violate any third-party rights.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to use the platform to post harmful, abusive, or illegal
                content. You must follow our Community Guidelines when participating
                in discussions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Dramaturgy platform, including its design, features, and content
                (excluding user-generated content), is protected by copyright and
                other intellectual property laws.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">6. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate
                these terms or our Community Guidelines. You may delete your account
                at any time through your account settings.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">7. Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The platform is provided &quot;as is&quot; without warranties of any kind.
                We do not guarantee the accuracy of user-generated content or advice
                shared on the platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these terms from time to time. Continued use of the
                platform after changes constitutes acceptance of the new terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">9. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these terms, please contact us through our platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
