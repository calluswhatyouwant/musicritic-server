import http from 'http';
import app from './src'

const server = http.createServer(app);

server.listen(5000, () => {
    console.log('funfando');
});
