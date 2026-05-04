import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import User from "./user.model";

export const registerUser = async (username: string, email: string, password: string) => {
    const exists = await User.findOne({email});

    
}