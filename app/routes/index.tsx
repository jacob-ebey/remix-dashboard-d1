import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { buttonStyles } from "~/components/buttons";

export async function loader({
	context: {
		services: { auth },
	},
	request,
}: LoaderArgs) {
	const user = await auth.getUser(request);

	return json({ loggedIn: !!user });
}

export default function Home() {
	const { loggedIn } = useLoaderData<typeof loader>();
	return (
		<main className="h-screen w-screen flex flex-col gap-4 items-center justify-center max-w-md mx-auto">
			<h1 className="text-4xl">Remix Dashboard Starter</h1>

			<p>A simple dashboard starter to get you up and running.</p>

			{loggedIn ? (
				<Link to="items" className={buttonStyles()}>
					Dashboard
				</Link>
			) : (
				<Form action={`/login?redirectTo=/`} method="post">
					<button className={buttonStyles()}>Login with GitHub</button>
				</Form>
			)}
		</main>
	);
}
