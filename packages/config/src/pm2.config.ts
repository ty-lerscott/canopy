import { resolve } from "node:path";
import {readdirSync, statSync} from 'node:fs';
import generateConfig from './utils/generate-config';

const appsPath = resolve(process.cwd(), '..', '..', 'apps');
const apps = readdirSync(appsPath).filter((file) => statSync(resolve(appsPath, file)).isDirectory())

const config = {
	apps: apps.map(project => generateConfig(`apps/${project}`))
};

module.exports = config;
