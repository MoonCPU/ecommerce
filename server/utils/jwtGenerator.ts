import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserPayload {
    user_id: string;
    user_name: string;
    user_email: string;
}

export default function jwtGenerator({ user_id, user_name, user_email }: UserPayload): string {
    const payload = {
        user: {
            id: user_id,
            name: user_name,
            email: user_email
        }
    };
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1h" });
}