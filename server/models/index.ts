import { Sequelize } from "sequelize";
import { Model, Op } from "sequelize";
import fs from 'fs'
import path from 'path'
import config from "../config/config";
const basename = path.basename(__filename);
const db: any = {};

let sequelize = new Sequelize(config.development.url as string, config.development as object);

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && ((file.slice(-3) === '.ts') || (file.slice(-3) === '.js'));
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
// console.log({db})
export default db
