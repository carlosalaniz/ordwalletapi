import e from "express";
import config from "../config"
import { ErrorCodes } from "../ord/helpers/errorMessages";
import { OrdBridge } from "../ord/ordBridge";
import jwt from 'jsonwebtoken';
import { AuthenticatedUser } from "../authentication";

export function estimateCost(sizeBytes, fee?: number) {
    return Math.round(((fee * sizeBytes) / 2.8) * 1.10)
}

export function getUserToken(data: AuthenticatedUser) {
    return jwt.sign(data, config.JWT_SIGNING_SECRET, { expiresIn: '48h' });
}

export function validateUserToken(token: string) {
    return jwt.verify(token, config.JWT_SIGNING_SECRET);
}

export async function walletData(walletId: string) {
    const walletBridge = new OrdBridge(walletId);
    const balance = await walletBridge.balance();
    const inscriptions = await walletBridge.inscriptions();
    const transactions = await walletBridge.transactions();
    const addresses = await config.prisma.bTCAddress.findMany({
        where: {
            walletsId: walletId
        },
        select: {
            address: true,
            createdAt: true
        },
        orderBy: {
            createdAt: "desc"
        }
    }).then(a => a.map(a => a.address))
    if ([walletBridge, balance, inscriptions, transactions].every(result => !(result.toString() in ErrorCodes))) {
        return {
            balance,
            inscriptions,
            transactions,
            addresses
        }
    }
    return {
        addresses
    }
}

export async function loadUserData(user_id: string) {
    const user = await config.prisma.users.findUnique({
        where: { id: user_id },
        include: {
            wallet: {
                include: {
                    addresses: {
                        include: {
                            Inscriptions: true
                        }
                    }
                }
            }
        }
    });

    if (!user) throw "USER NOT FOUND";
    const wallet = user.wallet.at(0).id;
    const token = getUserToken({ id: user.id, wallets: user.wallet.map(w => w.id) });
    return { ...await walletData(wallet), token }
} 