require('dotenv').config({ path: '.env' })

const createServer = require('./createServer')
const db = require('./db')

const server = createServer()


// Todo use express middleware to handle cookies
// TODO use express middleware to populate current user


server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    },
}, ({ port }) => console.log(`Server running at http://localhost:${port}`))