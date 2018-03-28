import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import config from './config';
import router from './spotify/auth/routes';

const app = express();

app.use(cookieParser());
app.use(cors());
app.use('/auth', router);

const server = http.createServer(app);

server.listen(5000, () => {
    console.log('Listenning on port 5000...');
});
