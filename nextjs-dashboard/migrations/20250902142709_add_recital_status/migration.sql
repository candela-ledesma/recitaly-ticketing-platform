-- CreateEnum
CREATE TYPE "RecitalStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Recital" ADD COLUMN     "status" "RecitalStatus" NOT NULL DEFAULT 'ACTIVE';
