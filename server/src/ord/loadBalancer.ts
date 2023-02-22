// import Keyv from 'keyv';

import config from "../config"
import { Ord } from "./helpers/ord"

type ORD_STATE = {
    [version: string]: {
        binPath: string,
        lastPicked: Date,
        ord: Ord
    }[]
}

const state = config.ORD_BINARY_PATHS.reduce((state, path, i) => {
    if (!state[path.version]) state[path.version] = [];
    // rotate the nodes
    const btcNode = config.BTC_NODES.at(i % config.BTC_NODES.length);
    state[path.version].push({
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
    return state
}, {} as ORD_STATE)

export default {
    getInstance() {
        const instances = Object.entries(state).map(([_, ord]) => ord.flat()).flat();
        instances.sort((a, b) => {
            // Ascending order
            return a.lastPicked?.getTime() ?? 0 - b.lastPicked?.getTime() ?? 0
        })
        const notBlocked = instances.filter(i => i.ord.lockStarted == null);
        if (notBlocked.length > 0) {
            notBlocked.at(0).lastPicked = new Date();
            return notBlocked.at(0).ord
        }
        instances.sort((a, b) => {
            // Ascending order
            return a.ord.lockStarted.getTime() - b.ord.lockStarted.getTime()
        })
        instances.at(0).lastPicked = new Date();
        return instances.at(0).ord
    }
}
