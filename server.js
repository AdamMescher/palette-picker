const https = require('https');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

const requireHTTPS = (request, response, next) => {
  if (request.header('x-forwarded-proto') != 'https') {
    return response.redirect(`https://${request.header('host')}${request.url}`);
  }
  next();
};

if(process.env.NODE_ENV === 'production') { app.use(requireHTTPS); }

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

app.locals.title = 'Palette Picker';

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => response.status(200).json({ projects }))
    .catch(error => response.status(500).json({ error }))
});

app.get('/api/v1/projects/:id', (request, response) => {
  database('projects').where('id', request.params.id).select()
    .then(project => {
      if (project.length) {
        return response.status(200).json({ project: project[0] });
      } else {
        return response.status(404).json({
          error: `Could not find any projects with id '${request.params.id}'`
        });
      }
    })
    .catch(error => response.status(500).json({ error }))
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.id).select()
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json({ palettes });
      } else {
        return response.status(404).json({
          error: `Could not find any palettes with project_id '${response.params.id}'`
        });
      }
    })
    .catch(error => response.status(500).json({ error }))
});

app.get('/api/v1/projects/:projectID/palettes/:paletteID', (request, response) => {
  database('palettes').where('project_id', request.params.projectID).where('id', request.params.paletteID).select()
    .then(palette => {
      if (palette.length) {
        return response.status(200).json({ palette: palette[0] });
      } else {
        return response.status(404).json({
          error: `Could not find a palette with project_id '${response.params.projectID}' and palette_id '${response.params.paletteID}'`
        });
      }
    })
    .catch(error => response.status(500).json({ error }))
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  
  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response.status(422).json({ error: `You are missing the '${requiredParameter}' property` });
    };
  };

  database('projects').where({name: project.name}).select().first()
    .then(res => {
      if(!res){
        database('projects').insert(project, 'id')
          .then(project => response.status(201).json({ project }))
          .catch(error => response.status(500).json({ error }))
      } else {
        return response.status(422).json({ error: `A palette with title '${project.name}' already exists` });
      }
    })
    .catch(error => response.status(500).json({ error }))
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  let palette = request.body;
  const id = request.params.id;
  
  for (let requiredParameter of ['name', 'project_id', 'color_one', 'color_two', 'color_three', 'color_four', 'color_five']){
    if(!palette[requiredParameter]){
      return response.status(422).json({ error: `You are missing the '${requiredParameter}' property` });
    };
  }

  database('palettes').where({ name: palette.name }).select().first()
    .then(res => {
      if (!res) {
        palette = Object.assign({}, palette, { project_id: id });
        database('palettes').insert(palette, 'id')
          .then(palette => response.status(201).json({ id: palette[0] }))
          .catch(error => response.status(500).json({ error }));
      } else {
        return response.status(422).json({ error: `A palette with title '${palette.name}' already exists`});
      }
    })
    .catch(error => response.status(500).json({ error }));
});

app.patch('/api/v1/projects/:id', (request, response) => {
  const attemptedProjectEdit = request.body;
  const id = request.params.id;
});

app.patch('/api/v1/projects/:projectID/palette/:paletteID', (request, response) => {

});

app.delete('/api/v1/projects/:id', (request, response) => {
  const id = request.params.id;
  
  database('palettes').where('project_id', id).del()
    .then(() => database('projects').where('id', id).del())
    .then(() => response.status(204).json({ id }))
    .catch(error => response.json({ error: `Could not find a project with id of ${id}` }))
});

app.delete('/api/v1/projects/:projectID/palettes/:paletteID', (request, response) => {
  const projectID = request.params.projectID;
  const paletteID = request.params.paletteID;

  database('palettes').where('id', paletteID).del()
    .then(() => response.status(204).json({ paletteID }))
    .catch(error => response.status(404).json({ error: `Could not find a palette with project_id of ${projectID} and id of ${id}` }))
});

app.use(function (req, res, next) {
  res.status(404).send("404: Sorry can't find that!");
  res.end();
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!');
  res.end();
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on port ${app.get('port')}`);
});

module.exports = app;