
exports.up = function (knex) {
    return knex.schema.createTable('incidents', function (table) {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('description').notNullable();
        table.decimal('value').notNullable();
        table.string('ong_id').notNullable();
        table.foreign('ong_id').references('id').inTable('ongs');
        table.timestamp('created_at_incident').defaultTo(knex.fn.now());
        table.timestamp('updated_at_incident').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('incidents');
};
