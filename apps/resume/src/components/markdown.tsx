import MarkdownToJSX from "markdown-to-jsx";
import type { ElementType, PropsWithChildren } from "react";

import { createId } from "@paralleldrive/cuid2";

const Heading =
	(type: string) =>
	({ children }: { children: string[] }) => {
		const Tag = type as ElementType;
		const newChildren = children.map((child) =>
			child
				.replace(/#+/g, "#")
				.split(/#+(\s)?/g)
				.map((val) => val?.trim())
				.filter(Boolean),
		);

		return newChildren.map(([header, subheader]) => {
			return (
				<div key={createId()} className="">
					<Tag className="inline-block mr-2">{header}</Tag>
					<span>{subheader}</span>
				</div>
			);
		});
	};

const options = {
	overrides: {
		h1: Heading("h1"),
		h2: Heading("h2"),
		h3: Heading("h3"),
		h4: Heading("h4"),
		h5: Heading("h5"),
		h6: Heading("h6"),
	},
};

const Markdown = ({
	children,
	className,
	...props
}: PropsWithChildren & { className?: string }) => {
	const child = `${children}`;

	return (
		<MarkdownToJSX options={options} {...props} className={className}>
			{child}
		</MarkdownToJSX>
	);
};

export default Markdown;
