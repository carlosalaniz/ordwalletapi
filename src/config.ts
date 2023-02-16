require('dotenv').config()
type BTC_NODES_CONFIG = {
    rpc_url: string,
    cookie_file: string,
}

type ORD_BINARY_PATHS = {
    version: string;
    data_path: string;
    binary_path: string;
}

class Config {
    // secret to sign jwt
    JWT_SIGNING_SECRET: "";

    // comma separated rpc nodes to connect to. Format {address};{cookieFilePath}
    #BTC_NODES: BTC_NODES_CONFIG[] = null;
    get BTC_NODES() {
        if (this.#BTC_NODES) return this.#BTC_NODES;
        const value = process.env.BTC_NODES ?? "http://192.168.1.34:8332;/home/user/carlos.cookie"
        const nodesConfig: BTC_NODES_CONFIG[] = value.split(",").map(v => {
            const btc_node_paths = v.split(";");
            return {
                rpc_url: btc_node_paths.at(0),
                cookie_file: btc_node_paths.at(1)
            }
        })
        this.#BTC_NODES = nodesConfig;
        return this.#BTC_NODES
    }

    // comma separated full path where index lives. format {version}:{binary_path}:{data_path}
    #ORD_BINARY_PATHS: ORD_BINARY_PATHS[] = null
    get ORD_BINARY_PATHS() {
        if (this.#ORD_BINARY_PATHS) return this.#ORD_BINARY_PATHS;
        const value = process.env.ORD_DATA_PATHS ?? "5.0:/home/user/ver/ord/target/release/ord:/home/user/docker/data.copy/5.0/"
        const ordDataPaths: ORD_BINARY_PATHS[] = value.split(",").map(v => {
            const pathValues = v.split(":");
            return {
                version: pathValues.at(0),
                binary_path: pathValues.at(1),
                data_path: pathValues.at(2),
            }
        })
        this.#ORD_BINARY_PATHS = ordDataPaths;
        return this.#ORD_BINARY_PATHS;
    };

    // Number allowed number of requests before getting rate limited
    get NO_API_KEY_RATE_LIMITER() {
        return process.env.NO_API_KEY_RATE_LIMITER ?? "1"
    };

    // amount of time in ms before the rate-limited is reset
    get NO_API_KEY_RATE_LIMITER_EXPIRE() {
        return +process.env.NO_API_KEY_RATE_LIMITER_EXPIRE ?? 5000
    };

    // amount of time in ms ord should try to index
    get INDEX_ORD_EVERY() {
        return +process.env.INDEX_ORD_EVERY ?? 60 * 60 * 1000; // once every hour.
    };
}
export default new Config()