module.exports = {
    apps: [
        {
            name: 'AxonCoreBench',
            script: 'index.js',
            cwd: 'src',
            args: ['--color'],
            node_args: '-r esm',
            
            exec_mode: 'fork',
            
            instances: 1,
            autorestart: true,
            wait_ready: true,
        },
    ],
};
