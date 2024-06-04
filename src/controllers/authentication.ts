import { createUser, getUserByEmail } from "../db/user";
import express from "express";
import { authentication, random } from "../helpers/index";
import jwt from 'jsonwebtoken';
import { omit } from "lodash";

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        return res.status(201).json(user);
    } catch (error) {
        console.error("Error in Register API:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            return res.status(403).json({ error: "Invalid email or password" });
        }
       
        let token;
        try {
            token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email
                },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            );
        } catch (err) {
            console.error("JWT Error:", err);
            return res.status(500).json({ error: "Token generation failed" });
        }
      
       
        user.authentication.sessionToken = token;
        await user.save();
        const userWithoutAuth = omit(user.toObject(), ['authentication.password', 'authentication.salt']);
        res.cookie(process.env.COOKIE_KEY, token, {
            maxAge: 7200,
            httpOnly: true,
            sameSite: "none",
            secure: true,
           })

        return res.status(200).json(userWithoutAuth);
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
