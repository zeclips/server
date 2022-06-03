const Post = require('../models/Post')
const Message = require('../models/Message')
const ErrorResponse = require('../utils/errorResponse')
const jwt = require('jsonwebtoken');

exports.getList = (req, res, next) => {
    Post.find({}, function(err, list) {
        res.status(200).json({success:true,list})
    })
    
}

exports.addPost = async (req, res, next) => {
    const {text} = req.body;
    const author = getToken(req).username

    if(!text){
        return next(new ErrorResponse("Please provide a post text", 400))
    }
    try {
        const post = await Post.create({ 
            text, author
        })
        res.status(200).json({success:true,post})
    } catch (error) {
        next(error);
    }
    
}
exports.delPost = async (req, res, next) => {
    const postId = req.params.post
    const post = await Post.findById(postId)
    const userId = getToken(req).username
    
    if(!post){
        return next(new ErrorResponse("Post not found", 404))
    }
    const result = await post.matchUser(userId)
    if(!result){
        return next(new ErrorResponse("User not authorized to delete task (Ownership)", 400))
    }
    try {
        await Post.deleteOne(post)
        return res.status(200).json({success:true,post})
    } catch (error) {
        next(error);
    }
    
    res.status(200).json({success:true,post})
}

exports.upvotePost = async (req, res, next) => {
    const postId = req.params.post;
    const post = await Post.findById(postId)
    const author = getToken(req).username
    
    if(!post){
        return next(new ErrorResponse("Post not found", 404))
    }

    try {
        const result = await post.upvote(author)

        post.save()
        if (result)
            res.status(200).json({success:true,post})
        else
            res.status(409).json({success:false,post})

    } catch (error) {
        next(error);
    }
    
}

exports.downvotePost = async (req, res, next) => {
    const postId = req.params.post;
    const post = await Post.findById(postId)
    const author = getToken(req).username
    
    if(!post){
        return next(new ErrorResponse("Post not found", 404))
    }

    try {
        const result = await post.downvote(author)

        post.save()
        if (result)
            res.status(200).json({success:true,post})
        else
            res.status(409).json({success:false,post})

    } catch (error) {
        next(error);
    }
    
}


const getToken = (req) => {
    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET)
    return decoded
}