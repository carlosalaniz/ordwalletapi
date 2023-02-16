
import {
    Controller,
    FormField,
    Get,
    Post,
    Query,
    Route,
    Tags,
    UploadedFile,
    Request,
    Body,
    Security
} from "tsoa";
import { WalletCreateMnemonic as WalletMnemonic } from "../ord/helpers/walletCreateNemonic";
import { BTCWallet } from "../ord/helpers/BTCWallet";
import { CardinalBalance } from "../ord/helpers/cardinalBalance";
import { BTCTransactions } from "../ord/helpers/BTCTransactions";
import { Inscription, InscriptionCreationResult } from "../ord/helpers/inscription";
import { ErrorMessages } from "../ord/helpers/errorMessages";
import { BTCAddress } from "../ord/helpers/BTCAddress";
import { BTCTransaction } from "../ord/helpers/transacation";

@Tags("wallet")
@Route("/wallet")
@Security('api_key')
export class WalletController extends Controller {
    @Get("status")
    public status() {
        return "OK";
    }

    @Post("create")
    public async create(): Promise<{ walletMnemonic: WalletMnemonic, btcWallet: BTCWallet }> {
        throw "not implemented"
    }

    @Post("restore")
    public restore() {
        throw "not implemented"
    }

    @Get("balance")
    @Security('jwt')
    public balance(): Promise<CardinalBalance> {
        throw "not implemented"
    }

    @Get("transactions")
    @Security('jwt')
    public transactions(): Promise<BTCTransactions[]> {
        throw "not implemented"
    }

    @Post("inscribe")
    @Security('jwt')
    public inscribe(
        @UploadedFile() file: Express.Multer.File,
        @FormField() dryRun: boolean = false,
        @FormField() feeRate: number,
        @FormField() satpoint?: string
    ): Promise<InscriptionCreationResult | ErrorMessages> {
        throw "not implemented"
    }

    @Get("receive")
    @Security('jwt')
    public receive(
    ): Promise<BTCAddress> {
        throw "not implemented"
    }

    @Post("send")
    @Security('jwt')
    public send(
        @Body() body: {
            address: BTCAddress,
            inscription: Inscription,
            feeRate: number,
        }
    ): Promise<BTCTransaction> {
        throw "not implemented"
    }
}