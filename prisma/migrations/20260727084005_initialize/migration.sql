-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'SSLCOMMERZ');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- DropIndex
DROP INDEX "rentalRequests_tenantId_propertyId_idx";

-- AlterTable
ALTER TABLE "rentalRequests" ADD COLUMN     "agreedRent" INTEGER;

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "rentalRequestId" TEXT NOT NULL,
    "transactionId" TEXT,
    "checkoutSessionId" TEXT,
    "amount" INTEGER NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_rentalRequestId_key" ON "payment"("rentalRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactionId_key" ON "payment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_checkoutSessionId_key" ON "payment"("checkoutSessionId");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_rentalRequestId_fkey" FOREIGN KEY ("rentalRequestId") REFERENCES "rentalRequests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
