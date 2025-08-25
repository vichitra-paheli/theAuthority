module.exports = {
  apps: [
    {
      name: 'theauthority-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      },
      watch: false, // Vite has its own file watching
      ignore_watch: ['node_modules', 'dist'],
      log_file: '../logs/frontend.log',
      out_file: '../logs/frontend-out.log',
      error_file: '../logs/frontend-error.log',
      time: true,
    },
    {
      name: 'theauthority-backend',
      cwd: './backend',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      },
      watch: false, // tsx has its own file watching
      ignore_watch: ['node_modules', 'dist', 'logs'],
      log_file: '../logs/backend.log',
      out_file: '../logs/backend-out.log',
      error_file: '../logs/backend-error.log',
      time: true,
    }
  ]
};
