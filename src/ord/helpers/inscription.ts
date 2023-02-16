/**
 * Inscription query result
 */
export class Inscription {
    /** Example: "bebefd42cf76983bdd24df8dfd565b816a049ef78b1dd5c5797b7be3bb8fd9c1i0"*/
    inscription: string;
    /** Example: "bebefd42cf76983bdd24df8dfd565b816a049ef78b1dd5c5797b7be3bb8fd9c1:0:0"*/
    location: string;
    /** Example: "https://ordinals.com/inscription/bebefd42cf76983bdd24df8dfd565b816a049ef78b1dd5c5797b7be3bb8fd9c1i0"*/
    explorer: string;
}

/**
 * Represents a raw, unsigned bitcoin transactions
 */
export class BTCTransaction {
    version: number;
    lock_time: number;
    input: {
        previous_output: string,
        script_sig: string,
        sequence: number,
        witness: string[]
    }[];
    output: {
        value: number,
        script_pubkey: string
    }[]
}

/**
 * Inscription creation result.
 */
export class InscriptionCreationResult {
    commit_tx?: BTCTransaction;
    reveal_tx?: BTCTransaction;

    /** Example: "43a719dc2a5113df2a59c9b84a28e9c8a6f880e7c88c89a61f0980fe20843cb0"*/
    commit: string;
    /** Example: "81171dd249c959afec82221ad7467cf52b37f76a1d78e0ed2999528937b9340bi0"; */
    inscription: string;
    /** Example: "81171dd249c959afec82221ad7467cf52b37f76a1d78e0ed2999528937b9340b"; */
    reveal: string;
    /** Example: 9360; */
    fees: number
}
