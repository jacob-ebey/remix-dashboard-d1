const { PrismaClient } = require("@prisma/client");

async function seed() {
	const client = new PrismaClient();
	const itemsCount = await client.item.count();
	if (!itemsCount) {
		await client.item.create({
			data: {
				label: "Item 1",
			},
		});
		await client.item.create({
			data: {
				label: "Item 2",
			},
		});
		await client.item.create({
			data: {
				label: "Item 3",
			},
		});
	}
}

seed().then(
	() => {
		process.exit(0);
	},
	(reason) => {
		console.error(reason);
		process.exit(1);
	}
);
