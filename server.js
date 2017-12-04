// Import Express Node module
const express = require('express');
// Import Body Parser Node module
const bodyParser = require('body-parser');
// create new Express application
const app = express();

// sets the port to either the enviroment variable port or the default value of 3000
app.set('port', process.env.PORT || 3000);

// bodyParser.json returns middleware that only parses json
app.use(bodyParser.json());

// tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).
app.use(bodyParser.urlencoded({ extended: true }));

// servers all assets located in the public directory
app.use(express.static(__dirname + '/public'));

// creates a local title variable within the application
app.locals.title = 'Palette Picker';

// sets the node enviroment variable to development
const environment = process.env.NODE_ENV || 'development';
// imports the configuration for the enviroment
const configuration = require('./knexfile')[environment];
// imports knex with the current configuration
const database = require('knex')(configuration);

// generates a get HTTP method for retrieving all projects
app.get('/api/v1/projects', (request, response) => {
  // Use Knex to query projects table in database
  database('projects').select()
    // if promise resolves, return status 200 (everything was fine) and all projects as json
    .then(projects => response.status(200).json({ projects }))
    // if promise rejects, return 500 status (server side had a problem) and returns error as json
    .catch(error => resopnse.status(500).json({ error }))
});

// generates a get HTTP request for retrieving a project with a unique id
app.get('/api/v1/projects/:id', (request, response) => {
  // queries projects table and looks for id found in URL
  database('projects').where('id', request.params.id).select()
    // if promise resolves, do the thing
    .then(project => {
      // checks if any projces found
      if (project.length) {
        // if project found, return status 200 (everything is okay) and returns the project as json
        return response.status(200).json({ project: project[0] });
        // what happens if the if conditional returns false
      } else {
        // returns status 404 (not found) and responst with json
        return response.status(404).json({
          // json response telling user why server responded with 404
          error: `Could not find any projects with id '${request.params.id}'`
        });
      }
    })
    // if promise rejected, respond with status code 500 (server had a problem) and returns the error as json
    .catch(error => response.status(500).json({ error }))
});

// generates a get HTTP request for all palettes in a project with a unique id
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  // queries database looking for a project with and id that matches the one in the url
  database('palettes').where('project_id', request.params.id).select()
    // if promise resolves, returns a promise and .then allows chaining of response
    .then(palettes => {
      // checkes if any projects match the project id
      if (palettes.length) {
        // if a project matches project id, returns status 200 (everything is okay) and returns the palettes as JSON
        return response.status(200).json({ palettes });
        // what happens if the if conditional returns false
      } else {
        // if no project is found matching id, returns status 404 (not found) and error as json
        return response.status(404).json({
          // error output
          error: `Could not find any palettes with project_id '${response.params.id}'`
        });
      }
    })
    // if promise rejected, returns status 500 (server had a problem) and returns the error as json
    .catch(error => response.status(500).json({ error }))
});

// generates a get request for a specific palette associated with a project with a unique id
app.get('/api/v1/projects/:projectID/palettes/:paletteID', (request, response) => {
  // queries database looking for palette matching id with id found in url with matching project id found in url
  database('palettes').where('project_id', request.params.projectID).where('id', request.params.paletteID).select()
    // promise chaining via fetch API
    .then(palette => {
      // checks to see if a palette is found
      if (palette.length) {
        // if palette is found, return response 200 (everything is fine) and returns the palette as json
        return response.status(200).json({ palette: palette[0] });
      } else {
        // if the palette is not found, returns status 404 (not found) and error as json
        return response.status(404).json({
          // error json output
          error: `Could not find a palette with project_id '${response.params.projectID}' and palette_id '${response.params.paletteID}'`
        });
      }
    })
    // if promise is rejected, responds with error code 500 (server had a problem) and returns an error as json
    .catch(error => response.status(500).json({ error }))
});

// sets a url to which a user can add a project to the databse
app.post('/api/v1/projects', (request, response) => {
  // sets a variable that represents the json submitted via post request
  const project = request.body;

  // checks to see if all required properties were submitted in body of request
  for (let requiredParameter of ['name']) {
    // if they are not present
    if (!project[requiredParameter]) {
      // return status 422 (not processible) and json with custom error message telling user which property was not found
      return response.status(422).json({ error: `You are missing the '${requiredParameter}' property` });
    };
  };

  // if all properties submitted by user correctly, queries database looking for the first project with a similar name
  database('projects').where({ name: project.name }).select().first()
    // promise chaining via Fetch API
    .then(res => {
      // if there is no response, then the project can be created
      if (!res) {
        // adds a project to the project table with a unique id
        database('projects').insert(project, 'id')
          // if promise resolves, returns status 201 (successful post) and returns the project object via json
          .then(project => response.status(201).json({ project }))
          // if promise rejects, returns status 500 (server error) and responds with error as json
          .catch(error => response.status(500).json({ error }))
      } else {
        // if project name is found, returns status 422 and alerts user that project with that name already exists
        return response.status(422).json({ error: `A palette with title '${project.name}' already exists` });
      }
    })
    // if promise is rejected, responds with error code 500 (server had a problem) and returns an error as json
    .catch(error => response.status(500).json({ error }))
});

// creates a url which will allow a user to make a POST HTTP request 
app.post('/api/v1/projects/:id/palettes', (request, response) => {
  // assigns the user's POST request body as a variable
  let palette = request.body;
  // assigns the id given via url as a variable
  const id = request.params.id;

  //  // checks to see if all required properties were submitted in body of request
  for (let requiredParameter of ['name', 'project_id', 'color_one', 'color_two', 'color_three', 'color_four', 'color_five']) {
    // if not all required properties present, returns error
    if (!palette[requiredParameter]) {
      // not all required properties present, status code 422 returned as well as error in json format alerting user to which property was missing
      return response.status(422).json({ error: `You are missing the '${requiredParameter}' property` });
    };
  }

  // queries database for palette with same name as palette name submitted by user
  database('palettes').where({ name: palette.name }).select().first()
    // promise chaining via fetch api
    .then(res => {
      // if no reponse, then no palette title matches user submitted title
      if (!res) {
        // add projects id to palette objec 
        palette = Object.assign({}, palette, { project_id: id });
        // adds palette to palette table in DB
        database('palettes').insert(palette, 'id')
          // if promise resolves, returns status 201 (successful post) and id of palette via json
          .then(palette => response.status(201).json({ id: palette[0] }))
          // if promise is rejected, responds with error code 500 (server had a problem) and returns an error as json
          .catch(error => response.status(500).json({ error }));
      } else {
        // if palette is found, returns 422 with error message alerting user that palette with name already exists
        return response.status(422).json({ error: `A palette with title '${palette.name}' already exists` });
      }
    })
    // if promise is rejected, responds with error code 500 (server had a problem) and returns an error as json
    .catch(error => response.status(500).json({ error }));
});

// creates an API endpoint for a user to submit a DELETE HTTP request for a project with a unique id
app.delete('/api/v1/projects/:id', (request, response) => {
  // sets id given in url as id variable
  const id = request.params.id;

  // deletes all palettes associated with the given project id
  database('palettes').where('project_id', id).del()
    // deletes the project with the given project id
    .then(() => database('projects').where('id', id).del())
    // returns a status 204 and json of the deleted project
    .then(() => response.status(204).json({ id }))
    // if promise rejected, returns error telling user project with that id was not found
    .catch(error => response.json({ error: `Could not find a project with id of ${id}` }))
});

// creates an API url endpoing for a user to delete a palette from a project
app.delete('/api/v1/projects/:projectID/palettes/:paletteID', (request, response) => {
  // assigns the projectID given in the request url to a variable
  const projectID = request.params.projectID;
  // assigns the paletteID given in the request url to a varaible
  const paletteID = request.params.paletteID;

  // goes into the palette table and removes a palette that matches the id
  database('palettes').where('id', paletteID).del()
    // if the palette with id exists, returns status 204 and id of the palette that was deleted
    .then(() => response.status(204).json({ paletteID }))
    // if promise rejected, returns with status 404 and error via json alerting user that palette with given palette id and project idwas not found
    .catch(error => response.status(404).json({ error: `Could not find a palette with project_id of ${projectID} and id of ${id}` }))
});

// generic 404 message from Express docs with request, response, and next variables
// the next variable is the lateset http request sent to server
app.use(function (req, res, next) {
  // alerts user that the requested url can not be found
  res.status(404).send("404: Sorry can't find that!")
});

// generic 500 message from Express docs, with error, request, response, and next variables
app.use(function (err, req, res, next) {
  // alerts console of error
  console.error(err.stack)
  // browser response that there was a problem with the server
  res.status(500).send('Something broke!')
});

// listens to the port that is given by the port variable
app.listen(app.get('port'), () => {
  // logs to console which port Express is running on
  console.log(`Express intro running on ${port}`);
});