-- CreateTable
CREATE TABLE `Ord` (
    `id` VARCHAR(191) NOT NULL,
    `inscription_number` INTEGER NOT NULL,

    UNIQUE INDEX `Ord_id_key`(`id`),
    UNIQUE INDEX `Ord_inscription_number_key`(`inscription_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
