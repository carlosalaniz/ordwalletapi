import e from "express";
import config from "../../config";
import { CommandQueue } from "../../tooling/commandQueue";
import logger from "../../tooling/logger";

export type ordInit = {
    /** ord version ex. 5.0*/
    version: string;

    /** full path of the binary */
    binaryPath: string;

    /** full path to folder where index.redb is located */
    dataDirectory: string;

    /** bitcoin node url Ex. http://127.0.0.1:8332*/
    rpcURL: string;

    /** full path to where .cookie is at */
    cookiePath: string;
}

var instances = 0;
export class Ord {
    private baseCommand: string;
    private commandQueue = new CommandQueue(1);
    private indexing = false;
    public get lockStarted() { return this.commandQueue.locked }

    constructor(initOptions: ordInit) {
        console.log(`instances ${++instances}`)
        setInterval(async () => {
            if (this.indexing) return;
            this.indexing = true;
            await this.index()
            this.indexing = false;
        }, config.INDEX_ORD_EVERY)

        this.baseCommand = [
            initOptions.binaryPath,
            "--rpc-url", `"${initOptions.rpcURL}"`,
            "--data-dir", initOptions.dataDirectory,
            "--cookie-file", initOptions.cookiePath
        ].join(" ")

    }

    /**
     * Indexes current instance
     */
    async index(): Promise<void> {
        const command = ["index"].join(" ");
        await this.runCommand<void>(command);
    }

    /**
     * Attempts to run a specific command on the defined instance.
     * This method assumes a json response. 
     * @param command 
     * @returns Promise<T>
     * @throws stderr
     */
    async runCommand<T>(command): Promise<T | null> {
        const fullCommand = [this.baseCommand, command].join(" ");
        var out = null;
        try {
            const stdout = await this.commandQueue.execute(fullCommand)
            out = stdout;
            logger.debug(stdout);
            if (stdout?.length > 0)
                return JSON.parse(stdout)
        } catch (error) {
            if (error instanceof SyntaxError) {
                logger.debug(error);
                if (out) return out;
                return null
            }
            throw error;
        }
    }
}