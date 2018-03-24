import express from 'express';
import cookieParser from 'cookie-parser';
import router from './auth/router';
import cors  from 'cors';

const app = express();

app.use(cookieParser());
app.use(cors());
app.use('/auth', router);

export default app;