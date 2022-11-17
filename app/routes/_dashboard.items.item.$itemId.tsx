import {
	json,
	redirect,
	type ActionArgs,
	type LoaderArgs,
} from "@remix-run/cloudflare";
import {
	Form,
	useLoaderData,
	useSearchParams,
	type ShouldReloadFunction,
} from "@remix-run/react";
import { buttonStyles } from "~/components/buttons";

import {
	useAutoFocusSection,
	ConfirmationDialog,
	DetailsHeader,
	DetailsSection,
} from "~/components/dashboard";

export async function loader({
	context: {
		services: { auth, items },
	},
	params,
	request,
}: LoaderArgs) {
	const [item] = await Promise.all([
		items.getItemById(params.itemId!),
		auth.requireUser(request),
	]);

	if (!item) {
		throw json("Item not found", { status: 404 });
	}

	return json({ item });
}

export async function action({
	context: {
		services: { auth, items },
	},
	params,
	request,
}: ActionArgs) {
	const [formData] = await Promise.all([
		request.formData(),
		auth.requireUser(request),
	]);

	switch (formData.get("intent")) {
		case "delete":
			await items.deleteItemById(params.itemId!);
			return redirect("/items");
		default:
			return json(null, 400);
	}
}

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) =>
	!!submission &&
	["/login", "/logout", "/items"].some((pathname) =>
		submission.action.startsWith(pathname)
	);

export default function Item() {
	useAutoFocusSection(/^\/items\/./i, "dashboard-item");

	const { item } = useLoaderData<typeof loader>();
	const [searchParams] = useSearchParams();

	const confirmDelete = searchParams.has("delete");

	return (
		<DetailsSection id="dashboard-item">
			<DetailsHeader
				label={item.label}
				actions={[
					{
						label: "Delete Item",
						icon: "🗑",
						to: "?delete",
					},
				]}
			/>

			<div className="p-2">
				<button
					key={item.id}
					autoFocus={!confirmDelete}
					className={buttonStyles()}
				>
					Auto-focused
				</button>
			</div>

			{confirmDelete && (
				<>
					<ConfirmationDialog
						id="dashboard-item-delete-dialog"
						title="Delete Item?"
						confirmForm="dashboard-item-delete-form"
						confirmLabel="Delete"
						denyLabel="Cancel"
					/>
					<Form method="post" id="dashboard-item-delete-form">
						<input type="hidden" name="intent" value="delete" />
					</Form>
				</>
			)}
		</DetailsSection>
	);
}
