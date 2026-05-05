-- CreateTable
CREATE TABLE "Recital" (
    "id" SERIAL NOT NULL,
    "artist" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "Recital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeatType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "SeatType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recital" ADD CONSTRAINT "Recital_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatType" ADD CONSTRAINT "SeatType_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
