import { deferredType } from "./deferredType";

/**
 * Wraps any async method in a deferred promise. 
 * @param func 
 * @returns 
 */
export const deferred = <T>(
    func: () => Promise<T>
) => {
    let resolve: () => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = () => res(func());
        reject = rej;
    });

    return {
        resolve,
        reject,
        promise,
    } as deferredType<T>;
}