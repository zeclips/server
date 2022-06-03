const mongoose = require('mongoose')
const User = require('./User')

const MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Please provide message text"],
    },
    author: {
        type: {
            id: String,
            name: String
        },
        required: [true, "Please provide a author"]
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

MessageSchema.methods.getAuthor = async function(){
    return await User.findById(this.author);
}

const Message = mongoose.model("Message",MessageSchema);

module.exports = Message;