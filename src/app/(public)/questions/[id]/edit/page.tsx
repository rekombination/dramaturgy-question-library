import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EditQuestionForm } from "./edit-question-form";

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id: questionId } = await params;

  // Require authentication
  if (!session?.user) {
    redirect(`/login?callbackUrl=/questions/${questionId}/edit`);
  }

  // Fetch the question
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  });

  // Check if question exists
  if (!question) {
    notFound();
  }

  // Check if user is the author
  if (question.authorId !== session.user.id) {
    return (
      <div className="min-h-screen py-16">
        <div className="container max-w-4xl">
          <div className="border-2 border-foreground p-12 text-center">
            <h1 className="text-2xl font-black mb-4">Unauthorized</h1>
            <p className="text-muted-foreground">
              You can only edit your own questions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <EditQuestionForm question={question} questionId={questionId} />;
}
