/*
  Warnings:

  - You are about to drop the column `storyId` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the `Story` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `moduleId` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_storyId_fkey";

-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "storyId",
ADD COLUMN     "moduleId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Story";

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficultyRating" INTEGER NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
