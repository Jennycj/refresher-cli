const mongoose = require("mongoose")
const Schema = mongoose.Schema

const heirSchema = new Schema({
    mnemonic: {
        type: String,
        required: true,
    },
    privateKey: {
        type:  Schema.Types.Mixed,
        required: true,
    },
    masterFingerprint: {
        type: Schema.Types.Mixed,
        required: true,
    },
    xpriv: {
        type: String,
        required: true,
    },
    xpub: {
        type: String,
        required: true,
    },
    childPubKey: {
        type: Array
    },
    addresses: {
        type: Array
    }

})

const Heir = mongoose.model("heir", heirSchema)
module.exports.Heir = Heir;