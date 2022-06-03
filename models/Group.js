const mongoose = require('mongoose')
const Message = require('./Message')

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide groups name"],
    },
    createTime: {
        type: Date,
        default: Date.now()
    },
    members: {
        type: [String],
        default: []
    },
    createdBy: String,
    public: {
        type: Boolean,
        default: true
    },
    messages: {
        type: [String],
        default: []
    }
})

GroupSchema.methods.matchGroup = function(id){
    return id === this.id
}

GroupSchema.methods.getMessages = function(){
    return this.messages
}

GroupSchema.methods.getMembers = function(){
    return this.members
}

GroupSchema.methods.addMember = function(member){
    this.members = this.members.concat([member])
}

GroupSchema.methods.removeMember = function(member){
    var index = this.members.indexOf(member);
    this.members.splice(index, 1);
}

GroupSchema.methods.message = function(message){
    this.messages = this.messages.concat([message])
}

GroupSchema.methods.changePrivacy = function(privacy){
    this.public = pricacy
}

GroupSchema.methods.getMessages = async function(){
    var list = []
    const messages = this.messages
    for (let index = 0; index < messages.length; index++) {
        const element = messages[index];
        
        const message = await Message.findById(element)  
        list = [...list,message]
    }
    
    return list;
}

const Group = mongoose.model("Group",GroupSchema);

module.exports = Group;