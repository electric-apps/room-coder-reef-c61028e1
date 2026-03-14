import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { getTxIdStr } from "@/db/txid";
import { todoSelectSchema } from "@/db/zod-schemas";

export const Route = createFileRoute("/api/mutations/todos/$id")({
	server: {
		handlers: {
			PATCH: async ({
				request,
				params,
			}: {
				request: Request;
				params: { id: string };
			}) => {
				const raw = await request.json();
				const parsed = todoSelectSchema.safeParse(raw);
				if (!parsed.success) {
					return Response.json({ error: "Invalid input" }, { status: 400 });
				}
				const body = parsed.data;
				const txid = await db.transaction(async (tx) => {
					await tx
						.update(todos)
						.set({
							title: body.title,
							completed: body.completed,
							updated_at: body.updated_at ?? new Date(),
						})
						.where(eq(todos.id, params.id));
					return getTxIdStr(tx);
				});
				return Response.json({ txid });
			},
			DELETE: async ({ params }: { params: { id: string } }) => {
				const txid = await db.transaction(async (tx) => {
					await tx.delete(todos).where(eq(todos.id, params.id));
					return getTxIdStr(tx);
				});
				return Response.json({ txid });
			},
		},
	},
});
