/*
  Warnings:

  - You are about to alter the column `paymentStatus` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to alter the column `status` on the `table` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - Added the required column `accountName` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankAccount` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `paymentMethod` VARCHAR(191) NULL,
    ADD COLUMN `rejectReason` VARCHAR(191) NULL,
    MODIFY `paymentStatus` ENUM('PENDING', 'WAITING_CONFIRMATION', 'PAID', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `restaurant` ADD COLUMN `accountName` VARCHAR(191) NOT NULL,
    ADD COLUMN `bankAccount` VARCHAR(191) NOT NULL,
    ADD COLUMN `bankName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `table` MODIFY `status` ENUM('AVAILABLE', 'BOOKED') NOT NULL DEFAULT 'AVAILABLE';
