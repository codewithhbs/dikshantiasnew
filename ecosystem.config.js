module.exports = {
  apps: [{
    name: 'dikshantias-next',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/dikshantiasnew',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
