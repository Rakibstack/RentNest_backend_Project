-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_authorId_fkey";

-- DropForeignKey
ALTER TABLE "rentalRequests" DROP CONSTRAINT "rentalRequests_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "rentalRequests" DROP CONSTRAINT "rentalRequests_tenantId_fkey";

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentalRequests" ADD CONSTRAINT "rentalRequests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentalRequests" ADD CONSTRAINT "rentalRequests_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
