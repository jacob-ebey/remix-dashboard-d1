import { useEffect, useRef, useState } from "react";
import {
	redirect,
	type ActionArgs,
	type LoaderArgs,
} from "@remix-run/cloudflare";
import { useActionData, useLocation, useTransition } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { DetailsHeader, DetailsSection } from "~/components/dashboard";
import {
	createErrorResponse,
	discardDraft,
	DraftForm,
	TextInput,
} from "~/components/forms";
import { buttonStyles } from "~/components/buttons";

const restorableFields = ["label"];
const schema = zfd.formData({
	label: zfd.text(
		z
			.string()
			.transform((s) => s.trim())
			.refine((s) => s.length > 0, "Can't be just whitespace characters")
	),
});

export async function loader({
	context: {
		services: { auth },
	},
	request,
}: LoaderArgs) {
	await auth.requireUser(request);
	return null;
}

export async function action({
	context: {
		services: { auth, items },
	},
	request,
}: ActionArgs) {
	const [formData] = await Promise.all([
		request.formData(),
		auth.requireUser(request),
	]);
	const parseResult = schema.safeParse(formData);

	if (!parseResult.success) {
		return createErrorResponse(parseResult.error, restorableFields, formData);
	}

	const itemId = await items.createItem({ label: parseResult.data.label });

	return redirect(`/items/item/${itemId}`);
}

export default function NewItem() {
	const { errors, restorable } = useActionData<typeof action>() || {};
	const [formKey, setFormKey] = useState(0);
	const formRef = useRef<HTMLFormElement>(null);

	const location = useLocation();
	const transition = useTransition();
	useEffect(() => {
		const form = formRef.current;
		return () => {
			if (
				transition.state == "loading" &&
				transition.type == "actionRedirect" &&
				transition.submission.action == location.pathname
			) {
				discardDraft(form);
			}
		};
	}, [transition, location]);

	return (
		<DetailsSection id="dashboard-new-item">
			<DetailsHeader
				label="New Item"
				actions={[
					{
						label: "Discard Draft",
						icon: "🚮",
						onClick: (event) => {
							discardDraft(formRef.current);
							setFormKey((key) => key + 1);
							event.preventDefault();
						},
					},
				]}
			/>

			<DraftForm
				key={formKey}
				className="p-4"
				method="post"
				id="new-item-form"
				ref={formRef}
				errors={errors}
				restorable={restorable}
			>
				<TextInput
					id="item-label-input"
					name="label"
					required
					minLength={1}
					placeholder="da label..."
					autoFocus
				>
					Label
				</TextInput>

				<button type="submit" className={buttonStyles()}>
					Create
				</button>
			</DraftForm>
		</DetailsSection>
	);
}
