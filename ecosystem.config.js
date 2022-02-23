module.exports = {
  apps: [
    {
      script: './dist/index.js',
      name: 'app',
      exec_mode: 'cluster',
      instances: 2,
    },
  ],
};
