import { default as express, Request } from "express";
import jwt from "jsonwebtoken";
import config from "./config";
import { ErrorCodes } from "./ord/helpers/errorMessages";
export type AuthenticatedUser = { id: string, wallets: string[] };
export type AuthenticatedRequest = Request & { user: AuthenticatedUser };
// export type AuthenticatedHotspotRequest = Request & { user: HotspotPointOfSale };
export class KnownError extends Error { }
export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName === "jwt") {
        const token =
            request.body.token ||
            request.query.token ||
            request.headers["authorization"];

        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new KnownError(ErrorCodes.NO_TOKEN));
            }
            const secret = config.JWT_SIGNING_SECRET;
            jwt.verify(token, config.JWT_SIGNING_SECRET, function (err: any, decoded: any) {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    if (securityName === "api_key") {
        let token;
        if (request.query && request.query.access_token) {
            token = request.query.access_token;
        }

        if (token === "abc123456") {
            return Promise.resolve({
                id: 1,
                name: "Ironman",
            });
        } else {
            return Promise.reject();
        }
    }
}

