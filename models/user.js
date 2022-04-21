const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    mnemonic: {
        type: String,
        required: true,
    },
    xpriv: {
        type:  Schema.Types.Mixed,
        required: true,
    },
    xpub: {
        type: String,
        required: true,
    },
    addresses: {
        type: Array
    }

})


const User = mongoose.model("user", userSchema)
module.exports.User = User;