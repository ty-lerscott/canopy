const fs = require('node:fs');

const getPackageJson = (pathname) => {
    console.log('path', pathname);
    try {
        return JSON.parse(fs.readFileSync(`${pathname}/package.json`, 'utf8'));
    } catch (err) {
        console.error('getPackageJson error:',err.message);
        return {};
    }
}

module.exports = getPackageJson;