/*
  Warnings:

  - You are about to drop the column `capacity` on the `SeatType` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SeatType` table. All the data in the column will be lost.
  - You are about to drop the `TicketType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `SeatType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TicketType" DROP CONSTRAINT "TicketType_eventId_fkey";

-- DropForeignKey
ALTER TABLE "TicketType" DROP CONSTRAINT "TicketType_venueId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SeatType" DROP COLUMN "capacity",
DROP COLUMN "name",
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "eventId" INTEGER,
ADD COLUMN     "maxPrice" DOUBLE PRECISION,
ADD COLUMN     "minPrice" DOUBLE PRECISION,
ADD COLUMN "type" TEXT NOT NULL DEFAULT 'Standard';


-- DropTable
DROP TABLE "TicketType";

-- AddForeignKey
ALTER TABLE "SeatType" ADD CONSTRAINT "SeatType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
