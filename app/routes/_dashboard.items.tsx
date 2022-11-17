import { json, type LoaderArgs } from "@remix-run/cloudflare";
import {
	Outlet,
	useLoaderData,
	type ShouldReloadFunction,
} from "@remix-run/react";

import {
	useAutoFocusSection,
	ListHeader,
	ListItem,
	ListItems,
	ListSection,
} from "~/components/dashboard";

export async function loader({
	context: {
		services: { auth, items },
	},
	request,
}: LoaderArgs) {
	const itemsPromise = items.getAllItems();

	await auth.requireUser(request);

	return json({
		items: await itemsPromise,
	});
}

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) =>
	!!submission &&
	["/login", "/logout", "/items"].some((pathname) =>
		submission.action.startsWith(pathname)
	);

export default function Items() {
	useAutoFocusSection(/^\/items\/?$/i, "dashboard-items");

	const { items } = useLoaderData<typeof loader>();

	return (
		<>
			<ListSection id="dashboard-items">
				<ListHeader
					label="Items"
					menu="dashboard-menu"
					actions={[
						{
							label: "New Item",
							icon: "🆕",
							to: "new",
						},
					]}
				/>

				<ListItems>
					{items.map(({ id, label }) => (
						<ListItem key={id} to={`item/${id}`}>
							{label}
						</ListItem>
					))}
				</ListItems>
			</ListSection>

			<Outlet />
		</>
	);
}
