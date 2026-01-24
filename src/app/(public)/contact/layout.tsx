import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with The Dramaturgy team. Have questions, suggestions, or feedback? We'd love to hear from you.",
  openGraph: {
    title: "Contact Us | The Dramaturgy",
    description: "Get in touch with The Dramaturgy team. Have questions, suggestions, or feedback? We'd love to hear from you.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact The Dramaturgy",
            description: "Get in touch with The Dramaturgy team for questions, suggestions, or feedback about our dramaturgical community platform.",
            url: "https://thedramaturgy.com/contact",
            mainEntity: {
              "@type": "Organization",
              name: "The Dramaturgy",
              email: "hello@thedramaturgy.com",
              url: "https://thedramaturgy.com",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
