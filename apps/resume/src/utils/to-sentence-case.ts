const toSentenceCase = (input: string): string => {
	const spaced = input
		.replace(/([A-Z])/g, " $1")
		.trim()
		.split(" ");

	return spaced
		.map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
		.join(" ");
};
export default toSentenceCase;
