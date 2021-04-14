# Transaction Runner

This is an api project developed with nodejs and typescript as the programming language. The database is hosted on a PostgreSQL server. 

## Project setup
### Installing dependencies and environment variables setup
- Run  `npm install`
- create a .env file on the root directory with the following data. for your gmail mailing service, only use MAIL_USER and MAIL_PASSWORD for mail transport setup, noneed to use the other properties with SMTP* prefix

    - NODE_ENV=DEVELOPMENT_OR_PRODUCTION
    - MAIL_SERVICE=PUT_GMAIL_OR_LEAVE_EMPTY
    - SMTP_HOST=ENTER_HOST_URL_FOR_SMTP
    - SMTP_PORT=ENTER_SMTP_PORT_HERE
    - MAIL_USER=ENTER_YOUR_SMTP_USER_HERE
    - MAIL_PASSWORD=ENTER_A_PASSWORD_TO_YOUR_SMTP
    - TOKEN_SECRET=ENTER_TOKEN_SECRET_HERE
    - USE_MAIL=THIS_VALUE_SHOULD_BE_YES_OR_NO(**MUST BE YES TO RECEIVE MAIL**)
    - PORT=ENTER_THE_PORT_YOUR_APP_SHOULD_USE
    - DEV_HOST=locahhost
    - DEV_DATABASE_URL=ENTER_YOUR_DEV_DATABASE_URL
    - PRODUCTION_HOST=ENTER_YOUR_HOST_HERE
- If you do not want to use gmail and you do not have an smtp server use this [example smtp](https://nodemailer.com/about/#example) 
- Run `npm run build`

### Using Migrations Sequelize
After installing sequelize with npm ensure, 
- backup your **models and config** that are in the server folder, 
- run `npx sequelize init` command, it takes the configureation from .sequelizerc file and might override some files in your models and config folder. 
- replace the the new files generated with the back up you created.
- you'll see a config.json file in your config folder, this file was generated from the command you ran earlier. you either of the format as represented for development or test format. \
**N.B it's import =ant to set your NODE_ENV variable for the migration to know which configuration to pick**
    ```JSON
    { 
        "development": {
            "url": "Pul url here",
            "dialect": "postgres",
            "dialectOptions": {
                "ssl": {
                    "require": true,
                    "rejectUnauthorized": false
                }
            }
        },
        "test": {
            "username": "postgres",
            "password": "mysecretpassword",
            "database": "transaction-runner",
            "host": "localhost",
            "port": 5432,
            "dialect": "postgres"
        },
        "production": {
            "username": "postgres",
            "password": "mysecretpassword",
            "database": "transaction-runner",
            "host": "localhost",
            "port": 5432,
            "dialect": "postgres"
        }
  }
  ```

- from the `npm run build` earlier, a folder call build was created in your project, copy the files in migrations folder located in the `/build/server/migrations` folder as represented on the image below.
![MI](buildversionofmigrations.png) to `/server/migrations/compiled` folder
as represented below  
![COM](compiledfolder.png)
- Since sequelize works with not only postgresql Setup the database of your choice on the /server/config/config.json file
- **Make sure you first build the project with npm run build**, ensure you have the compiled migration files from /build/server/migrations copied to /server/migrations/compiled folder before running the migration with `npx sequelize db:migrate`. THis in turn runs the migratiion from the files in /server/migrations/compiled.

## Running the project
The APIs are 13 in number, you can see the APIs documented with swagger ui, the link to the api documentation is in `yourdomain/api-docs`. 
![SW](SWAGGERUI.png)
### Account creation
The first API to call is /api/user/createuser, on success of the API an instruction would be sent over to your mail, the instructions would help you in setting up a user account on the platform.
