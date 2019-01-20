require('dotenv').config({ path: '.env' })
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

// express middleware to handle cookies
server.express.use(cookieParser())
  // decode JWT so we can get the userId
  server.express.use((req, res, next) => {
  const { token } = req.cookies

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    // attach userId to request
    req.userId = userId
  }

  next()
})

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  },
}, ({ port }) => console.log(`Server running at http://localhost:${port}`))