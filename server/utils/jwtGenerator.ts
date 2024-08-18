import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserPayload {
    user_id: string;
    user_name: string;
    user_email: string;
}

export default function jwtGenerator(payload: UserPayload): string {
    return jwt.sign({ user: payload }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
}