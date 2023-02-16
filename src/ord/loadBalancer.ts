// import Keyv from 'keyv';

import config from "../config"
import { Ord } from "./helpers/ord"
import { OrdBridge } from "./ordBridge"

export class OrdLoadBalancer {
    private state: {
        [version: string]: {
            binPath: string,
            lastPicked: Date,
            ord: Ord
        }[]
    } = {}
    constructor() {
        config.ORD_BINARY_PATHS.forEach((path, i) => {
            if (!this.state[path.version]) this.state[path.version] = [];
            // rotate the nodes
            const btcNode = config.BTC_NODES.at(i % config.BTC_NODES.length);
            this.state[path.version].push({
                binPath: path.binary_path,
                lastPicked: null,
                ord: new Ord({
                    version: path.version,
                    dataDirectory: path.data_path,
                    binaryPath: path.binary_path,
                    rpcURL: btcNode.rpc_url,
                    cookiePath: btcNode.cookie_file
                })
            });
        })
    }
    getInstance() {
        const instances = Object.entries(this.state).map(([_, ord]) => ord.flat()).flat();
        instances.sort((a, b) => {
            // Ascending order
            return a.lastPicked.getTime() - b.lastPicked.getTime()
        })
        const notBlocked = instances.filter(i => i.ord.lockStarted == null);
        if (notBlocked.length > 0) {
            notBlocked.at(0).lastPicked = new Date();
            return notBlocked.at(0)
        }
        instances.sort((a, b) => {
            // Ascending order
            return a.ord.lockStarted.getTime() - b.ord.lockStarted.getTime()
        })
        instances.at(0).lastPicked = new Date();
        return instances.at(0)
    }
}