const tarFile = 'canopy.tar.gz';

module.exports = {
    apps: [
        {
            name: 'canopy',
            script: `tar --xzvf ${tarFile} && rm -rf ${tarFile} && npm i && npm build && npm start`,
            instances: '2', // Or a specific number of instances
            exec_mode: 'cluster', // Enables clustering mode
            env: {
                NODE_ENV: 'production',
                PORT: 3100,
                // Add other environment variables here
            },
        },
    ],
};