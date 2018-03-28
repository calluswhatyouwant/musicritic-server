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

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var stateKey = 'spotify-auth-state';

router.get('/login', function (req, res) {
    var state = (0, _util.generateRandomState)(16);
    res.cookie(stateKey, state);
    res.redirect((0, _util.getSpotifyAuthUrl)('/authorize?') + _querystring2.default.stringify({
        response_type: 'code',
        client_id: _config2.default.spotify.clientId,
        scope: _config2.default.spotify.scope,
        redirect_uri: (0, _util.getHostUrl)('/auth/callback'),
        state: state
    }));
});

router.get('/callback', function (req, res) {
    var state = req.query.state;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
    if (!state || state !== storedState) {
        res.redirect((0, _util.getClientUrl)(_config2.default.client.errorPath) + _querystring2.default.stringify({ error: 'state_mismatch' }));
    } else {
        requestForSpotifyUserToken(req, res);
    }
});

var requestForSpotifyUserToken = function requestForSpotifyUserToken(req, res) {
    res.clearCookie(stateKey);
    var code = req.query.code;
    var tokenRequestOptions = (0, _util.getTokenReqOptions)({
        code: code,
        redirect_uri: (0, _util.getHostUrl)('/auth/callback'),
        grant_type: 'authorization_code'
    });
    _request2.default.post(tokenRequestOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.redirect((0, _util.getClientUrl)(_config2.default.client.successPath + ('/' + body.access_token + '/' + body.refresh_token)));
        } else {
            res.redirect((0, _util.getClientUrl)(_config2.default.client.errorPath) + _querystring2.default.stringify({ error: 'invalid_token' }));
        }
    });
};

exports.default = router;