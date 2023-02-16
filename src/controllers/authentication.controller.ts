import { Tags, Route, Security, Controller, Post, Body } from "tsoa";

@Tags("wallet")
@Route("/authentication")
@Security('api_key')
export class WalletController extends Controller {
    @Post("register")
    async register(
        @Body() registerInfo: {
            username: string,
            password: string
        }
    ) {
        throw "not implemented";
    }

    @Post("login")
    async login(
        @Body() loginInfo: {
            username: string,
            password: string
        }
    ) {
        throw "not implemented";
    }
}