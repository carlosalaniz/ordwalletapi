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
        transactions: string[],
        addresses: string[],
        inscriptions: string[]
    }
    type UserState = {
        token?: string,
        walletClient?: WalletApi
        authClient?: any,
        info: {
            username: string,
            exp: number
        }
        wallets: WalletState[]
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
    private jwt?: string
    constructor(private host: string, private token?: string) {
        this.jwt = host;
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
            Authorization: `Bearer ${this.jwt}`,
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
        const url = this.host + resource + this.queryString(opt?.queryParameters);
        const headers = (this.jwt ? this.userHeaders : this.headers)
        return await fetch(url, {
            headers: headers(opt?.headers)
        })
    };

    async postJson(resource: string, opt?: fetchOptions & {
        body?: Object
    }) {
        const url = this.host + resource + this.queryString(opt?.queryParameters);
        const headers = (this.jwt ? this.userHeaders : this.headers)
        return await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...headers(opt?.headers)
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
        const url = this.host + resource + this.queryString(opt?.queryParameters);

        var data = Object.entries(opt.formData).reduce((formData, [key, value]) => {
            if (typeof value === "string") {
                formData.append(key, value);
            } else {
                formData.append(key, value.file, value.fileName);
            }
            return formData;
        }, new FormData())
        const headers = (this.jwt ? this.userHeaders : this.headers)
        return await fetch(url, {
            method: 'POST',
            headers: headers(opt.headers),
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
            inscribe: "/wallet/inscribe",
            receive: "/wallet/receive",
            send: "/wallet/send",
        }
    };

    async create() {
        return await this.client
            .postJson(this.endpoints.wallet.create)
            .then(r => r.json())
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
        ).then(r => r.json())
    };

    async transactions(walletId: string) {
        return await this.client.get(
            this.endpoints.wallet.transactions,
            {
                queryParameters: {
                    walletId: walletId
                }
            }
        ).then(r => r.json())
    };

    async inscriptions(walletId: string) {
        return await this.client.get(
            this.endpoints.wallet.inscriptions,
            {
                queryParameters: {
                    walletId: walletId
                }
            }
        ).then(r => r.json())
    };

    async inscribe(
        walletId: string,
        file: File,
        feeRate: number,
        dryRun: boolean = false,
    ) {
        return await this.client.postFormData(
            this.endpoints.wallet.receive,
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
        ).then(r => r.json())
    };

    async receive(walletId: string) {
        return await this.client.get(
            this.endpoints.wallet.receive,
            {
                queryParameters: {
                    walletId: walletId
                }
            }
        ).then(r => r.json())
    };

    async send(
        walletId: string,
        inscription: string,
        feeRate: number,
        addressTo: string
    ) {
        return await this.client.postJson(
            this.endpoints.wallet.inscriptions,
            {
                queryParameters: {
                    walletId: walletId
                },
                body: {
                    feeRate: Math.round(feeRate),
                    inscription: {
                        inscription
                    },
                    addressTo: {
                        address: addressTo
                    }
                }
            }
        ).then(r => r.json())
    };

    async wallets() {
        return await this.client
            .postJson(this.endpoints.wallet.wallets)
            .then(r => r.json())
    }
}

const configuration = {
    walletAPIHost: "https://experimental.extraordinal.net/",
    ordinalHost: "https://ordinals.com/",
    mempool: {
        host: "mempool.space",
        network: "mainnet"
    },
}

class Client {
    // TODO: add types.
    private authenticationApi = (client: IFetchClient) => {
        return {
            client,
            endpoints: {
                register: "/authentication/register",
                login: "/authentication/login"

            },
            async login(username: string, password: string) {
                return await this.client.postJson(this.endpoints.login, {
                    body: {
                        username, password
                    }
                }).then(r => r.json())
            },
            async register(userData: {
                username: string,
                password: string,
                passphrase: string
            }) {
                return await this.client.postJson(this.endpoints.register, {
                    body: {
                        ...userData
                    }
                }).then(r => r.json())
            }
        }
    }

    public walletClient(token: string) {
        const client = new FetchClient(configuration.walletAPIHost, token);
        return new WalletApi(client);
    }

    public AuthClient() {
        const client = new FetchClient(configuration.walletAPIHost);
        return this.authenticationApi(client);
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

export const reloadState = async () => {
    // Init session.
    console.debug("initializing state...")
    const token = localStorage.getItem("token");
    userState.authClient = client.AuthClient();
    if (token) {
        console.debug("token found...")
        userState.info = jwt_decode(token);
        if (userState.info.exp < Date.now()) {
            console.debug("token is expired, clearing...")
            localStorage.clear();
            userState.token = undefined;
            return;
        }
        userState.token = token;
        userState.walletClient = client.walletClient(token);
        userState.wallets = await userState.walletClient.wallets();
    } else {
        console.debug("token not found...")
    }
}

export const clients = {
    authClient: client.AuthClient(),
    walletClient: client.walletClient
};

export const userState = reactive({
    walletClient: undefined,
    authClient: null,
    token: "sdf",
    info: {
        username: "carlos",
        exp: 0
    },
    wallets: [{
        id: "0aaf5d5a-9245-4507-b548-2aa0912c0a40",
        balance: 4646,
        transactions: [
            "9e32dc186f42cae7813845dee50221d47a406686ffaf51126501bb8642d52845",
            "9e32dc186f42cae7813845dee50221d47a406686ffaf51126501bb8642d52845",
            "9e32dc186f42cae7813845dee50221d47a406686ffaf51126501bb8642d52845",
        ],
        addresses: [],
        inscriptions: [
            "d25f9daa2a873d38c41a2b69a8a11474f2ff12e594318661ae153cfa7f1b6ca5i0",
            "b4065548e66597e3fb9aa3989daea4233f6e4fffbdc5c5d2f1f0d8dc39adf3a2i0",
            "e9627ea545f2c29a6b60d27e0c3a14982813ff83b63587c7f3391d08e3d342a2i0",
            "54ac327df95aacac3c20bc4fc3d4a37674168e81c13741726b3a894790a538a3i0",
        ]
    }]
} as UserState);
reloadState();