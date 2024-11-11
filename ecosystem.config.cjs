module.exports = {
    apps: [
        {
            name: 'btm-travel-bi-cloud',
            port: '3000',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs',
        },
    ],
};
