// biome-ignore lint/suspicious/noExplicitAny: For any action with "created" the request body can be anything
const InProgressController = (body: Record<string, any>) => {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			console.log("In Progress fake promise");
			resolve();
		}, 500);
	});
};

export default InProgressController;
