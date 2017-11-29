const express = require('express');
const app = express();
const path = require('path');

app.locals.projects = [
  {
    id: '1',
    name: 'pro1',
    palettes: [
      {
        id: 1,
        colors: [
          'rgba(1,2,3)',
          'rgba(1,2,3)',
          'rgba(1,2,3)',
          'rgba(1,2,3)',
          'rgba(1,2,3)'
        ]
      },
      {
        id: '2',
        colors: [
          'rgba(4,5,6)',
          'rgba(4,5,6)',
          'rgba(4,5,6)',
          'rgba(4,5,6)',
          'rgba(4,5,6)'
        ]
      },
      {
        id: '3',
        colors: [
          'rgba(7,8,9)',
          'rgba(7,8,9)',
          'rgba(7,8,9)',
          'rgba(7,8,9)',
          'rgba(7,8,9)'
        ]
      },
    ]
  },
  {
    id: '2',
    name: 'pro2',
    palettes: [
      {
        id: '1',
        colors: [
          'rgba(1,2,3)',
          'rgba(1,2,3)',
          'rgba(1,2,3)',
          'rgba(1,2,3)',
          'rgba(1,2,3)'
        ]
      },
      {
        id: '2',
        colors: [
          'rgba(4,5,6)',
          'rgba(4,5,6)',
          'rgba(4,5,6)',
          'rgba(4,5,6)',
          'rgba(4,5,6)'
        ]
      },
      {
        id: '3',
        colors: [
          'rgba(7,8,9)',
          'rgba(7,8,9)',
          'rgba(7,8,9)',
          'rgba(7,8,9)',
          'rgba(7,8,9)'
        ]
      },
    ]
  },
];
    


  

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/v1/projects', (request, response) => {
  return response.status(200).json({ projects: app.locals.projects });
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  const project = app.locals.projects.filter(ele => ele.id === id);
  return response.status(200).json(project); 
});

app.get('/api/v1/projects/:projectID/palettes', (request, response) => {
  const { projectID } = request.params;
  const palettes = app.locals.projects.filter(ele => ele.id === id);
  return response.status(200).json();
});

app.get('/api/v1/projects/:projectID/palettes/:paletteID', (request, response) => {
  let { projectID, paletteID } = request.params;
  return response.status(200).json();
});

app.post('api/v1/projects', (request, response) => {

  return response.status(200).send('POST request');
});

app.post('api/v1/projects/:projectID/palletes', () => {
  return response.status(200).send('POST request');
});

app.patch('/api/v1/projects/:projectID', (request, response) => {
  return response.status(200).send('PATCH request');
});

app.patch('/api/v1/projects/:projectID/palette/:paletteID', (request, response) => {
  return response.status(200).send('PATCH request');
});

app.delete('/api/v1/projects', (request, response) => {
  return response.status(200).send('DELETE request');
});

app.delete('/api/v1/projects/:projectID/palettes', (request, response) => {
  return response.status(200).send('DELETE request');
});

app.use(function (req, res, next) {
  res.status(404).send("404: Sorry can't find that!")
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(3000, () => {
  console.log('Express intro running on localhost:3000.');
});