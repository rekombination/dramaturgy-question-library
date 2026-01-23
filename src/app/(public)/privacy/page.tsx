export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for The Dramaturgy platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-2 border-foreground py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Privacy Policy
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
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Account information (name, email address)</li>
                <li>Profile information you choose to add</li>
                <li>Content you post (questions, replies, comments)</li>
                <li>Communications with us</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Send you notifications related to your account</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze usage patterns</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell your personal information. We may share information
                with service providers who assist in operating our platform, or when
                required by law.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate security measures to protect your personal
                information. However, no method of transmission over the internet is
                100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">5. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to maintain your session,
                remember your preferences, and understand how you use our platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access and receive a copy of your data</li>
                <li>Correct inaccurate personal information</li>
                <li>Request deletion of your account and data</li>
                <li>Object to processing of your data</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">7. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use third-party services for authentication (Google, GitHub)
                and email delivery. These services have their own privacy policies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will notify
                you of any changes by posting the new policy on this page.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this privacy policy, please contact us
                through our platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
