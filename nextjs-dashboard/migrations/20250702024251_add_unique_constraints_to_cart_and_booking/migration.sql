/*
  Warnings:

  - A unique constraint covering the columns `[userId,recitalId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,recitalId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Booking_userId_recitalId_key" ON "Booking"("userId", "recitalId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_recitalId_key" ON "Cart"("userId", "recitalId");
