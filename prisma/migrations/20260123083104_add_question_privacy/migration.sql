-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Question_isPrivate_idx" ON "Question"("isPrivate");
