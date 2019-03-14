const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const enviroment = process.emitWarning.NODE_ENV || 'test';
const configuration = require('../knexfile')[enviroment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(err => {
        throw err;
      });
  });
  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(err => {
        throw err;
      });
  });

});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch(error => { throw error; });
  });
  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => { throw error; });
  });
  describe('GET /api/v1/projects', () => {
    it('should return all of the projects', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.a.property('projects');
          response.body.projects.should.be.a('array');
          response.body.projects.should.have.length(1);
          response.body.projects[0].should.be.a('object');
          response.body.projects[0].should.have.a.property('name');
          response.body.projects[0].name.should.equal('popular palettes');
        })
        .catch(error => { throw error; });
    });
  });
  describe('GET /api/v1/projects/:id', () => {
    it('should return one project with unique id', () => {
      return chai.request(server)
        .get('/api/v1/projects/16')
        .then( response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('project');
          response.body.project.should.have.property('name');
          response.body.project.name.should.be.a('string');
          response.body.project.name.should.equal('popular palettes');
          response.body.project.should.have.property('id');
          response.body.project.id.should.be.a('number');
          response.body.project.id.should.equal(16);
        })
        .catch(error => { throw error; });
    });
    it('should return 404 if project is not found', () => {
      return chai.request(server)
        .get('/api/v1/projects/10')
        .then(response => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal(`Could not find any projects with id '10'`);
        })
        .catch(error => { throw error; });
    });
  });
  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should return all palettes associated with given project ID', () => {
      return chai.request(server)
        .get('/api/v1/projects/16/palettes')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.have.property('palettes');
          response.body.palettes.should.have.length(3);
        })
        .catch(error => { throw error; });
    })
    it('should return 500 if project is not found', () => {
      return chai.request(server)
        .get('/api/v1/projects/10/palettes')
        .then(response => {
          response.should.have.status(500);
          response.should.be.json;
        })
        .catch(error => { throw error; });
    })
  });
  describe('GET /api/v1/projects/:projectID/palettes/:paletteID', () => {
    it('should return one palette associated with project id', () => {
      return chai.request(server)
        .get('/api/v1/projects/16/palettes/1')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.have.property('palette');
          response.body.palette.should.be.an('object');
          response.body.palette.should.have.property('id');
          response.body.palette.id.should.be.a('number');
          response.body.palette.id.should.equal(1);
          response.body.palette.should.have.property('project_id');
          response.body.palette.project_id.should.be.a('number');
          response.body.palette.project_id.should.equal(16);
          response.body.palette.should.have.property('name');
          response.body.palette.name.should.be.a('string');
          response.body.palette.name.should.equal('retro');
          response.body.palette.should.have.property('color_one');
          response.body.palette.color_one.should.be.a('string');
          response.body.palette.should.have.property('color_two');
          response.body.palette.color_two.should.be.a('string');
          response.body.palette.should.have.property('color_three');
          response.body.palette.color_three.should.be.a('string');
          response.body.palette.should.have.property('color_four');
          response.body.palette.color_four.should.be.a('string');
          response.body.palette.should.have.property('color_five');
          response.body.palette.color_five.should.be.a('string');
        })
        .catch(error => { throw error; });
    });
    it('should return 500 if palette is not found', () => {
      return chai.request(server)
        .get('/api/v1/projects/16/palettes/0')
        .then(response => {
          response.should.have.status(500);
        })
        .catch(error => { throw error; });
    });
    it('should return 500 if project is not found', () => {
      return chai.request(server)
        .get('/api/v1/projects/0/palettes/0')
        .then(response => {
          response.should.have.status(500);
        })
        .catch(error => { throw error; });
    });
  });
  describe('POST /api/v1/projects', () => {
    it('should add project to database', () => {
      const project = { name: 'new project name' };
      return chai.request(server)
        .post('/api/v1/projects/')
        .send(project)
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.have.property('id');
          response.body.id.should.be.a('number');
        })
        .catch(error => { throw error; });
    });
    it('should return 422 if POST incorrectly formatted', () => {
      const improperlyFormattedProject = { project_name: 'new project name' };
      return chai.request(server)
        .post('/api/v1/projects/')
        .send(improperlyFormattedProject)
        .then(response => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal(`You are missing the 'name' property`);
        })
        .catch(error => { throw error; });
    });
  });
  describe('POST /api/v1/projects/:id/palettes', () => {
    it('should add palette to project', () => {
      const palette = {
        id: 4,
        project_id: 16,
        name: 'new palette',
        color_one: '7DBEA5',
        color_two: 'F1E0B1',
        color_three: 'EE9D31',
        color_four: 'F26C1A',
        color_five: '5A392B'
      };
      return chai.request(server)
        .post('/api/v1/projects/16/palettes')
        .send(palette)
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.have.property('id');
        })
        .catch(error => { throw error; });
    });
    it('should return 422 if palette is improperly formatted', () => {
      const incorrectlyFormattedPalette = {
        project_id: 16,
        name: 'new palette',
        color_1: '7DBEA5',
        color_two: 'F1E0B1',
        color_three: 'EE9D31',
        color_four: 'F26C1A',
        color_five: '5A392B'
      };
      return chai.request(server)
        .post('/api/v1/projects/16/palettes')
        .send(incorrectlyFormattedPalette)
        .then(response => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal(`You are missing the 'color_one' property`);
        })
        .catch(error => { throw error; });
    });
    it('should return 422 if palette with title already exists', () => {
      const sameNamePalette = {
        project_id: 16,
        name: 'retro',
        color_1: '7DBEA5',
        color_two: 'F1E0B1',
        color_three: 'EE9D31',
        color_four: 'F26C1A',
        color_five: '5A392B'
      };
      return chai.request(server)
        .post('/api/v1/projects/16/palettes')
        .send(sameNamePalette)
        .then(response => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal(`You are missing the 'color_one' property`);
        })
        .catch(error => { throw error; });
    });
  });
  describe('DELETE /api/v1/projects/:id', () => {
    it('should delete a project', () => {
      return chai.request(server)
        .delete('/api/v1/projects/16')
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => { throw error; });
    });
    it('should return 404 if project does not exist', () => {
      return chai.request(server)
        .delete('/api/v1/projects/5')
        .then(response => {
          response.should.have.status(404);
          response.should.be.json;
          response.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal(`Could not find a project with id of 5`);
        })
        .catch(error => { throw error; });
    });
  });
  describe('DELETE /api/v1/projects/:projectID/palettes/:paletteID', () => {
    it('should delete a project', () => {
      return chai.request(server)
        .delete('/api/v1/projects/16/palettes/4')
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => { throw error; });
    });
    it('should return 500 if project or palette do not exist', () => {
      return chai.request(server)
        .delete('/api/v1/projects/999/palettes/8')
        .then(response => {
          response.should.have.status(500);
        })
        .catch(error => { throw error; });
    });
  });
});