exports.seed = (knex, Promise) => {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert([
          { name: 'popular palettes', id: 16 },
          { name: 'cool stuff', id: 4 }
        ])
          .then(() => {
            return knex('palettes').insert([
              {
                id: 1,
                project_id: 16,
                name: 'retro',
                color_one: '7DBEA5',
                color_two: 'F1E0B1',
                color_three: 'EE9D31',
                color_four: 'F26C1A',
                color_five: '5A392B'
              },
              {
                id: 2,
                project_id: 16,
                name: 'cold sunset',
                color_one: '8F9DB2',
                color_two: 'B0BAC8',
                color_three: 'F8DFBD',
                color_four: 'F3BB9A',
                color_five: 'CD998B'
              },
              {
                id: 3,
                project_id: 16,
                name: 'Flat UI',
                color_one: '2C3E50',
                color_two: 'E74C3C',
                color_three: 'ECF0F1',
                color_four: '3498DB',
                color_five: '2980B9'
              },
              {
                id: 4,
                project_id: 4,
                name: 'Flat UI',
                color_one: '2C3E50',
                color_two: 'E74C3C',
                color_three: 'ECF0F1',
                color_four: '3498DB',
                color_five: '2980B9'
              }
            ])
          })
          .catch(error => `Error seeding data: ${error}`)
      ]);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
