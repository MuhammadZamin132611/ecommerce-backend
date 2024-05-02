const { default: mongoose } = require('mongoose');

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL)
        // const conn = await mongoose.connect('mongodb://localhost:27017/digitic')
        console.log("database connected successfullly", )
    } catch (error) {
        console.log("database error", error)
    }
}

module.exports = dbConnect