import Prism from "prismjs";
import "./material-light.css";

Prism.languages.typescript = Prism.languages.extend("javascript", {
	type: /\b(?:type|string|number|boolean|any)\b/,
	punctuation: /[{}[\]()]/,
	endline: /[,.:;]/,
});

const Code = ({
	text,
	syntax = "javascript",
	className,
}: { text: string; syntax?: string; className?: string }) => {
	const html = Prism.highlight(text, Prism.languages[syntax], syntax);

	return (
		<div data-testid="Code">
			<pre>
				<code
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{ __html: html }}
					className={className}
				/>
			</pre>
		</div>
	);
};

export default Code;
