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
      .catch(error => {
        throw error;
      });
  });
  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });
  describe('GET /api/v1/projects', () => {

  })

  it('should return all of the projects', () => {
    return chai.request(server)
      .get('/api/v1/projects')
      .then(response => {
        console.log('Response project[0', response.body.projects[0]);
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.a.property('projects');
        response.body.projects.should.be.a('array');
        response.body.projects.length.should.equal(1);
        response.body.projects[0].should.be.a('object');
        response.body.projects[0].should.have.a.property('name');
        response.body.projects[0].name.should.equal('popular palettes');
      })
      .catch(err => {
        throw err;
      });
  });

  it.skip('should return one specific project', () => {
    return chai.request(server)
      .get('/api/v1/projects/:id')
      .then(response => {
        response.should.have.status(200);
        // response.should.be.json;
      })
      .catch(err => {
        throw err;
      });
  });
});