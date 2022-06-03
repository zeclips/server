const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    createTime: {
        type: Date,
        default: Date.now()
    },
    text: {
        type: String,
        required: [true, "Please provide text"],
    },
    author: String,
    upvotes: {
        type: [String],
        default: []
    }
})

PostSchema.methods.matchUser = function(user){
    return user === this.author
}

PostSchema.methods.upvote = function(user){
    if(this.upvotes.indexOf(user) === -1) {
        this.upvotes.push(user);
        return true
    }
    return false
}

PostSchema.methods.downvote = function(user){
    const index = this.upvotes.indexOf(user);
    if (index > -1) {
        this.upvotes.splice(index, 1);
        return true
    }
    return false
}



const Post = mongoose.model("Post",PostSchema);

module.exports = Post;