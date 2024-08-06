import {readFileSync} from 'node:fs';

const getPackageJson = (pathname: string) => {

    try {
        return JSON.parse(readFileSync(`${pathname}/package.json`, 'utf8'));
    } catch (err) {
        console.error('getPackageJson error:',err.message);
        return {};
    }
}

export default getPackageJson;