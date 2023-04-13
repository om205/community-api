const mongoose = require('mongoose')

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
    })
    console.log(`Mongodb connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB