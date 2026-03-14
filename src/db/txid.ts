import { sql } from "drizzle-orm";

/**
 * Like generateTxId from utils.ts but returns the raw string from Postgres,
 * preserving all 64 bits of the xid8 value without parseInt precision loss.
 */
// biome-ignore lint/suspicious/noExplicitAny: Drizzle transaction type varies by driver
export async function getTxIdStr(tx: any): Promise<string> {
	const result = await tx.execute(
		sql`SELECT pg_current_xact_id()::text as txid`,
	);
	const txid = result[0]?.txid;
	if (txid === undefined) throw new Error("Failed to get transaction ID");
	return txid as string;
}
