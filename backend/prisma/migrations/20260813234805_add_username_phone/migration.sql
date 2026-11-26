/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '0000000000',
ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'temporary_username';

-- CreateIndex
CREATE UNIQUE INDEX "Customer_username_key" ON "Customer"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");
