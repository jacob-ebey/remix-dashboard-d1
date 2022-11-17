import { type Item, type ItemsService } from "~/services";

declare global {
	var __MOCK_ITEMS__: Item[];
}

export class MockItemsService implements ItemsService {
	constructor() {
		global.__MOCK_ITEMS__ = global.__MOCK_ITEMS__ || [
			{
				id: "1",
				label: "Item 1",
			},
			{
				id: "2",
				label: "Item 2",
			},
			{
				id: "3",
				label: "Item 3",
			},
		];
	}

	async getAllItems() {
		return global.__MOCK_ITEMS__;
	}
	async getItemById(id: string) {
		return global.__MOCK_ITEMS__.find((item) => item.id == id);
	}
	async createItem({ label }: { label: string }) {
		const id = String(Date.now());
		global.__MOCK_ITEMS__.push({
			id,
			label,
		});
		return id;
	}
	async deleteItemById(id: string) {
		global.__MOCK_ITEMS__ = global.__MOCK_ITEMS__.filter(
			(item) => item.id != id
		);
	}
}
