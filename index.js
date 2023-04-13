const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')

//get routes
const userRoutes = require('./routes/user')
const roleRoutes = require('./routes/role')
const memberRoutes = require('./routes/member')
const communityRoutes = require('./routes/community')

//load env variables
dotenv.config({path: './config/config.env'})

//connect to database
connectDB()

const app = express()

//body parser
app.use(express.json())

//dev logging middleware
if(process.env.NODE_ENV === 'development')
app.use(morgan('dev'))

//mount routes
app.use('/v1/auth', userRoutes)
app.use('/v1/role', roleRoutes)
app.use('/v1/member', memberRoutes)
app.use('/v1/community', communityRoutes)

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`.yellow.bold))

// handle unhandeled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    server.close(() => process.exit(1))
})