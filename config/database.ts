import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'admin',
  database: 'new_db',
  logging: false,
});

const checkDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

export { sequelize, checkDbConnection };
