
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
    Security,
} from "tsoa";
import { WalletCreateMnemonic as WalletMnemonic } from "../ord/helpers/walletCreateNemonic";
import { BTCWallet } from "../ord/helpers/BTCWallet";
import { CardinalBalance } from "../ord/helpers/cardinalBalance";
import { BTCTransactions } from "../ord/helpers/BTCTransactions";
import { Inscription, InscriptionCreationResult } from "../ord/helpers/inscription";
import { BTCAddress } from "../ord/helpers/BTCAddress";
import { BTCTransaction } from "../ord/helpers/transacation";
import { OrdBridge } from "../ord/ordBridge";
import { ErrorCodes } from "../ord/helpers/errorMessages";
import config from "../config";
import md5 from 'js-md5';
import { resolve } from "path";
import { writeFileSync } from "fs";
import loadBalancer from "../ord/loadBalancer";

@Tags("wallet")
@Route("wallet")
// @Security('api_key')
export class WalletController extends Controller {
    @Get("status")
    public status() {
        return "OK";
    }

    @Post("create")
    public async create(): Promise<{ walletMnemonic: WalletMnemonic, btcWallet: BTCWallet }> {
        const newWallet = await OrdBridge.create();
        return { walletMnemonic: newWallet[0], btcWallet: newWallet[1] }
    }

    @Post("restore")
    public restore() {
        this.setStatus(501)
        return "Not Implemented";
    }

    @Get("balance")
    // @Security('jwt')
    public async balance(
        @Query() walletId
    ): Promise<CardinalBalance | ErrorCodes> {
        const newWallet = new OrdBridge(walletId);
        const response = await newWallet.balance();
        if (response.toString() in ErrorCodes) {
            this.setStatus(400);
        }
        return response
    }

    @Get("transactions")
    // @Security('jwt')
    public async transactions(
        @Query() walletId
    ): Promise<ErrorCodes | BTCTransactions[]> {
        const bridge = new OrdBridge(walletId);
        const response = await bridge.transactions();
        if (response.toString() in ErrorCodes) {
            this.setStatus(400);
        }
        return response
    }

    @Get("inscriptions")
    // @Security('jwt')
    public async inscriptions(
        @Query() walletId
    ): Promise<ErrorCodes | Inscription[]> {
        const bridge = new OrdBridge(walletId);
        const response = await bridge.inscriptions();
        if (response.toString() in ErrorCodes) {
            this.setStatus(400);
        }
        return response
    }

    @Post("inscribe")
    // @Security('jwt')
    public async inscribe(
        @Query() walletId,
        @UploadedFile() file: Express.Multer.File,
        @FormField() dryRun: boolean = false,
        @FormField() feeRate: number,
    ): Promise<InscriptionCreationResult | ErrorCodes> {
        const bridge = new OrdBridge(walletId);
        // check file
        let error_messages = [];

        if (file.size > 80000) {
            error_messages.push(`file size cannot be greater than 80,000 bytes. Actual size ${file.buffer.length}`);
        }

        const basePath = config.INSCRIPTIONS_IMAGE_FOLDER;
        const fileName = `${md5(file.buffer)}.${file.originalname.split('.').pop()}`
        const filePath = resolve(basePath, fileName)
        // save file.
        writeFileSync(filePath, file.buffer);

        const response = await bridge.inscribe(
            filePath,
            feeRate,
            { dryRun }
        );
        if (response.toString() in ErrorCodes) {
            this.setStatus(400);
        }
        return response
    }

    @Get("receive")
    // @Security('jwt')
    public async receive(
        @Query() walletId,
    ): Promise<BTCAddress | ErrorCodes> {
        const bridge = new OrdBridge(walletId);
        const response = await bridge.receive();
        if (response.toString() in ErrorCodes) {
            this.setStatus(400);
        }
        return response
    }

    @Post("send")
    // @Security('jwt')
    public async send(
        @Query() walletId,
        @Body() body: {
            addressTo: string,
            inscription: string,
            feeRate: number,
        }
    ): Promise<BTCTransaction | ErrorCodes> {
        const bridge = new OrdBridge(walletId);
        const response = await bridge.send(
            { address: body.addressTo },
            body.inscription,
            body.feeRate
        );
        if (response.toString() in ErrorCodes) {
            this.setStatus(400);
        }
        return response
    }
}