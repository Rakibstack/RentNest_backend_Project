-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_rentalRequestId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_rentalRequestId_fkey";

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_rentalRequestId_fkey" FOREIGN KEY ("rentalRequestId") REFERENCES "rentalRequests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rentalRequestId_fkey" FOREIGN KEY ("rentalRequestId") REFERENCES "rentalRequests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
