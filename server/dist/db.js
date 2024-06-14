"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const Pool = require('pg').Pool;
require("dotenv").config();
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});
exports.pool = pool;
//# sourceMappingURL=db.js.map