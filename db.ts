const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'soo020674',
    host: 'localhost',
    port: '4000',
    database: 'jwttutorial'
});

export { pool };