import { test } from "@playwright/test";

import { authenticatedGoTo } from "./test-utils";

test("can create and delete item", async ({ page }) => {
	await authenticatedGoTo(page, "/items", "#dashboard-items");

	const newItemLink = await page.getByRole("link", { name: "New Item" });
	await newItemLink.click();

	const newItemForm = await page.waitForSelector("#new-item-form");

	const labelInput = await newItemForm.waitForSelector(`input[name="label"]`);
	const itemLabel = `Item ${Date.now()}`;
	await labelInput.fill(itemLabel);

	const submitButton = await newItemForm.waitForSelector(
		`button[type="submit"]`
	);
	await submitButton.click();

	await page.waitForSelector("#dashboard-item");

	const deleteLink = await page.getByRole("link", { name: "Delete Item" });
	await deleteLink.click();

	const deleteDialog = await page.waitForSelector(
		"#dashboard-item-delete-dialog"
	);

	const confirmButton = await deleteDialog.waitForSelector(
		`button[type="submit"]`
	);
	await confirmButton.click();

	await page.waitForSelector("#dashboard-item", { state: "detached" });
});
