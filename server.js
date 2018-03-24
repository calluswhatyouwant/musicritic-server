import http from 'http';
import app from './src'

const server = http.createServer(app);

server.listen(8000, () => {
    console.log('funfando');
});
