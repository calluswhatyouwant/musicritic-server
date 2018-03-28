'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTokenReqOptions = exports.getClientUrl = exports.getHostUrl = exports.getSpotifyAuthUrl = exports.generateRandomState = undefined;

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateRandomState = exports.generateRandomState = function generateRandomState(length) {
    var state = '';
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        state += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return state;
};

var getSpotifyAuthUrl = exports.getSpotifyAuthUrl = function getSpotifyAuthUrl(urlPath) {
    return '' + _config2.default.spotify.authBaseUri + urlPath;
};

var getHostUrl = exports.getHostUrl = function getHostUrl(urlPath) {
    return _config2.default.host.baseUri + ':' + _config2.default.host.port + urlPath;
};

var getClientUrl = exports.getClientUrl = function getClientUrl(urlPath) {
    return '' + _config2.default.client.baseUri + urlPath;
};

var getApplicationToken = function getApplicationToken() {
    var tokenToEncrypt = _config2.default.spotify.clientId + ':' + _config2.default.spotify.clientSecret;
    return 'Basic ' + new Buffer(tokenToEncrypt).toString('base64');
};

var getTokenReqOptions = exports.getTokenReqOptions = function getTokenReqOptions(form) {
    return {
        url: getSpotifyAuthUrl('/api/token'),
        headers: {
            'Authorization': getApplicationToken()
        },
        form: form,
        json: true
    };
};