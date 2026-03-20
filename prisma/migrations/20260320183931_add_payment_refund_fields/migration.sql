-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `cancelReason` VARCHAR(191) NULL,
    ADD COLUMN `cancelledAt` DATETIME(3) NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191) NULL,
    ADD COLUMN `refundAmount` INTEGER NULL,
    ADD COLUMN `refundStatus` VARCHAR(191) NULL DEFAULT 'none',
    MODIFY `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'unpaid';

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `failureReason` VARCHAR(191) NULL,
    ADD COLUMN `refundAmount` INTEGER NULL,
    ADD COLUMN `refundId` VARCHAR(191) NULL,
    ADD COLUMN `refundStatus` VARCHAR(191) NULL DEFAULT 'none',
    ADD COLUMN `refundedAt` DATETIME(3) NULL,
    MODIFY `currency` VARCHAR(191) NULL DEFAULT 'USD';
