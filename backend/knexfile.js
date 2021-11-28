// Update with your config settings.


module.exports = {

  production: {
    client: process.env.CLIENT,
    connection: {
      database: process.env.DATABASE_NAME,
      user: process.env.USER_NAME,
      password: process.env.PASSWORD,
      url: process.env.DATABASE_URL,
      host: process.env.HOST
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/database/migrations'
    }
  }

};
