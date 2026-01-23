-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "expertClaimedAt" TIMESTAMP(3),
ADD COLUMN     "expertClaimedById" TEXT,
ADD COLUMN     "isSolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "solvedAt" TIMESTAMP(3),
ADD COLUMN     "solvedByReplyId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "Reply" ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';

-- CreateIndex
CREATE INDEX "Question_isSolved_idx" ON "Question"("isSolved");

-- CreateIndex
CREATE INDEX "Question_expertClaimedById_idx" ON "Question"("expertClaimedById");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_solvedByReplyId_fkey" FOREIGN KEY ("solvedByReplyId") REFERENCES "Reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_expertClaimedById_fkey" FOREIGN KEY ("expertClaimedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
