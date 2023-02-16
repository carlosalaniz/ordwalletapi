import { randomUUID } from "crypto";
import { BTCAddress } from "./helpers/BTCAddress";
import { BTCTransactions } from "./helpers/BTCTransactions";
import { BTCWallet } from "./helpers/BTCWallet";
import { CardinalBalance } from "./helpers/cardinalBalance";
import { ErrorMessages } from "./helpers/errorMessages";
import { Inscription, InscriptionCreationResult } from "./helpers/inscription";
import { Ord } from "./helpers/ord";
import { Satpoint } from "./helpers/satpoint";
import { BTCTransaction } from "./helpers/transacation";
import { WalletCreateMnemonic as WalletMnemonic } from "./helpers/walletCreateNemonic";

// This class provides an light async wrapper to https://github.com/casey/ord 
export class OrdBridge {
    constructor(private ordInstance: Ord, private Wallet: BTCWallet) { }

    /**
     * Create a new wallet
     */
    static async create(ordInstance: Ord, name: string = randomUUID()): Promise<[WalletMnemonic, BTCWallet]> {
        const wallet = new BTCWallet(name);
        const command = ["--wallet", name, "wallet", "create"].join(" ");
        const result = await ordInstance.runCommand<WalletMnemonic>(command);
        return [result, wallet]
    }

    /**
     * Restores a wallet from a mnemonic phrase
     * @param mnemonic 
     */
    static async restore(mnemonic: string): Promise<[WalletMnemonic, BTCWallet]> {
        throw 'not implemented';
    }

    // Wallet data
    async balance(): Promise<CardinalBalance> {
        const command = ["--wallet", this.Wallet.id, "wallet", "balance"].join(" ");
        const result = await this.ordInstance.runCommand<CardinalBalance>(command);
        return result;
    }

    /**
     * See wallet transactions
     * @param limit Fetch at most <LIMIT> transactions
     */
    async transactions(limit: number): Promise<BTCTransactions[]> {
        const command = ["--wallet", this.Wallet.id, "wallet", "transactions"].join(" ");
        const result = await this.ordInstance.runCommand<BTCTransactions[]>(command);
        return result;
    }

    /**
     * List wallet inscriptions
     */
    async inscriptions(): Promise<Inscription[]> {
        const command = ["--wallet", this.Wallet.id, "wallet", "inscriptions"].join(" ");
        const result = await this.ordInstance.runCommand<Inscription[]>(command);
        return result;
    }

    /**
     * Create inscription
     * @param filePath Inscribe sat with its contents. full path. 
     * @param feeRate  Use fee rate of <FEE_RATE> sats/vB [default: 2.0]
     * @param satpoint Sat to Inscribe
     */
    async inscribe(filePath: string, feeRate: number = 2, options: { satpoint?: Satpoint, dryRun?: boolean }): Promise<InscriptionCreationResult | ErrorMessages> {
        var command_elements = [
            "--wallet",
            this.Wallet.id,
            "wallet",
            "inscribe", filePath,
            "--fee-rate", feeRate,
        ]

        if (options.satpoint) {
            command_elements.push("--sat-point", options.satpoint.satpoint);
        }

        if (options.dryRun) {
            command_elements.push("--dry-run");
        }

        const command = command_elements.join(" ");
        try {
            return await this.ordInstance.runCommand<InscriptionCreationResult>(command);
        } catch (e) {
            switch (e) {
                case ErrorMessages.NOT_ENOUGH_CARDINAL:
                    return ErrorMessages.NOT_ENOUGH_CARDINAL
            }
            throw e;
        }
    }

    /**
     * Generate receive address
     */
    async receive(): Promise<BTCAddress> {
        const command = ["--wallet", this.Wallet.id, "wallet", "receive"].join(" ");
        const result = await this.ordInstance.runCommand<BTCAddress>(command);
        return result;
    }

    /**
     * Send sat or inscription
     * @param address 
     * @param inscription 
     * @param feeRate Use fee rate of <FEE_RATE> sats/vB [default: 1.0]
     * @returns Transaction id in string
     */
    async send(address: BTCAddress, inscription: Inscription, feeRate: number): Promise<BTCTransaction> {
        const command = [
            "--wallet", this.Wallet.id,
            "wallet", "send",
            address.address, inscription.inscription,
            "--fee-rate", feeRate
        ].join(" ");
        const result = await this.ordInstance.runCommand<string>(command);
        return { transactionId: result };
    }
}   