import { redirect, type LoaderArgs } from "@remix-run/cloudflare";

import * as utils from "~/utils";

export async function loader({
	context: {
		services: { auth },
	},
	request,
}: LoaderArgs) {
	const url = new URL(request.url);
	const redirectTo = utils.getRedirectTo(url.searchParams, "/");

	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await auth.destroySession(request),
			"X-Remix-Revalidate": "1",
		},
	});
}

export async function action({
	context: {
		services: { auth },
	},
	request,
}: LoaderArgs) {
	const url = new URL(request.url);
	const redirectTo = utils.getRedirectTo(url.searchParams, "/");

	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await auth.destroySession(request),
		},
	});
}
