import jwt from 'jsonwebtoken';
require("dotenv").config();

function jwtGenerator (user_id, user_name) {
    const payload = {
        user: {
            user_id,
            user_name
        }
    }

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1hr"});
}

module.exports = jwtGenerator;