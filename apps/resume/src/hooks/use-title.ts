import { useEffect } from "react";

const useTitle = (title?: string) => {
	const documentDefined = typeof document !== "undefined";

	useEffect(() => {
		if (!documentDefined) return;
		const extension = window.location.hostname.split(".").pop() as string;

		document.title = `${extension === "local" ? "⚪ " : ""}@maestro/resume${title ? ` ${title}` : ""}`;
	}, [title, documentDefined]);
};

export default useTitle;
