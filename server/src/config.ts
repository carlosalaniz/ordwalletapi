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
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
class Config {
    // prisma client
    get prisma() {
        return prisma;
    }

    // secret to sign jwt
    JWT_SIGNING_SECRET = "achurrascariamos arracimadas charran desmoralice gallofado exfoliabas armamentisticas malqueres";

    SALT_ROUNDS = 10;

    // comma separated rpc nodes to connect to. Format {address};{cookieFilePath}
    #BTC_NODES: BTC_NODES_CONFIG[] = null;
    get BTC_NODES() {
        if (this.#BTC_NODES) return this.#BTC_NODES;
        const value = process.env.BTC_NODES ?? "http://192.168.1.7:8332;/home/user/carlos.cookie"
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
        const value = process.env.ORD_DATA_PATHS ??
            [
                ["5.1", "/home/user/ver/ord/target/release/ord", "/home/user/ord-db/5.1/"].join(":"),
                ["5.1", "/home/user/ver/ord/target/release/ord", "/home/user/ord-db/5.1-backup/"].join(":")
            ].join(",")
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
        return process.env.NO_API_KEY_RATE_LIMITER ? +process.env.NO_API_KEY_RATE_LIMITER : "1";
    };

    // amount of time in ms before the rate-limited is reset
    get NO_API_KEY_RATE_LIMITER_EXPIRE() {
        return process.env.NO_API_KEY_RATE_LIMITER_EXPIRE ? +process.env.NO_API_KEY_RATE_LIMITER_EXPIRE : 5000;
    };

    // amount of time in ms ord should try to index
    get INDEX_ORD_EVERY() {
        return process.env.INDEX_ORD_EVERY ? +process.env.INDEX_ORD_EVERY : 30 * 60 * 1000; // once every 30 minutes.
    };

    // amount of time in ms ord should try to index
    get INSCRIPTIONS_IMAGE_FOLDER() {
        return process.env.INSCRIPTIONS_IMAGE_FOLDER ?? "/home/user/inscriptions_prod/";
    };

    get RUN_AS() {
        return process.env.RUN_AS ?? "DEBUG"
    }
}
export default new Config()