import generateConfig from './utils/generate-config';

const config = {
	apps: [
		generateConfig('apps/server'),
		generateConfig('apps/database'),
		generateConfig('apps/resume'),
	],
};

module.exports = config;
