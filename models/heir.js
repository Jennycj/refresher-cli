const mongoose = require("mongoose")
const Schema = mongoose.Schema

const heirSchema = new Schema({
    xpub: {
        type: String,
        required: true,
    },
    addresses: {
        type: Array
    }

})

const Heir = mongoose.model("heir", heirSchema)
module.exports.Heir = Heir;