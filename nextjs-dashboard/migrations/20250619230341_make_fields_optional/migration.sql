/*
  Warnings:

  - You are about to drop the column `currency` on the `SeatType` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `SeatType` table. All the data in the column will be lost.
  - You are about to drop the column `maxPrice` on the `SeatType` table. All the data in the column will be lost.
  - You are about to drop the column `minPrice` on the `SeatType` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `SeatType` table. All the data in the column will be lost.
  - Made the column `url` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SeatType" DROP CONSTRAINT "SeatType_eventId_fkey";

-- DropIndex
DROP INDEX "Venue_tmVenueId_key";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "url" SET NOT NULL;

-- AlterTable
ALTER TABLE "SeatType" DROP COLUMN "currency",
DROP COLUMN "eventId",
DROP COLUMN "maxPrice",
DROP COLUMN "minPrice",
DROP COLUMN "type",
ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "TicketType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "minPrice" INTEGER NOT NULL,
    "maxPrice" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "TicketType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketType" ADD CONSTRAINT "TicketType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketType" ADD CONSTRAINT "TicketType_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
