module.exports = {
  apps : [{
    name: "CCM API APP",
    script: "./bin/www",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}