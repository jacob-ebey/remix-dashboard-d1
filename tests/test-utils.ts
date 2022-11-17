import { type Page } from "@playwright/test";

export async function authenticatedGoTo(
	page: Page,
	url: string,
	selector: string
) {
	await page.goto(url, { waitUntil: "networkidle" });

	const readyPromise = page.waitForSelector(selector);

	const loginForm = await page.$("#login-with-github-form");
	if (loginForm) {
		const loginButton = await loginForm.$("button");
		await loginButton!.click();
	}

	await readyPromise;
}
