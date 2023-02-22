-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastLoggedIn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastActivity` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wallets` (
    `id` VARCHAR(191) NOT NULL,
    `mnemonic` VARCHAR(191) NULL,
    `lastKnownBalance` INTEGER NULL,
    `usersId` VARCHAR(191) NULL,

    UNIQUE INDEX `Wallets_usersId_key`(`usersId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BTCAddress` (
    `address` VARCHAR(191) NOT NULL,
    `walletsId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `BTCAddress_address_key`(`address`),
    PRIMARY KEY (`address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inscriptionId` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `bTCAddressAddress` VARCHAR(191) NULL,

    UNIQUE INDEX `Inscriptions_inscriptionId_key`(`inscriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ord` (
    `id` VARCHAR(191) NOT NULL,
    `inscription_number` INTEGER NOT NULL,

    UNIQUE INDEX `Ord_id_key`(`id`),
    UNIQUE INDEX `Ord_inscription_number_key`(`inscription_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Wallets` ADD CONSTRAINT `Wallets_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BTCAddress` ADD CONSTRAINT `BTCAddress_walletsId_fkey` FOREIGN KEY (`walletsId`) REFERENCES `Wallets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inscriptions` ADD CONSTRAINT `Inscriptions_bTCAddressAddress_fkey` FOREIGN KEY (`bTCAddressAddress`) REFERENCES `BTCAddress`(`address`) ON DELETE SET NULL ON UPDATE CASCADE;
