/*
  Warnings:

  - You are about to drop the column `price` on the `SeatType` table. All the data in the column will be lost.
  - You are about to drop the `Recital` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tmVenueId]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Recital" DROP CONSTRAINT "Recital_venueId_fkey";

-- AlterTable
ALTER TABLE "SeatType" DROP COLUMN "price",
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "eventId" INTEGER,
ADD COLUMN     "maxPrice" DOUBLE PRECISION,
ADD COLUMN     "minPrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "tmVenueId" TEXT;

-- DropTable
DROP TABLE "Recital";

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "tmEventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "url" TEXT,
    "imageUrl" TEXT,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_tmEventId_key" ON "Event"("tmEventId");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_tmVenueId_key" ON "Venue"("tmVenueId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatType" ADD CONSTRAINT "SeatType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
