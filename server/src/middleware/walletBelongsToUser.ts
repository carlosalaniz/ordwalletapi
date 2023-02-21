import {
    default as express,
    Response as ExResponse,
    Request as ExRequest,
    NextFunction,
} from 'express';
import { AuthenticatedRequest, KnownError } from '../authentication';
import config from '../config';
import { ErrorCodes } from '../ord/helpers/errorMessages';


export async function WalletBelongsToUser(
    req: AuthenticatedRequest,
    res: ExResponse,
    next: NextFunction,
): Promise<ExResponse | void> {
    const walletId = req.query.walletId as string;
    if (!req.user.wallets.includes(walletId)) {
        next(new KnownError(ErrorCodes.NOT_YOUR_WALLET))
    } else {
        next();
    }
}