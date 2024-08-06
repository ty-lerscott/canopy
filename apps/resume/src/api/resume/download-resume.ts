const API_URL = import.meta.env.VITE_API_URL;

const downloadResume = async (resumeId: string): Promise<Blob | undefined> => {
	if (!resumeId) {
		return Promise.reject();
	}

	try {
		const resp = await fetch(`${API_URL}/download/resume/${resumeId}`);

		return await resp.blob();
	} catch (err) {
		console.error("downloadResume error", (err as Error).message);
	}
};

export default downloadResume;
