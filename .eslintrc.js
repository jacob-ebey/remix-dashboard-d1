/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: ["@remix-run/eslint-config", "@remix-run/eslint-config/node"],
	ignorePatterns: ["build", "public", "node_modules"],
};
