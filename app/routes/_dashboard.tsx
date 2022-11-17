import { type LoaderArgs } from "@remix-run/cloudflare";
import {
	Form,
	Outlet,
	useLocation,
	type ShouldReloadFunction,
} from "@remix-run/react";
import { buttonStyles } from "~/components/buttons";

import {
	Dashboard,
	DashboardMenu,
	DashboardMenuHeader,
	ListItem,
	ListItems,
} from "~/components/dashboard";

export async function loader({
	context: {
		services: { auth },
	},
	request,
}: LoaderArgs) {
	await auth.requireUser(request);

	return null;
}

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) =>
	!!submission &&
	["/login", "/logout"].some((pathname) =>
		submission.action.startsWith(pathname)
	);

export default function DashboardLayout() {
	const location = useLocation();

	const redirectTo = encodeURIComponent(location.pathname + location.search);

	return (
		<>
			<Dashboard>
				<DashboardMenu id="dashboard-menu" menu="dashboard-menu">
					<DashboardMenuHeader label="Menu" menu="dashboard-menu" />

					<ListItems>
						<ListItem to="items">Items</ListItem>
					</ListItems>

					<hr />

					<footer className="p-2 text-center">
						<Form action={`/logout?redirectTo=${redirectTo}`} method="post">
							<button
								className={buttonStyles({
									full: true,
									uniform: true,
								})}
							>
								Logout
							</button>
						</Form>
					</footer>
				</DashboardMenu>

				<Outlet />
			</Dashboard>
		</>
	);
}
