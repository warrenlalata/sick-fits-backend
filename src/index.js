require('dotenv').config({ path: '.env' })
const cookieParser = require('cookie-parser')

const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

// Todo use express middleware to handle cookies
server.express.use(cookieParser())
// TODO use express middleware to populate current user


server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    },
}, ({ port }) => console.log(`Server running at http://localhost:${port}`))