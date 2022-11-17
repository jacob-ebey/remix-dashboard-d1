import { test } from "@playwright/test";

test("can login with github from home page", async ({ page }) => {
	await page.goto("/");
	const loginButton = await page.getByRole("button", {
		name: "Login with GitHub",
	});
	await loginButton.click();
	await page.waitForSelector(`a:text("Dashboard")`);
});
