/*
  Warnings:

  - You are about to drop the column `date` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `reservation` table. All the data in the column will be lost.
  - Added the required column `reservationDate` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `date`,
    DROP COLUMN `status`,
    DROP COLUMN `time`,
    ADD COLUMN `reservationDate` DATETIME(3) NOT NULL;
