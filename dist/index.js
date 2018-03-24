'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _router = require('./auth/router');

var _router2 = _interopRequireDefault(_router);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use('/api', _router2.default);

var server = _http2.default.createServer(app);

server.listen(3000, function () {
    console.log('funfando');
});

exports.default = app;