const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        default: ""
    },

    password: {
        type: String,
        default: ""
    },

    dob: {
        type: String
    },

    time: {
        type: String
    },

    place: {
        type: String
    },

    chats: [
        {
            user: String,
            bot: String,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]

});


module.exports = mongoose.model("User", userSchema);