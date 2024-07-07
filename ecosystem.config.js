const tarFile = 'canopy.tar.gz';

module.exports = {
    apps: [
        {
            name: 'canopy',
            script: 'npm',
            args: "start",
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