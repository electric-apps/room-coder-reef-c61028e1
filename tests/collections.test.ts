import { describe, it, expect } from "vitest"
import { parseDates } from "./helpers/schema-test-utils"
import { todoSelectSchema } from "@/db/zod-schemas"
import { generateValidRow } from "./helpers/schema-test-utils"

describe("todoSelectSchema — JSON round-trip", () => {
	it("validates after JSON serialization and parseDates", () => {
		const row = generateValidRow(todoSelectSchema)
		const roundTripped = parseDates(JSON.parse(JSON.stringify(row)))
		const result = todoSelectSchema.safeParse(roundTripped)
		expect(result.success).toBe(true)
	})

	it("parses date strings from JSON correctly", () => {
		const row = generateValidRow(todoSelectSchema)
		const json = JSON.parse(JSON.stringify(row))
		const parsed = parseDates(json)
		const result = todoSelectSchema.safeParse(parsed)
		if (result.success) {
			expect(result.data.created_at).toBeInstanceOf(Date)
			expect(result.data.updated_at).toBeInstanceOf(Date)
		}
	})
})
