[![Waffle.io - Columns and their card count](https://badge.waffle.io/AdamMescher/palette-picker.png?columns=all)](https://waffle.io/AdamMescher/palette-picker?utm_source=badge)
# Palette Picker

A user should be able to come to the site, generate a color palette, and save it for their own future projects.

### Technology

Frontend: HTML, CSS, and jQuery

Backend: Node, Express, Knex, PostgreSQL

#### DB Schema

![](https://raw.githubusercontent.com/AdamMescher/palette-picker/master/public/assets/images/db-schema.png)


## Set up the development environment

### Available Scripts

`npm start` - starts the project on the default port of localhost:3000

`npm test` - runs all tests

`npm run css` - starts watching sass files

`npm run lint` - runs the linter


### First Time Setup

1. Clone or download the repository and open the terminal in the newly created `palette-picker` directory

2. `$ npm install` - installs all necessary packages locally

3. Create necessary postgres databases

* `$ psql`
* `$ CREATE DATABASE palette_picker;`
* `$ CREATE DATABASE palette_picker_test;`

4. `$ npm i -g knex` - installs `knex` globally

5. `$ knex migrate:latest` - runs all migrations to the latest point

6. `$ knex seed:run` - populates the database with test data

7. `$ npm start` - runs the command `node sever.js` to start the application at http://localhost:3000/
