import express from 'express';
import querystring from 'querystring';
import request from 'request';

const router = express.Router();

const client_id = '5f6e1b51bb2c434d836f49ff7da59c34';
const client_secret = 'f58243eaed3e4b2b9ee68881a83cc4fc';
const stateKey = 'spotify_auth_state';

const redirect_uri = 'http://localhost:8000/auth/callback/';
const spotify_token_uri = 'https://accounts.spotify.com/api/token';
const applicationToken = 'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64');

const generateRandomState = (length) => {
    let state = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        state += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return state;
};

const generateAuthReqOptions = (form) => ({
    url: spotify_token_uri,
    headers: {
        'Authorization': applicationToken
    },
    form: form,
    json: true
});

router.get('/login', (req, res) => {
    const scope = 'user-read-email user-read-recently-played';
    const state = generateRandomState(16);

    res.cookie(stateKey, state);
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

router.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
    } else {
        res.clearCookie(stateKey);
        const authOptions = generateAuthReqOptions({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        });

        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                res.redirect(`http://localhost:3000/auth/${body.access_token}/${body.refresh_token}`);
            } else {
                res.redirect('/#' + querystring.stringify({error: 'invalid_token'}));
            }
        });
    }
});

router.get('/refresh', (req, res) => {

    const refresh_token = req.query.refresh_token;
    const authOptions = generateAuthReqOptions({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
    });

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            res.send({ 'access_token': access_token });
        }
    });
});

export default router;