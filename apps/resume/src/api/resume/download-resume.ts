const downloadResume = async (resumeId: string): Promise<Blob | undefined> => {
	if (!resumeId) {
		return Promise.reject();
	}

	try {
		const resp = await fetch(`/api/download/resume/${resumeId}`);

		return await resp.blob();
	} catch (err) {
		console.error("downloadResume error", (err as Error).message);
	}
};

export default downloadResume;
