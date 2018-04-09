import express from 'express';

import { Users } from '../collections';
import Error from '../models/error';
import { createUser } from '../../firebase/auth';

const router = express.Router();

router.post('/users', (req, res) => {
    const user = req.body;
    signUp(user)
        .then(newUser => res.status(201).send(newUser))
        .catch(error => res.status(error.status).send(error));
});

const signUp = async (user) => {
    await usernameExists(user.username).catch();
    const newUser = await createUser(user);
    Users.doc(newUser.uid).set({ username: user.username });
    return newUser;
}

const usernameExists = async (username) => {
    const databaseUser = await Users.where('username', '==', username).get();
    if (!databaseUser.empty) {
        throw new Error(500, "Username already exists");
    }
}

export default router;