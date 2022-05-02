const mongoose = require("mongoose")
const Schema = mongoose.Schema

const heirSchema = new Schema({
    mnemonic: {
        type: String,
        required: true,
    },
    xpriv: {
        type:  Schema.Types.Mixed,
        required: true,
    },
    masterFingerprint: {
        type: Schema.Types.Mixed,
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

const Heir = mongoose.model("heir", heirSchema)
module.exports.Heir = Heir;