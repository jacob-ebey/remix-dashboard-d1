import {
	useEffect,
	useRef,
	type HTMLAttributes,
	type MouseEvent,
	type ReactNode,
} from "react";
import {
	Link,
	NavLink,
	useHref,
	useLocation,
	useMatches,
	useNavigate,
	useSearchParams,
	useTransition,
	type NavLinkProps,
} from "@remix-run/react";
import cn from "clsx";
import { buttonStyles } from "./buttons";

const FOCUSABLE_ELEMENTS_SELECTOR = `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`;

type BaseHeaderAction = {
	label: string;
	icon: string;
};

type LinkHeaderAction = BaseHeaderAction & {
	to: string;
};

type ButtonHeaderAction = BaseHeaderAction & HTMLAttributes<HTMLButtonElement>;

type HeaderAction = LinkHeaderAction | ButtonHeaderAction;

export function Dashboard({ children }: { children: ReactNode }) {
	return (
		<div
			id="dashboard-layout"
			className="flex w-screen h-screen overflow-hidden"
		>
			{children}
		</div>
	);
}

export function DashboardMenu({
	children,
	id,
	menu,
}: {
	children: ReactNode;
	id: string;
	menu: string;
}) {
	const [searchParams] = useSearchParams();
	const matches = useMatches();

	const menuOpen = searchParams.get("open") == menu;
	const hiddenSooner = matches.length > 3;

	return (
		<section
			id={id}
			className={cn(
				"flex-col absolute inset-0 overflow-y-hidden md:w-56 lg:w-64 md:border-r",
				"bg-white dark:bg-black",
				hiddenSooner ? "lg:flex lg:relative" : "md:flex md:relative",
				{
					hidden: !menuOpen,
					flex: menuOpen,
					"z-10": menuOpen,
				}
			)}
			data-section
		>
			<focus-trap
				class="relative flex flex-col flex-1 overflow-y-hidden"
				trapped={menuOpen ? "true" : undefined}
			>
				{children}

				<button
					className="z-10 flex absolute bottom-0 left-0 right-0 py-4 justify-center items-center w-0 h-0 overflow-hidden focus:w-auto focus:h-auto bg-white dark:bg-black"
					onClick={jumpToTopOfSection}
				>
					Jump to top of section
				</button>
			</focus-trap>
		</section>
	);
}

export function DashboardMenuHeader({
	label,
	menu,
}: {
	label: string;
	menu: string;
}) {
	const location = useLocation();
	const [searchParams] = useSearchParams();

	const menuOpen = searchParams.get("open") == menu;

	const closeMenuSearchParams = new URLSearchParams(searchParams);
	closeMenuSearchParams.delete("open");
	const closeMenuTo = useHref({
		...location,
		search: closeMenuSearchParams.toString(),
	});

	const matches = useMatches();
	const hiddenSooner = matches.length > 3;

	return (
		<header
			className="relative flex items-center gap-2 px-2 border-b"
			data-section
		>
			<Link
				to={closeMenuTo}
				title="Close Menu"
				className={cn(
					"flex items-center justify-center p-2",
					menuOpen ? "" : hiddenSooner ? "lg:hidden" : "md:hidden"
				)}
			>
				<span aria-hidden>❌</span>
				<span className="sr-only">Close Menu</span>
			</Link>

			<h1 className="flex-1 py-4 text-lg ml-2">{label}</h1>

			<button
				className={cn(
					"z-10 hidden absolute inset-0 justify-center items-center w-0 h-0 overflow-hidden focus:w-auto focus:h-auto bg-white dark:bg-black",
					menuOpen ? "lg:flex" : "md:flex"
				)}
				onClick={jumpToNextSection}
			>
				Jump to next section
			</button>
		</header>
	);
}

export function ListSection({
	children,
	id,
}: {
	children: ReactNode;
	id: string;
}) {
	const matches = useMatches();
	const hiddenSooner = matches.length > 3;

	return (
		<section
			id={id}
			className={cn(
				"relative flex-col last:flex-1 md:w-56 lg:w-64 border-r last:border-r-0",
				hiddenSooner ? "hidden md:flex" : "flex"
			)}
			data-section
		>
			{children}

			<button
				className="z-10 flex absolute bottom-0 left-0 right-0 py-4 justify-center items-center w-0 h-0 overflow-hidden focus:w-auto focus:h-auto bg-white dark:bg-black"
				onClick={jumpToTopOfSection}
			>
				Jump to top of section
			</button>
		</section>
	);
}

export function ListHeader({
	label,
	menu,
	actions,
}: {
	label: string;
	menu: string;
	actions?: HeaderAction[];
}) {
	const location = useLocation();
	const [searchParams] = useSearchParams();

	const openMenuSearchParams = new URLSearchParams(searchParams);
	openMenuSearchParams.set("open", menu);
	const openMenuTo = useHref({
		...location,
		search: openMenuSearchParams.toString(),
	});

	const matches = useMatches();
	const hasDetailsSection = matches.length > 3;

	return (
		<header className="relative flex items-center gap-2 px-2 border-b">
			<Link
				to={openMenuTo}
				title={"Open Menu"}
				className={cn(
					"flex items-center justify-center p-2",
					hasDetailsSection ? "lg:hidden" : "md:hidden"
				)}
			>
				<span aria-hidden>➡️</span>
				<span className="sr-only">Open Menu</span>
			</Link>

			<h1 className="flex-1 py-4 text-lg ml-2">{label}</h1>
			{actions && (
				<menu className="flex items-center justify-center gap-2">
					{actions.map(({ label, icon, ...rest }) =>
						"to" in rest ? (
							<Link
								key={label}
								to={rest.to}
								title={label}
								aria-label={label}
								className="p-2"
							>
								{icon}
							</Link>
						) : (
							<button
								key={label}
								type="submit"
								{...rest}
								title={label}
								aria-label={label}
								className="p-2"
							>
								{icon}
							</button>
						)
					)}
				</menu>
			)}

			{hasDetailsSection && (
				<button
					className="z-10 hidden md:flex absolute inset-0 justify-center items-center w-0 h-0 overflow-hidden focus:w-auto focus:h-auto bg-white dark:bg-black"
					onClick={jumpToNextSection}
				>
					Jump to next section
				</button>
			)}
		</header>
	);
}

export function ListItems({ children }: { children: ReactNode }) {
	return (
		<div className="flex-1 overflow-y-auto p-2">
			<ul className="flex flex-col gap-2">{children}</ul>
		</div>
	);
}

export function ListItem({ children, className, ...rest }: NavLinkProps) {
	return (
		<li>
			<NavLink
				{...rest}
				className={(args) =>
					cn(
						"block p-2 hover:outline",
						args.isActive && "underline",
						typeof className == "function" ? className(args) : className
					)
				}
			>
				{children}
			</NavLink>
		</li>
	);
}

export function DetailsSection({
	children,
	id,
}: {
	children: ReactNode;
	id: string;
}) {
	return (
		<main id={id} className="flex-1 relative" data-section>
			{children}

			<button
				className="z-10 flex absolute bottom-0 left-0 right-0 py-4 justify-center items-center w-0 h-0 overflow-hidden focus:w-auto focus:h-auto bg-white dark:bg-black"
				onClick={jumpToTopOfSection}
			>
				Jump to top of section
			</button>
		</main>
	);
}

export function DetailsHeader({
	label,
	actions,
}: {
	label: string;
	actions?: HeaderAction[];
}) {
	return (
		<header className="relative flex items-center gap-2 px-2 border-b">
			<Link
				to=".."
				title={"Close Menu"}
				className={cn("flex items-center justify-center p-2", "md:hidden")}
			>
				<span aria-hidden>❌</span>
				<span className="sr-only">Close Menu</span>
			</Link>

			<h1 className="flex-1 py-4 text-lg ml-2">{label}</h1>

			{actions && (
				<menu className="flex items-center justify-center gap-2">
					{actions.map(({ label, icon, ...rest }) =>
						"to" in rest ? (
							<Link
								key={label}
								to={rest.to}
								title={label}
								aria-label={label}
								className="p-2"
							>
								{icon}
							</Link>
						) : (
							<button
								key={label}
								type="submit"
								{...rest}
								title={label}
								aria-label={label}
								className="p-2"
							>
								{icon}
							</button>
						)
					)}
				</menu>
			)}
		</header>
	);
}

export function ConfirmationDialog({
	id,
	title,
	confirmLabel,
	confirmForm,
	denyLabel,
}: {
	id: string;
	title: string;
	confirmLabel: string;
	confirmForm: string;
	denyLabel: string;
}) {
	const navigate = useNavigate();

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key == "Escape") {
				navigate(".");
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [navigate]);

	return (
		<dialog
			id={id}
			open
			className="fixed inset-0 w-full h-full bg-[rgba(0,0,0,0.6)] text-black dark:text-white"
		>
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="bg-white dark:bg-black max-w-sm w-full border">
					<focus-trap trapped="true">
						<header className="p-2 border-b">
							<h1>{title}</h1>
						</header>
						<section className="flex justify-end gap-2 p-2">
							<button
								type="submit"
								className={buttonStyles()}
								form={confirmForm}
							>
								{confirmLabel}
							</button>
							<Link to="." className={buttonStyles()}>
								{denyLabel}
							</Link>
						</section>
					</focus-trap>
				</div>
			</div>
		</dialog>
	);
}

export function focusSection(id: string) {
	const nextSection = document.getElementById(id);
	if (!nextSection) return;
	const potentialToFocus = nextSection.querySelectorAll(
		FOCUSABLE_ELEMENTS_SELECTOR
	);

	for (const toFocus of potentialToFocus) {
		const element = toFocus as HTMLElement;
		if (
			toFocus &&
			typeof element.focus == "function" &&
			window.getComputedStyle(element).getPropertyValue("display") != "none"
		) {
			setTimeout(() => {
				element.focus();
			}, 1);
			return;
		}
	}
	setTimeout(() => {
		if (nextSection) {
			nextSection.tabIndex = 0;
			nextSection.focus();
			setTimeout(() => {
				if (nextSection) {
					nextSection.tabIndex = -1;
				}
			});
		}
	}, 1);
}

export function useAutoFocusSection(regex: RegExp, sectionId: string) {
	const location = useLocation();
	const transition = useTransition();
	const [searchParams] = useSearchParams();
	const lastPathnameRef = useRef<string | undefined>();

	const isIdle = transition.state === "idle";
	const somethingOpen = searchParams.has("open");
	useEffect(() => {
		let lastPathname = lastPathnameRef.current;
		lastPathnameRef.current = location.pathname;
		if (
			lastPathname == location.pathname ||
			somethingOpen ||
			!isIdle ||
			!regex.exec(location.pathname)
		)
			return;

		const href = document.activeElement?.getAttribute("href");
		if (
			// Nothing is focused yet
			document.activeElement === document.body ||
			// The focused element is a link to this location and
			// we're not already focused in the section
			(href &&
				regex.exec(href) &&
				!document.getElementById(sectionId)!.contains(document.activeElement))
		) {
			focusSection(sectionId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isIdle, location.pathname, somethingOpen]);
}

function jumpToNextSection(event: MouseEvent<HTMLButtonElement>) {
	let currentSection;
	let target: HTMLElement | null = event.currentTarget;
	while (target) {
		if (target.hasAttribute("data-section")) {
			currentSection = target;
			break;
		}
		target = target.parentElement;
	}

	if (!currentSection) return;

	const sections = document.querySelectorAll("[data-section]");
	let nextSection: HTMLElement | null = null;
	for (let i = 0; i < sections.length; i++) {
		const section = sections[i];
		if (section === currentSection) {
			nextSection = sections[i + 1] as HTMLElement;
			break;
		}
	}
	if (nextSection) {
		const potentialToFocus = nextSection.querySelectorAll(
			FOCUSABLE_ELEMENTS_SELECTOR
		);

		for (const toFocus of potentialToFocus) {
			const element = toFocus as HTMLElement;
			if (
				toFocus &&
				typeof element.focus == "function" &&
				window.getComputedStyle(element).getPropertyValue("display") != "none"
			) {
				setTimeout(() => {
					element.focus();
				}, 1);
				return;
			}
		}
		setTimeout(() => {
			if (nextSection) {
				nextSection.tabIndex = 0;
				nextSection.focus();
				setTimeout(() => {
					if (nextSection) {
						nextSection.tabIndex = -1;
					}
				});
			}
		}, 1);
	}
}

function jumpToTopOfSection(event: MouseEvent<HTMLButtonElement>) {
	let currentSection: HTMLElement | null = null;
	let target: HTMLElement | null = event.currentTarget;
	while (target) {
		if (target.hasAttribute("data-section")) {
			currentSection = target;
			break;
		}
		target = target.parentElement;
	}

	if (!currentSection) return;

	const potentialToFocus = currentSection.querySelectorAll(
		FOCUSABLE_ELEMENTS_SELECTOR
	);

	for (const toFocus of potentialToFocus) {
		const element = toFocus as HTMLElement;
		if (
			toFocus &&
			toFocus !== event.currentTarget &&
			typeof element.focus == "function" &&
			window.getComputedStyle(element).getPropertyValue("display") != "none"
		) {
			setTimeout(() => {
				element.focus();
			}, 1);
			return;
		}
	}
	setTimeout(() => {
		if (currentSection) {
			currentSection.tabIndex = 0;
			currentSection.focus();
			setTimeout(() => {
				if (currentSection) {
					currentSection.tabIndex = -1;
				}
			});
		}
	}, 1);
}
