const pg = require('pg');
const moment = require('moment');
const { INT8, NUMERIC, DATE } = pg.types.builtins;
pg.types.setTypeParser(NUMERIC, parseFloat);
pg.types.setTypeParser(INT8, parseInt);
pg.types.setTypeParser(DATE, (d) => d && moment(d).format('YYYY-MM-DD'));

const config = {
    client: 'pg',
    searchPath: ['public'],
    connection: process.env.DB_URL,
    pool: {
        min: 0,
        max: 20
    }
};

const knex = require('knex')(config);
module.exports = knex;
