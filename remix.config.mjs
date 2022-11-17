import { flatRoutes } from "remix-flat-routes";

/** @type {import('@remix-run/dev').AppConfig} */
export default {
	serverModuleFormat: "esm",
	devServerBroadcastDelay: 1000,
	ignoredRouteFiles: ["**/*"],
	routes: async (defineRoutes) => {
		return flatRoutes("routes", defineRoutes, {
			basePath: "/",
			paramPrefixChar: "$",
			ignoredRouteFiles: [],
		});
	},
};
