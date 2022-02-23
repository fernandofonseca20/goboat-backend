const dbconfig = {
  type: 'postgres',
  url: process.env.DB_URL,
  synchronize: true,
  logging: false,
  entities: ['src/app/models/*.ts'],
  migrations: ['src/database/migrations/*.ts'],
  cli: {
    entitiesDir: 'src/app/models',
    migrationsDir: 'src/database/migrations',
  },
};

if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
  dbconfig.entities = ['dist/app/models/*.js'];
  dbconfig.migrations = ['dist/database/migrations/*.js'];
  dbconfig.cli = {
    entitiesDir: 'dist/app/models',
    migrationsDir: 'dist/database/migrations',
  };
  // dbconfig.logging = false;
  // dbconfig.ssl = true;
  // dbconfig.extra = {
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // };
}

module.exports = dbconfig;
