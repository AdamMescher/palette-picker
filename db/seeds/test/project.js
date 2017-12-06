exports.seed = (knex, Promise) => {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          name: 'popular palettes'
        }, 'id')
          .then(paper => {
            console.log('CREATED TEST PALETTES');
            return knex('palettes').insert([
              {
                project_id: 16,
                name: 'retro',
                color_one: '7DBEA5',
                color_two: 'F1E0B1',
                color_three: 'EE9D31',
                color_four: 'F26C1A',
                color_five: '5A392B'
              },
              {
                project_id: 16,
                name: 'cold sunset',
                color_one: '8F9DB2',
                color_two: 'B0BAC8',
                color_three: 'F8DFBD',
                color_four: 'F3BB9A',
                color_five: 'CD998B'
              },
              {
                project_id: 16,
                name: 'Flat UI',
                color_one: '2C3E50',
                color_two: 'E74C3C',
                color_three: 'ECF0F1',
                color_four: '3498DB',
                color_five: '2980B9'
              }
            ])
          })
          .then(() => console.log('Seeding completed'))
          .catch(error => `Error seeding data: ${error}`)
      ]);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
