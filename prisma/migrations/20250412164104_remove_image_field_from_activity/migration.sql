/*
  Warnings:

  - A unique constraint covering the columns `[seoId]` on the table `Author` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId]` on the table `Seo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Seo` DROP FOREIGN KEY `Seo_authorId_fkey`;

-- DropIndex
DROP INDEX `Seo_authorId_fkey` ON `Seo`;

-- AlterTable
ALTER TABLE `Author` ADD COLUMN `seoId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Author_seoId_key` ON `Author`(`seoId`);

-- CreateIndex
CREATE UNIQUE INDEX `Seo_authorId_key` ON `Seo`(`authorId`);

-- AddForeignKey
ALTER TABLE `Author` ADD CONSTRAINT `Author_seoId_fkey` FOREIGN KEY (`seoId`) REFERENCES `Seo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
