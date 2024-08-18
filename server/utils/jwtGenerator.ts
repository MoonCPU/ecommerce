import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function jwtGenerator(user_id, user_name, user_email) {
    const payload = {
        user: {
            user_id,
            user_name,
            user_email
        }
    };

    return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
}

export default jwtGenerator;