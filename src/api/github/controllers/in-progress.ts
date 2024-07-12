// biome-ignore lint/suspicious/noExplicitAny: For any action with "created" the request body can be anything
const InProgressController = (body: Record<string, any>) => {
	console.log("unhandled in_progress");
	return new Promise<void>((resolve) => {
		resolve();
	});
};

export default InProgressController;
