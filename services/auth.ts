import {
	redirect,
	createCookieSessionStorage,
	type SessionStorage,
} from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { type AuthService, type User } from "~/services";

export class RemixAuthService implements AuthService {
	public authenticator: Authenticator<User>;
	private sessionStorage: SessionStorage;

	constructor(secrets: string[]) {
		this.sessionStorage = createCookieSessionStorage({
			cookie: {
				name: "auth",
				httpOnly: true,
				path: "/",
				sameSite: "lax",
				secrets,
			},
		});

		this.authenticator = new Authenticator<User>(this.sessionStorage);
		this.authenticator.use(
			new FormStrategy<User>(async ({ form, context }) => {
				return { id: "1" };
			}),
			"mock"
		);
	}

	async getUser(request: Request) {
		const cookie = request.headers.get("Cookie");
		const session = await this.sessionStorage.getSession(cookie);
		const user = await this.authenticator.isAuthenticated(session);
		return user || undefined;
	}

	async requireUser(request: Request) {
		const user = await this.getUser(request);

		if (!user) {
			const url = new URL(request.url);
			const redirectTo = url.pathname + url.search;

			const searchParams = new URLSearchParams({
				redirectTo,
			});

			throw redirect(`/login?${searchParams.toString()}`);
		}

		return user;
	}

	async destroySession(request: Request) {
		const cookie = request.headers.get("Cookie");
		const session = await this.sessionStorage.getSession(cookie);

		return await this.sessionStorage.destroySession(session, {
			secure: request.url.startsWith("https://"),
		});
	}
}
