import { Tags, Route, Security, Controller, Post, Body } from "tsoa";

@Tags("authentication")
@Route("/authentication")
// @Security('api_key')
export class AuthenticationController extends Controller {
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