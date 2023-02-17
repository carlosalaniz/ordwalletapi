import { rejects } from "assert";
import { randomUUID } from "crypto";
import { BTCAddress } from "./helpers/BTCAddress";
import { BTCTransactions } from "./helpers/BTCTransactions";
import { BTCWallet } from "./helpers/BTCWallet";
import { CardinalBalance } from "./helpers/cardinalBalance";
import { ErrorCodes } from "./helpers/errorMessages";
import { Inscription, InscriptionCreationResult } from "./helpers/inscription";
import { Ord } from "./helpers/ord";
import { Satpoint } from "./helpers/satpoint";
import { BTCTransaction } from "./helpers/transacation";
import { WalletCreateMnemonic as WalletMnemonic } from "./helpers/walletCreateNemonic";
import loadBalancer from "./loadBalancer";

// This class provides an light async wrapper to https://github.com/casey/ord 
export class OrdBridge {
    private ordInstance: Ord;
    private checkWalletPromise: Promise<false | ErrorCodes>;
    private Wallet: BTCWallet;
    constructor(walletOrWalletId: BTCWallet | string) {
        this.ordInstance = loadBalancer.getInstance();
        if (walletOrWalletId) {
            if (walletOrWalletId instanceof BTCWallet) {
                this.Wallet = walletOrWalletId;
            } else {
                this.Wallet = { id: walletOrWalletId }
            }
            this.checkWalletPromise = new Promise(async (resolve, reject) => {
                try {
                    await this.balance();
                    return resolve(false);
                } catch (e) {
                    const error = e.stderr;
                    if (/RpcError { code: -18/.test(error)) {
                        return resolve(ErrorCodes.BAD_ADDRESS_VALUE);
                    }
                    return reject(e);
                }
            })
        }
    }

    /**
     * Create a new wallet
     */
    static async create(name: string = randomUUID()): Promise<[WalletMnemonic, BTCWallet]> {
        const ordInstance = loadBalancer.getInstance()
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
    private async checkWalletAndRun<T>(run: () => Promise<T | ErrorCodes>) {
        const a = await this.checkWalletPromise;
        if (a != false && a in ErrorCodes) return a; else if (a) throw a;
        return await run();
    }
    // Wallet data
    async balance(): Promise<CardinalBalance | ErrorCodes> {
        return await this.checkWalletAndRun(async () => {
            const command = ["--wallet", this.Wallet.id, "wallet", "balance"].join(" ");
            const result = await this.ordInstance.runCommand<CardinalBalance>(command);
            return result;
        });
    }

    /**
     * See wallet transactions
     * @param limit Fetch at most <LIMIT> transactions
     */
    async transactions(limit?: number): Promise<BTCTransactions[] | ErrorCodes> {
        return await this.checkWalletAndRun(async () => {
            const command = ["--wallet", this.Wallet.id, "wallet", "transactions"].join(" ");
            const result = await this.ordInstance.runCommand<BTCTransactions[]>(command);
            return result;
        });
    }

    /**
     * List wallet inscriptions
     */
    async inscriptions(): Promise<Inscription[] | ErrorCodes> {
        return await this.checkWalletAndRun(async () => {
            const command = ["--wallet", this.Wallet.id, "wallet", "inscriptions"].join(" ");
            const result = await this.ordInstance.runCommand<Inscription[]>(command);
            return result;
        });
    }

    /**
     * Create inscription
     * @param filePath Inscribe sat with its contents. full path. 
     * @param feeRate  Use fee rate of <FEE_RATE> sats/vB [default: 2.0]
     * @param satpoint Sat to Inscribe
     */
    async inscribe(filePath: string, feeRate: number = 2, options: { satpoint?: Satpoint, dryRun?: boolean }): Promise<InscriptionCreationResult | ErrorCodes> {
        return await this.checkWalletAndRun(async () => {
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
                if ([
                    "error: wallet does not contain enough cardinal UTXOs, please add additional funds to wallet.",
                    "error: wallet contains no cardinal utxos"
                ].includes(e.stderr?.trim())) {
                    return ErrorCodes.NOT_ENOUGH_CARDINAL
                }
                throw e;
            }
        });

    }

    /**
     * Generate receive address
     */
    async receive(): Promise<BTCAddress | ErrorCodes> {
        return await this.checkWalletAndRun(async () => {
            const command = ["--wallet", this.Wallet.id, "wallet", "receive"].join(" ");
            const result = await this.ordInstance.runCommand<BTCAddress>(command);
            return result;
        });
    }

    /**
     * Send sat or inscription
     * @param address 
     * @param inscription 
     * @param feeRate Use fee rate of <FEE_RATE> sats/vB [default: 1.0]
     * @returns Transaction id in string
     */
    async send(address: BTCAddress, inscription: Inscription | string, feeRate: number): Promise<BTCTransaction | ErrorCodes> {
        return await this.checkWalletAndRun(async () => {
            const id = (inscription instanceof Inscription) ? inscription.inscription : inscription;
            const command = [
                "--wallet", this.Wallet.id,
                "wallet", "send",
                address.address, id,
                "--fee-rate", feeRate
            ].join(" ");
            try {
                const result = await this.ordInstance.runCommand<string>(command);
                return { transactionId: result };
            } catch (e) {
                const error = e.stderr;
                if (/Invalid value.+<ADDRESS>/.test(error)) {
                    return ErrorCodes.BAD_ADDRESS_VALUE;
                }
                if (/Invalid value.+<OUTGOING>/.test(error)) {
                    return ErrorCodes.BAD_INSCRIPTION_VALUE;
                }
                if (/outgoing satpoint.+not in wallet/.test(error)) {
                    return ErrorCodes.INSCRIPTION_NOT_IN_WALLET
                }
                throw e;
            }
        });
    }

}