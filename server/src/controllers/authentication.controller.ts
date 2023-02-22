import { randomUUID } from "crypto";
import { Tags, Route, Controller, Post, Body } from "tsoa";
import config from "../config";
import { ErrorCodes } from "../ord/helpers/errorMessages";
import { OrdBridge } from "../ord/ordBridge";
import { loadUserData } from "../tooling/utils";
import bcrypt from 'bcrypt'
@Tags("authentication")
@Route("/authentication")
// @Security('api_key')
export class AuthenticationController extends Controller {
    @Post("register")
    async register(
        @Body() body: {
            username: string,
            password: string
        }
    ) {
        try {
            const user = await config.prisma.users.findFirst({ where: { username: body.username } });
            if (user) {
                this.setStatus(400);
                return ErrorCodes.USER_NAME_UNAVAILABLE as ErrorCodes
            } else {
                const password = await bcrypt.hash(body.password, config.SALT_ROUNDS)
                const walletId = randomUUID();
                const wallet = await OrdBridge.create(walletId);
                const newUser = await config.prisma.users.create({
                    data: {
                        username: body.username,
                        password: password,
                        wallet: {
                            create: {
                                mnemonic: wallet[0].mnemonic,
                                id: walletId,
                                lastKnownBalance: 0
                            }
                        }
                    }
                });
                return { mnemonic: wallet[0].mnemonic, ...(await loadUserData(newUser.id)) };
            }
        } catch (e) {

        }
    }

    @Post("login")
    async login(
        @Body() body: {
            username: string,
            password: string
        }
    ) {
        const user = await config.prisma.users.findFirst({ where: { username: body.username } });
        if (!user || !await bcrypt.compare(body.password, user.password)) {
            this.setStatus(400);
            return ErrorCodes.BAD_LOGIN_ATTEMPT as ErrorCodes
        }
        return await loadUserData(user.id);
    }
}