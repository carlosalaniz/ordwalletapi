import { randomUUID } from "crypto";
import { deferred } from "./deferred";
import { deferredType } from "./deferredType";
import logger from "./logger";
import { sleep } from "./sleep";
import { promisify } from 'util'
import { exec } from 'child_process'
const execPromise = promisify(exec);

export class CommandQueue {
    #locked = null;
    private set locked(date: Date) { this.#locked = date; }
    public get locked() { return this.#locked }

    private queue:
        { [key: string]: deferredType<any> } = {};
    constructor(private maxParallelCommands) {
        this.runner()
    }

    /**
     * This method runs X number of tasks concurrently on each iteration
     */
    private async runner() {
        while (true) {
            const queueSize = Object.keys(this.queue).length;
            if (Object.keys(this.queue).length === 0) {
                // If no commands, wait 500ms and check again.
                // low wait times reduces the changes of an oversize queue or 
                // big latency times.
                await sleep(500);
                continue;
            }
            this.locked = new Date();
            logger.debug("CommandQueue", queueSize)
            // Pick the commands that will be run in this iteration
            const parallelCommands =
                Object.entries(this.queue).slice(0, this.maxParallelCommands);

            // Start them 
            for (const [_, queueItem] of parallelCommands) {
                queueItem.resolve();
            }
            // Wait for all of them to be completed.
            const promises = parallelCommands.map(c => c[1].promise);

            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#description
            try{
                await Promise.all(promises);
            }catch(e){
               // Do nothing, the exception should be handled upstream, run command will catch it too.
            }
            for (const [queueKey, _] of parallelCommands) {
                // remove the commands from the queue.
                delete this.queue[queueKey]
            }

            this.locked = null
        }
    }

    /**
     * This method takes the command to be executed and wraps it in
     * a deferred promise. This promise will be started by the runner method
     * above. This promise resolves with stdout as a string or throws
     * stderr as a string;
     * @param command 
     * @returns stdout String
     * @throws stderr String
     */
    async execute(command: string): Promise<string> {
        logger.debug("execute", command);
        const id = randomUUID();
        this.queue[id] = deferred<any>(
            async () => {
                try {
                    const { stdout, stderr } = await execPromise(command)
                    if (stderr) throw stderr;
                    return stdout;
                } catch (e) {
                    console.log(e);
                    throw e;
                }
            }
        );
        // logger.debug(`queue size: ${Object.keys(this.queue).length}`)
        const result = await this.queue[id].promise;
        // logger.debug(result);
        return result;
    }
}