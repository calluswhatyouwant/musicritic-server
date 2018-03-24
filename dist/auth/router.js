'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var client_id = '5f6e1b51bb2c434d836f49ff7da59c34';
var client_secret = 'f58243eaed3e4b2b9ee68881a83cc4fc';
var redirect_uri = 'http://localhost:3000/callback/';
var stateKey = 'spotify_auth_state';

var generateRandomState = function generateRandomState(length) {
    var state = '';
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        state += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return state;
};

router.get('/auth', function (req, res) {
    var scope = 'user-read-email';
    var state = generateRandomState(16);

    res.cookie(stateKey, state);
    res.redirect('https://accounts.spotify.com/authorize?' + _querystring2.default.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    }));
});

router.get('/callback', function (req, res) {

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' + _querystring2.default.stringify({
            error: 'state_mismatch'
        }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64')
            },
            json: true
        };

        _request2.default.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    json: true
                };

                // use the access token to access the Spotify Web API
                _request2.default.get(options, function (error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' + _querystring2.default.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                }));
            } else {
                res.redirect('/#' + _querystring2.default.stringify({
                    error: 'invalid_token'
                }));
            }
        });
    }
});

exports.default = router;