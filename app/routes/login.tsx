import { type LoaderArgs } from "@remix-run/cloudflare";
import { Form, Link, useSearchParams } from "@remix-run/react";

import * as utils from "~/utils";

// Simulate a login
export async function action({
	context: {
		services: { auth },
	},
	request,
}: LoaderArgs) {
	const url = new URL(request.url);
	const redirectTo = utils.getRedirectTo(url.searchParams, "/");

	await auth.authenticator.authenticate("mock", request, {
		successRedirect: redirectTo,
	});

	return null;
}

export default function Login() {
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirectTo") || "/items";

	return (
		<main className="h-screen w-screen flex flex-col gap-4 items-center justify-center max-w-md mx-auto">
			<Form
				id="login-with-github-form"
				action={`/login?redirectTo=${redirectTo}`}
				method="post"
			>
				<button className="block text-center px-4 py-2 hover:outline">
					Login with GitHub
				</button>
			</Form>
			<Link to="/" className="block text-center px-4 py-2 hover:outline">
				Go back home
			</Link>
		</main>
	);
}
