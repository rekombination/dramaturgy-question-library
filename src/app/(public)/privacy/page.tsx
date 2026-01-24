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
              <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use only technically necessary cookies and privacy-friendly analytics:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li><strong>Authentication Cookies:</strong> We use session cookies (NextAuth.js) to keep you logged in. These are technically necessary for the platform to function and do not require consent under GDPR Article 6(1)(b).</li>
                <li><strong>Local Storage:</strong> We use browser SessionStorage to temporarily save form drafts (e.g., when writing questions). This data never leaves your device and is not tracked.</li>
                <li><strong>Analytics:</strong> We use Umami Analytics, a privacy-friendly, cookieless analytics service that collects only anonymous usage statistics (page views, referrers, browser types) without storing any personal data or creating user profiles. No consent required under GDPR.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We explicitly do not use tracking cookies, third-party advertising cookies, or any form of cross-site tracking. Vercel Analytics is disabled on our platform.
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
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Email Authentication:</strong> Resend (email delivery service) for passwordless login</li>
                <li><strong>Database:</strong> Supabase (PostgreSQL database hosting)</li>
                <li><strong>File Storage:</strong> Vercel Blob (for uploaded images and media)</li>
                <li><strong>Hosting:</strong> Vercel (website hosting and deployment)</li>
                <li><strong>Analytics:</strong> Umami Cloud (privacy-friendly, cookieless analytics)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                These services have their own privacy policies and are GDPR-compliant. We do not share your personal data beyond what is necessary for these services to function.
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
              <h2 className="text-2xl font-bold mb-4">9. Data Controller</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The data controller responsible for your personal data is:
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Dramaturgy<br />
                Email: hello@thedramaturgy.com
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this privacy policy or want to exercise your rights under GDPR, please contact us at hello@thedramaturgy.com or through our contact form.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
