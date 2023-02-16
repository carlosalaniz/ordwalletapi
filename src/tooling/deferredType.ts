export type deferredType<T> = {
    resolve: () => void;
    reject: (reason?: any) => void;
    promise: Promise<T>;
}