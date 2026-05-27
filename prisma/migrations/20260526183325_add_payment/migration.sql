-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `paymentProof` VARCHAR(191) NULL,
    ADD COLUMN `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING';
