const mongoose = require('mongoose')
    , Schema = mongoose.Schema

const TreeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide tree name"],
    },
    createTime: {
        type: Date,
        default: Date.now()
    },
    members: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    public: {
        type: Boolean,
        default: true
    }
})

TreeSchema.methods.matchTree = function(id){
    return id === this.id
}

TreeSchema.methods.getMessages = function(){
    return this.messages
}

TreeSchema.methods.getMembers = function(){
    return this.members
}

TreeSchema.methods.addMember = function(member){
    this.members = this.members.concat([member])
}


TreeSchema.methods.changePrivacy = function(privacy){
    this.public = pricacy
}

const Tree = mongoose.model("Tree",TreeSchema);

module.exports = Tree;