import {
	Box,
	Button,
	Card,
	Checkbox,
	Container,
	Flex,
	Heading,
	IconButton,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCheck, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { todosCollection } from "@/db/collections/todos";

export const Route = createFileRoute("/")({
	ssr: false,
	loader: async () => {
		await todosCollection.preload();
		return null;
	},
	component: TodoPage,
});

type Filter = "all" | "active" | "completed";

function TodoPage() {
	const [input, setInput] = useState("");
	const [filter, setFilter] = useState<Filter>("all");

	const { data: allTodos } = useLiveQuery(
		(q) =>
			q
				.from({ todo: todosCollection })
				.orderBy(({ todo }) => todo.created_at, "asc"),
		[],
	);

	const todos = allTodos.filter((t) => {
		if (filter === "active") return !t.completed;
		if (filter === "completed") return t.completed;
		return true;
	});

	const activeCount = allTodos.filter((t) => !t.completed).length;

	const handleAdd = () => {
		const title = input.trim();
		if (!title) return;
		const now = new Date();
		todosCollection.insert({
			id: crypto.randomUUID(),
			title,
			completed: false,
			created_at: now,
			updated_at: now,
		});
		setInput("");
	};

	const handleToggle = (id: string, completed: boolean) => {
		todosCollection.update(id, (draft) => {
			draft.completed = !completed;
			draft.updated_at = new Date();
		});
	};

	const handleDelete = (id: string) => {
		todosCollection.delete(id);
	};

	const handleClearCompleted = () => {
		for (const todo of allTodos.filter((t) => t.completed)) {
			todosCollection.delete(todo.id);
		}
	};

	return (
		<Container size="2" py="8">
			<Flex direction="column" gap="5">
				<Heading size="8" align="center">
					Todos
				</Heading>

				{/* Input */}
				<Flex gap="2">
					<TextField.Root
						placeholder="What needs to be done?"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleAdd()}
						size="3"
						style={{ flex: 1 }}
					/>
					<Button size="3" onClick={handleAdd} disabled={!input.trim()}>
						<Plus size={16} />
						Add
					</Button>
				</Flex>

				{/* Filter tabs */}
				<Flex gap="2" justify="center">
					{(["all", "active", "completed"] as Filter[]).map((f) => (
						<Button
							key={f}
							variant={filter === f ? "solid" : "ghost"}
							size="2"
							onClick={() => setFilter(f)}
						>
							{f.charAt(0).toUpperCase() + f.slice(1)}
						</Button>
					))}
				</Flex>

				{/* Todo list */}
				<Card variant="surface">
					{todos.length === 0 ? (
						<Flex py="6" justify="center" align="center">
							<Text color="gray" size="2">
								{filter === "completed"
									? "No completed todos yet"
									: filter === "active"
										? "No active todos — all done!"
										: "Add a todo above to get started"}
							</Text>
						</Flex>
					) : (
						<Flex direction="column">
							{todos.map((todo, idx) => (
								<Box
									key={todo.id}
									style={{
										borderBottom:
											idx < todos.length - 1
												? "1px solid var(--gray-a4)"
												: undefined,
									}}
								>
									<Flex align="center" gap="3" px="3" py="3">
										<Checkbox
											checked={todo.completed}
											onCheckedChange={() =>
												handleToggle(todo.id, todo.completed)
											}
											size="2"
										/>
										<Text
											size="3"
											style={{
												flex: 1,
												textDecoration: todo.completed
													? "line-through"
													: undefined,
												color: todo.completed ? "var(--gray-9)" : undefined,
											}}
										>
											{todo.title}
										</Text>
										<IconButton
											variant="ghost"
											color="red"
											size="1"
											onClick={() => handleDelete(todo.id)}
										>
											<Trash2 size={14} />
										</IconButton>
									</Flex>
								</Box>
							))}
						</Flex>
					)}
				</Card>

				{/* Footer */}
				{allTodos.length > 0 && (
					<Flex justify="between" align="center">
						<Text size="1" color="gray">
							{activeCount} item{activeCount !== 1 ? "s" : ""} left
						</Text>
						{allTodos.some((t) => t.completed) && (
							<Button
								variant="ghost"
								size="1"
								color="gray"
								onClick={handleClearCompleted}
							>
								<CheckCheck size={12} />
								Clear completed
							</Button>
						)}
					</Flex>
				)}
			</Flex>
		</Container>
	);
}
