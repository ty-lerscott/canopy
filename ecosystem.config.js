module.exports = {
    apps: [
        {
            name: 'canopy',
            script: 'npm',
            args: 'start', // Adjust the port if needed
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