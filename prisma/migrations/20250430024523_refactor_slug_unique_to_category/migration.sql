-- AlterTable
ALTER TABLE `Package` ADD COLUMN `mainImageId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Package` ADD CONSTRAINT `Package_mainImageId_fkey` FOREIGN KEY (`mainImageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
