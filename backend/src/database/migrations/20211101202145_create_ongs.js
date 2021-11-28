

exports.up = function (knex) {
    return knex.schema.createTable('ongs', function (table) {
        table.string('id').primary();
        table.string('name').notNullable();
        table.string('email').unique().notNullable();
        table.string('whatsapp').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
        table.string('password').notNullable();
        table.string('token');
        table.timestamp('created_at_ong').defaultTo(knex.fn.now());
        table.timestamp('updated_at_ong').defaultTo(knex.fn.now());
        table.string('passwordResetToken');
        table.date('passwordResetExpires');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('ongs');
};

