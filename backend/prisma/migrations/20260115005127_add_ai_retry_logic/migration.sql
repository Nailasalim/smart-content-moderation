-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "aiAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "aiCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiError" TEXT;
