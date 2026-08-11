export interface JournalLineInput {
    accountId: string;
    debitAmount: number;
    creditAmount: number;
    memo?: string;
}

export class PostingEngine {
    static validateDoubleEntry(lines: JournalLineInput[]) {
        if (!lines || lines.length < 2) {
            throw new Error('Double-entry journal must contain at least 2 lines (1 Debit and 1 Credit)');
        }

        let totalDebit = 0;
        let totalCredit = 0;

        for (const line of lines) {
            const dr = line.debitAmount || 0;
            const cr = line.creditAmount || 0;

            if (dr < 0 || cr < 0) {
                throw new Error('Debit and Credit amounts must be non-negative');
            }
            if (dr > 0 && cr > 0) {
                throw new Error('A single journal line cannot contain both Debit and Credit amounts');
            }

            totalDebit += dr;
            totalCredit += cr;
        }

        const difference = Math.abs(totalDebit - totalCredit);
        if (difference > 0.001) {
            throw new Error(`Double-entry balance violation: Total Debits (${totalDebit.toFixed(2)}) !== Total Credits (${totalCredit.toFixed(2)})`);
        }

        return {
            totalDebit: Number(totalDebit.toFixed(2)),
            totalCredit: Number(totalCredit.toFixed(2)),
        };
    }
}
