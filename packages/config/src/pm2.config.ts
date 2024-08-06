import generateConfig from './utils/generate-config';

const config = {
	apps: [
		generateConfig('apps/server'),
		generateConfig('apps/resume'),
	],
};

export default config;
