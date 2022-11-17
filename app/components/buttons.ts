import cn from "clsx";

export function buttonStyles(
	{ block, full, uniform }: { block?: false; full?: true; uniform?: true } = {},
	className = ""
) {
	return cn(
		"px-2 hover:outline",
		block === false ? "inline-block" : "block",
		full && "w-full text-center",
		uniform ? "py-2" : "py-1",
		className
	);
}
