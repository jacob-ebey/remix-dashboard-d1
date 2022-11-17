import { useEffect, useMemo } from "react";
import { type LinksFunction, type MetaFunction } from "@remix-run/cloudflare";
import {
	useFetchers,
	useTransition,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import NProgress from "nprogress";

import tailwindStylesHref from "./styles/global.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: tailwindStylesHref },
];

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "New Remix App",
	viewport: "width=device-width,initial-scale=1",
});

export default function App() {
	useNProgress();

	return (
		<html
			lang="en"
			className="bg-white text-lg dark:bg-black text-black dark:text-white"
		>
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

function useNProgress() {
	let transition = useTransition();

	let fetchers = useFetchers();
	let state = useMemo(() => {
		let states = [
			transition.state,
			...fetchers.map((fetcher) => fetcher.state),
		];
		if (states.every((state) => state === "idle")) return "idle" as const;
		return "busy" as const;
	}, [transition.state, fetchers]);

	useEffect(() => {
		NProgress.configure({ showSpinner: false });
	}, []);

	useEffect(() => {
		switch (state) {
			case "busy":
				NProgress.start();
				break;
			default:
				NProgress.done();
				break;
		}
	}, [state]);
}
