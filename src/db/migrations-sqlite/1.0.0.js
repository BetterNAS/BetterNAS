exports.up = knex => {
  return knex.schema
    // USERS -------------------------------
    .createTable('users', table => {
      table.increments('id').primary()
      table.string('email').notNullable()
      table.string('name').notNullable()
      table.string('password')
      table.boolean('isSystem').notNullable().defaultTo(false)
      table.boolean('isActive').notNullable().defaultTo(false)
      table.boolean('mustChangePwd').notNullable().defaultTo(false)
      table.string('createdAt').notNullable()
      table.string('updatedAt').notNullable()
    })
}

exports.down = knex => { }