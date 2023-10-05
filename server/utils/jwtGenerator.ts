import jwt from 'jsonwebtoken';
require("dotenv").config();

function jwtGenerator (user_id, user_name, user_email) {
    const payload = {
        user: {
            user_id,
            user_name,
            user_email
        }
    }

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1hr"});
}

module.exports = jwtGenerator;