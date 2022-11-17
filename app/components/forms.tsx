import {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	type ForwardedRef,
	type HTMLProps,
	type ReactNode,
} from "react";
import { json } from "@remix-run/server-runtime";
import {
	Form,
	type FetcherWithComponents,
	type FormProps,
} from "@remix-run/react";
import { type ZodError, type ZodFormattedError } from "zod";

export function createErrorResponse(
	error: ZodError,
	restorableFields: string[],
	formData: FormData,
	status: number = 400
) {
	const restorableFieldSet = new Set(restorableFields);

	const restorable: [string, string][] = [];
	for (const [field, value] of formData.entries()) {
		if (restorableFieldSet.has(field) && typeof value == "string") {
			restorable.push([field, value]);
		}
	}

	return json(
		{
			errors: error.format(),
			restorable,
		},
		status
	);
}

function createStorageKey(form: HTMLFormElement) {
	return `draft:${form.id || form.action}:${form.method}`;
}

export function discardDraft(form: HTMLFormElement | null | undefined) {
	if (!form) return;

	const storageKey = createStorageKey(form);
	localStorage.removeItem(storageKey);
}

const FormContext = createContext<{
	errors?: ZodFormattedError<any>;
	restoredFormData?: URLSearchParams;
}>({});

function DraftFormImp(
	{
		onChange: _onChange,
		errors,
		fetcher,
		restorable,
		children,
		...rest
	}: FormProps & {
		fetcher?: FetcherWithComponents<any>;
		errors?: ZodFormattedError<any>;
		restorable?: [string, string][];
	},
	forwardedRef: ForwardedRef<HTMLFormElement>
) {
	const restoredFormData = useMemo(() => {
		const formData = new URLSearchParams();
		if (!restorable) return;
		for (const [field, value] of restorable) {
			formData.append(field, value);
		}
		return formData;
	}, [restorable]);

	const ref = useRef<HTMLFormElement | null>(null);
	const refCallback = useCallback(
		(form: HTMLFormElement | null) => {
			switch (typeof forwardedRef) {
				case "function":
					forwardedRef(form);
					break;
				case "object":
					if (forwardedRef) {
						forwardedRef.current = form;
					}
					break;
			}

			ref.current = form;
		},
		[forwardedRef]
	);

	const timeoutRef = useRef<number | NodeJS.Timeout | null>(null);
	const onChange = useCallback<NonNullable<typeof _onChange>>(
		(event) => {
			if (_onChange) {
				_onChange(event);
			}
			if (event.defaultPrevented) {
				return;
			}

			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}

			timeoutRef.current = setTimeout(() => {
				const form = ref.current;
				if (!form) return;

				const formData = new FormData(form);

				const toSave = Array.from(formData.entries());
				const storageKey = createStorageKey(form);

				// TODO: Try catch this and surface error message to user
				localStorage.setItem(storageKey, JSON.stringify(toSave));
			}, 200);
		},
		[ref, _onChange]
	);

	useEffect(() => {
		const form = ref.current;
		if (!form) return;

		const storageKey = createStorageKey(form);
		const draft = localStorage.getItem(storageKey);
		if (draft) {
			const entries = JSON.parse(draft);
			for (const [name, value] of entries) {
				const input = form.elements.namedItem(name);
				if (input instanceof HTMLInputElement) {
					if (input.type == "checkbox") {
						input.checked = value == "on";
					} else if (input.type == "radio") {
						if (input.value == value) {
							input.checked = true;
						}
					} else {
						input.value = value;
					}
				} else if (input instanceof HTMLTextAreaElement) {
					input.value = value;
				} else if (input instanceof HTMLSelectElement) {
					input.value = value;
				}
			}
		}
	}, [ref]);

	const FormComp = fetcher ? fetcher.Form : Form;

	return (
		<FormContext.Provider
			value={{
				errors: errors as ZodFormattedError<{}>,
				restoredFormData,
			}}
		>
			<FormComp {...rest} onChange={onChange} ref={refCallback}>
				{children}
			</FormComp>
		</FormContext.Provider>
	);
}

export const DraftForm = forwardRef(DraftFormImp);

function TextInputImp(
	{
		id,
		name,
		defaultValue,
		children,
		...rest
	}: Omit<HTMLProps<HTMLInputElement>, "type"> & { children: ReactNode },
	forwardedRef: ForwardedRef<HTMLInputElement>
) {
	const { errors, restoredFormData } = useContext(FormContext);
	const error =
		name && errors
			? (errors as ZodFormattedError<{ [key: typeof name]: string }>)[name]
			: undefined;
	const restoredValue =
		restoredFormData && name ? restoredFormData.get(name) : undefined;
	const ariaLabeledBy = id && error ? `${id}-label` : undefined;

	return (
		<label htmlFor={id} className="block mb-3 last:mb-0">
			<span className="block">{children}</span>
			<input
				type="text"
				{...rest}
				ref={forwardedRef}
				id={id}
				name={name}
				defaultValue={restoredValue || defaultValue}
				aria-labelledby={ariaLabeledBy}
				className="block w-full px-2 py-1 border bg-white dark:bg-black"
			/>
			{error && error._errors && error._errors.length > 0 && (
				<ul
					id={ariaLabeledBy}
					className="text-sm text-red-600 dark:text-red-400"
				>
					{error._errors.map((error, index) => (
						<li key={index + error}>{error}</li>
					))}
				</ul>
			)}
		</label>
	);
}

export const TextInput = forwardRef(TextInputImp);
