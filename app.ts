
import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/.env'})

import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import Routes from './server/routes';

const app = express();

app.use(logger('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
Routes(app)


app.get("*", (req, res) => res.status(200).send({
    message: 'welcome to the beginning of nothingness'
}))

 export default app;