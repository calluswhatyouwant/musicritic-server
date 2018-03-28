const config = {};

config.spotify = {
    scope: 'user-read-email user-read-recently-played',
    authBaseUri: 'https://accounts.spotify.com',
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
};

config.host = {
    baseUri: process.env.BASE_URI || 'http://localhost',
    port: process.env.PORT || 5000
}

config.client = {
    baseUri: process.env.CLIENT_BASE_URI || 'http://localhost:3000',
    errorPath: '/error',
    successPath: '/auth'
}

export default config;