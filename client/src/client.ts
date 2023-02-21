import { reactive } from "vue";
import jwt_decode from "jwt-decode";
declare global {
    type fetchOptions = {
        queryParameters?: { [key: string]: string },
        headers?: { [key: string]: string }
    }

    interface WalletState {
        id: string,
        balance: number,
        transactions: { transaction: string, confirmations: number }[],
        addresses: string[],
        inscriptions: string[]
    }

    type UserState = {
        SatToUSD: number,
        reloading: boolean,
        token?: string,
        walletClient?: WalletApi
        authClient?: AuthApi,
        info?: {
            username: string,
            exp: number
        }
        wallets?: WalletState[],
        lastFeeUpdate?: Date,
        fees?: {
            fastestFee?: number,
            halfHourFee?: number,
            hourFee?: number,
            economyFee?: number,
            minimumFee?: number
        }
    }

    interface IFetchClient {
        get: (
            resource: string,
            opt?: fetchOptions
        ) => Promise<Response>,
        postJson: (resource: string, opt?: fetchOptions & {
            body?: Object
        }) => Promise<Response>,
        postFormData: (
            resource: string,
            opt: fetchOptions & {
                formData: {
                    [k: string]: string | {
                        file: Blob,
                        fileName: string
                    }
                }
            }) => Promise<Response>,
    }
}


class FetchClient implements IFetchClient {
    constructor(private host: string, private jwt?: string) {
    }

    headers(headers: { [k: string]: string } = {}) {
        // these headers should be added to all requests
        return {
            ...headers
        }
    };

    userHeaders(headers: { [k: string]: string } = {}) {
        if (!this.jwt) throw "No user token defined."
        // this headers should be added to all authorized requests 
        return {
            Authorization: `${this.jwt}`,
            ...this.headers(headers),
        }
    };
    queryString(queryParameters?: { [k: string]: string | number }) {
        return queryParameters &&
            Object.keys(queryParameters).reduce((acc, key, i) => {
                const query = `${key}=${queryParameters![key]}&`
                return acc += query;
            }, "?")
    };

    async get(
        resource: string,
        opt?: fetchOptions
    ) {
        const url = this.host + resource + (this.queryString(opt?.queryParameters) ?? "");
        return await fetch(url, {
            headers: (this.jwt ? this.userHeaders(opt?.headers) : this.headers(opt?.headers)),
        })
    };

    async postJson(resource: string, opt?: fetchOptions & {
        body?: Object
    }) {
        const url = this.host + resource + (this.queryString(opt?.queryParameters) ?? "");
        return await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                ...(this.jwt ? this.userHeaders(opt?.headers) : this.headers(opt?.headers))
            },
            body: opt?.body && JSON.stringify(opt?.body)
        })
    };
    async postFormData(
        resource: string,
        opt: fetchOptions & {
            formData: {
                [k: string]: string | {
                    file: Blob,
                    fileName: string
                }
            }
        }
    ) {
        const url = this.host + resource + (this.queryString(opt?.queryParameters) ?? "");

        var data = Object.entries(opt.formData).reduce((formData, [key, value]) => {
            if (typeof value === "string") {
                formData.append(key, value);
            } else {
                formData.append(key, value.file, value.fileName);
            }
            return formData;
        }, new FormData())
        return await fetch(url, {
            method: 'POST',
            headers: (this.jwt ? this.userHeaders(opt?.headers) : this.headers(opt?.headers)),
            body: data
        })
    }
}

class WalletApi {
    constructor(private client: IFetchClient) { }
    protected endpoints = {
        wallet: {
            wallets: "/wallet/",
            create: "/wallet/create",
            restore: "/wallet/restore",
            balance: "/wallet/balance",
            transactions: "/wallet/transactions",
            inscriptions: "/wallet/inscriptions",
            data: "/wallet/data",
            inscribe: "/wallet/inscribe",
            receive: "/wallet/receive",
            send: "/wallet/send",
        }
    };

    async create() {
        return await this.client
            .postJson(this.endpoints.wallet.create)

    };

    async restore() {
        throw "not implemented";
    };

    async balance(walletId: string) {
        return await this.client.get(
            this.endpoints.wallet.balance,
            {
                queryParameters: {
                    walletId: walletId
                }
            }
        )
    };

    async transactions(walletId: string) {
        return await this.client.get(
            this.endpoints.wallet.transactions,
            {
                queryParameters: {
                    walletId: walletId
                }
            }
        )
    };

    async inscriptions(walletId: string) {
        return await this.client.get(
            this.endpoints.wallet.inscriptions,
            {
                queryParameters: {
                    walletId: walletId
                }
            }
        )
    };

    async data(walletId: string) {
        return await this.client.postJson(
            this.endpoints.wallet.data,
            {
                queryParameters: {
                    walletId: walletId
                }
            }
        )
    };

    async inscribe(
        walletId: string,
        file: File,
        feeRate: number,
        dryRun: boolean = false,
    ) {
        return await this.client.postFormData(
            this.endpoints.wallet.inscribe,
            {
                queryParameters: {
                    walletId: walletId
                },
                formData: {
                    file: {
                        file,
                        fileName: file.name,
                    },
                    dryRun: dryRun.toString(),
                    feeRate: Math.round(feeRate).toString()
                }
            }
        )
    };

    async receive(walletId: string) {
        return await this.client.get(
            this.endpoints.wallet.receive,
            {
                queryParameters: {
                    walletId: walletId
                }
            }
        )
    };

    async send(
        walletId: string,
        inscription: string,
        feeRate: number,
        addressTo: string
    ) {
        return await this.client.postJson(
            this.endpoints.wallet.send,
            {
                queryParameters: {
                    walletId: walletId
                },
                body: {
                    feeRate: Math.round(feeRate),
                    inscription,
                    addressTo
                }
            }
        )
    };

    async wallets() {
        return await this.client
            .postJson(this.endpoints.wallet.wallets)

    }
}

class AuthApi {
    constructor(private client: FetchClient) { }
    endpoints = {
        register: "/authentication/register",
        login: "/authentication/login"

    };
    async login(username: string, password: string) {
        return await this.client.postJson(this.endpoints.login, {
            body: {
                username, password
            }
        })
    };
    async register(userData: {
        username: string,
        password: string,
        // passphrase: string
    }) {
        return await this.client.postJson(this.endpoints.register, {
            body: {
                ...userData
            }
        })
    }
}


const configuration = {
    walletAPIHost: "https://experimental.extraordinal.net",
    ordinalHost: "https://ordinals.com/",
    mempool: {
        host: "mempool.space",
        network: "mainnet"
    },
}

class Client {
    public walletClient(token: string) {
        const client = new FetchClient(configuration.walletAPIHost, token);
        return new WalletApi(client);
    }

    public AuthClient() {
        const client = new FetchClient(configuration.walletAPIHost);
        return new AuthApi(client);
    }

    public mempoolApi = null;

}

const client = new Client();

export async function loadOrdinalData(id: string) {
    const contents = await fetch("https://ordapi.xyz/inscription/" + id).then(r => r.json());
    return {
        number: contents["inscription_number"],
        contentLength: contents["content length"],
        contentType: contents["content type"],
        timestamp: contents["timestamp"],
        SAT: contents["sat"].split("/")[1],
        rarity: "unknown"
    }

}

export const reloadState = async (new_token?: string) => {
    // Init session.
    console.debug("initializing state...")
    var token;
    if (new_token) {
        localStorage.setItem("token", new_token)
        token = new_token;
    } else {
        token = localStorage.getItem("token");
    }
    userState.reloading = true;
    if (token) {
        userState.authClient = client.AuthClient();
        userState.walletClient = client.walletClient(token);
        console.debug("token found...")
        const decoded = jwt_decode(token) as any;
        userState.info = {
            username: decoded?.id,
            exp: decoded?.exp as number
        }
        if (userState.info!.exp * 1000 < Date.now()) {
            console.debug("token is expired, clearing...")
            localStorage.clear();
            userState.token = undefined;
            return;
        }
        userState.token = token;
        userState.walletClient = client.walletClient(token);
        userState.wallets = await Promise.all(decoded.wallets.map(async (w: string) => {
            const data = await userState.walletClient?.data(w);
            const walletData = await data?.json()
            return {
                id: w,
                balance: walletData.balance.cardinal,
                transactions: walletData.transactions,
                addresses: walletData.addresses,
                inscriptions: walletData.inscriptions.map((i: any) => i.inscription)
            }
        }
        ))
        console.log()
    } else {
        console.debug("token not found...")
    }
    userState.reloading = false;
}

export const defaultState = {
    SatToUSD: 1,
    reloading: false,
    lastFeeUpdate: new Date(),
    fees: {
        fastestFee: undefined,
        halfHourFee: undefined,
        hourFee: undefined,
        economyFee: undefined,
        minimumFee: undefined
    },
    walletClient: undefined,
    // client.walletClient("token"),
    authClient: client.AuthClient(),
    // client.AuthClient(),
    token: undefined,
    info: undefined,
    // {
    //     username: "carlos",
    //     exp: 0
    // },
    wallets: undefined,
    // [
    //     //     {
    //     //     id: "4b9cb0a6-f9ca-4411-b865-bc9bf68ecbd3",
    //     //     balance: 4646,
    //     //     transactions: [
    //     //         "9e32dc186f42cae7813845dee50221d47a406686ffaf51126501bb8642d52845",
    //     //         "9e32dc186f42cae7813845dee50221d47a406686ffaf51126501bb8642d52845",
    //     //         "9e32dc186f42cae7813845dee50221d47a406686ffaf51126501bb8642d52845",
    //     //     ],
    //     //     addresses: [
    //     //         // "bc1phyhfywd23et3rjx8mau88l50q759yfqkxakpq4qrr7npkh6wutxst80j63"
    //     //     ],
    //     //     inscriptions: [
    //     //         "d25f9daa2a873d38c41a2b69a8a11474f2ff12e594318661ae153cfa7f1b6ca5i0",
    //     //         "b4065548e66597e3fb9aa3989daea4233f6e4fffbdc5c5d2f1f0d8dc39adf3a2i0",
    //     //         "e9627ea545f2c29a6b60d27e0c3a14982813ff83b63587c7f3391d08e3d342a2i0",
    //     //         "54ac327df95aacac3c20bc4fc3d4a37674168e81c13741726b3a894790a538a3i0",
    //     //     ]
    //     // }
    // ]
}


export var userState = reactive({ ...defaultState } as UserState);
export function resetState() {
    userState = { ...defaultState }
    localStorage.clear();

}
export async function wait(ms: number) {
    await new Promise((r) => setTimeout(() => r(1), ms));
}

export const errorMessages = {
    NOT_ENOUGH_CARDINAL: "You don't have enough cardinal in your wallet to perform this operation, please add more funds and try again.",
    INSCRIPTION_NOT_IN_WALLET: "oops... you don't seem to own that inscription!"
} as { [key: string]: string };

async function watchers() {
    await Promise.all([
        (async () => {
            while (true) {
                // mempool estimate watcher
                userState.fees = await
                    fetch("https://" + configuration.mempool.host + "/api/v1/fees/recommended")
                        .then(r => r.json())
                userState.lastFeeUpdate = new Date()
                // 1 minute
                await wait(60000);
            }
        })(),
        (async () => {
            while (true) {
                // wallet state watcher
                await reloadState()
                // 5 minutes
                await wait(5 * 60000);
            }
        })(),
        (async () => {
            while (true) {
                // BTC ticker watcher
                const ticker = await fetch("https://blockchain.info/ticker").then(r => r.json())
                const BTCtoUSD = ticker["USD"].last;
                const SatToUSD = BTCtoUSD / 100000000;
                userState.SatToUSD = SatToUSD;
                // 5 minutes
                await wait(5 * 60000);
            }
        })()
    ])
}
watchers()
reloadState();