/*
  Warnings:

  - You are about to drop the column `satus` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "satus",
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO';
