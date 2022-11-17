export function getRedirectTo(searchParams: URLSearchParams, fallback = "/") {
	let redirect = searchParams.get("redirectTo") || fallback;
	redirect = redirect.trim();
	if (redirect.startsWith("//") || redirect.startsWith("http")) {
		redirect = fallback;
	}
	return redirect || fallback;
}
