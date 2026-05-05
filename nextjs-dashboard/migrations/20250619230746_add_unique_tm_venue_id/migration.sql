/*
  Warnings:

  - A unique constraint covering the columns `[tmVenueId]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Venue_tmVenueId_key" ON "Venue"("tmVenueId");
