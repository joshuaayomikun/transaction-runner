import { Sequelize } from "sequelize-typescript";
import { Model, Op } from "sequelize";
import fs from 'fs'
import path from 'path'

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db:any = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts');
  })
  .forEach((file) => {
    // console.log({file: path.join(__dirname, file)})
    const model = require(`${path.join(__dirname, file)}`).default(sequelize)
    // console.log({model: typeof model})
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op
export default db
