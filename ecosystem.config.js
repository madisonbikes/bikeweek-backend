module.exports = {
  apps: [
    {
      name: "bikeweek-backend",
      script: "node",
      args: "dist/src/index.js",
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
  ],
};
