exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('projects', table => {
      table.increments('id').primary();
      table.string('name');

      table.timestamps(true, true);
    }),
    knex.schema.createTable('palettes', table => {
      table.increments('id').primary;
      table.integer('project_id').unsigned();
      table.foreign('project_id').references('projects.id')
      table.string('name');
      table.string('color_one');
      table.string('color_two');
      table.string('color_three');
      table.string('color_four');
      table.string('color_five');

      table.timestamps(true, true);
    })
  ]);
};

exports.down = (knex, Promise) => {
  knex.schema.dropTable('palettes');
  knex.schema.dropTable('projects');
};
