import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Community Guidelines",
  description: "Guidelines for participating in The Dramaturgy community.",
};

export default function GuidelinesPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold">Community Guidelines</h1>
      <p className="text-muted-foreground mt-2">
        Our guidelines for a respectful and productive community
      </p>

      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Be Respectful</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p>
              Treat all community members with respect. We come from diverse
              backgrounds, experiences, and perspectives in theatre and
              performing arts.
            </p>
            <ul>
              <li>Use welcoming and inclusive language</li>
              <li>Be considerate of different viewpoints</li>
              <li>Accept constructive criticism gracefully</li>
              <li>Focus on what is best for the community</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ask Good Questions</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p>
              The best questions provide context and invite thoughtful responses.
            </p>
            <ul>
              <li>Be specific about your situation and context</li>
              <li>Explain what you&apos;ve already tried or considered</li>
              <li>Share relevant constraints or parameters</li>
              <li>Indicate if you&apos;re seeking expert perspectives</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provide Helpful Answers</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p>
              When responding to questions, aim to be genuinely helpful.
            </p>
            <ul>
              <li>Share from your own experience when relevant</li>
              <li>Provide practical, actionable suggestions</li>
              <li>Acknowledge the complexity of dramaturgical challenges</li>
              <li>Cite sources or references when appropriate</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Respect Confidentiality</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p>
              Theatre work often involves sensitive information.
            </p>
            <ul>
              <li>Don&apos;t share private details about productions without permission</li>
              <li>Anonymize examples when discussing specific situations</li>
              <li>Respect that some questions may be marked as sensitive</li>
              <li>Keep private conversations private</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>No Spam or Self-Promotion</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p>
              Keep the community focused on knowledge sharing.
            </p>
            <ul>
              <li>Don&apos;t post promotional content</li>
              <li>Don&apos;t repeatedly post the same question</li>
              <li>Link to external resources only when genuinely helpful</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Issues</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p>
              Help us maintain a healthy community by reporting content that
              violates these guidelines. Use the flag feature on any question
              or reply to alert moderators.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
