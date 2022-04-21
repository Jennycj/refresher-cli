const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
function database() {
    return mongoose
    .connect(DATABASE_URL, {})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("err.message"))
}

module.exports = database;