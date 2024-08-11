import generateConfig from './utils/generate-config';

const config = {
	apps: [
		generateConfig('apps/server'),
		generateConfig('packages/config'),
		generateConfig('apps/resume'),
	],
};

module.exports = config;
