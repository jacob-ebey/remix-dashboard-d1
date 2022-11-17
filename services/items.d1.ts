import { type Item, type ItemsService } from "~/services";

declare global {
	var __MOCK_ITEMS__: Item[];
}

export class D1ItemsService implements ItemsService {
	constructor(private db: D1Database) {}

	async getAllItems() {
		const result = await this.db
			.prepare("SELECT `id`, `label` FROM `Item`;")
			.all<{
				id: number;
				label: string;
			}>();

		if (result.error || !result.results) {
			throw new Error(result.error || "Failed to query items.");
		}

		return result.results.map((item) => ({
			id: "" + item.id,
			label: item.label,
		}));
	}
	async getItemById(id: string) {
		const result = await this.db
			.prepare("SELECT `id`, `label` FROM `Item` WHERE `id` = ?;")
			.bind(id)
			.first<{ id: number; label: string }>();

		return result
			? {
					id: "" + result.id,
					label: result.label,
			  }
			: undefined;
	}
	async createItem({ label }: { label: string }) {
		const result = await this.db
			.prepare("INSERT INTO `Item` (`label`) VALUES (?) RETURNING `id`;")
			.bind(label)
			.first<{ id: number }>();
		const createdId = result?.id;

		if (typeof createdId !== "number") {
			throw new Error("Failed to create item.");
		}

		return "" + createdId;
	}
	async deleteItemById(id: string) {
		const result = await this.db
			.prepare("DELETE FROM `Item` WHERE `id` = ?;")
			.bind(id)
			.run();

		// `changes` is not yet implemented in the D1 alpha
		// if (!result.changes) {
		// 	throw new Error("Failed to delete item.");
		// }
	}
}
