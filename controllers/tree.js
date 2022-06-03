const Tree = require('../models/Tree')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const jwt = require('jsonwebtoken');
/*
exports.getList = (req, res, next) => {
    Group.find({}, function(err, list) {
        res.status(200).json({success:true,list})
    })
    
}*/

exports.getTree = async (req, res, next) => {    
    const userId = getToken(req).id
    try{
        const tree = await Tree.find({ members: userId }).populate('members')
    
    
        if(tree.length===0){
            return next(new ErrorResponse("No Tree found", 404))
        }
        
        res.status(200).json({success:true,tree})
    }catch(e){
        console.log(e.message)
    }
}

exports.getPublicTrees = async (req, res, next) => {    
    try{
        const groups = await Group.find({ public: true })
    
        if(groups.length===0){
            return next(new ErrorResponse("No Groups found", 404))
        }
        console.log(groups)
        res.status(200).json({success:true,groups})
    }catch(e){
        console.log(e.message)
    }
}

exports.createTree = async (req, res, next) => {
    const {name} = req.body;
    const createdBy = getToken(req).id
    const members = [createdBy]
    if(!name){
        return next(new ErrorResponse("Please provide a tree name", 400))
    }
    try {
        const tree = await Tree.create({ 
            name, createdBy, members
        })
        res.status(200).json({success:true,tree})
    } catch (error) {
        next(error);
    }
    
}

exports.joinTree = async (req, res, next) => {
    const treeId = req.params.treeId
    const tree = await Tree.findById(treeId)
    const userId = getToken(req).id
    
    if(!tree){
        return next(new ErrorResponse("Tree not found", 404))
    }
    
    await tree.addMember(userId)
    
    tree.save()
    
    tree.populate('members')
    
    res.status(200).json({success:true,tree})
}

exports.leaveTree = async (req, res, next) => {
    const groupId = req.params.groupId
    const group = await Group.findById(groupId)
    const userId = getToken(req).id
    
    if(!group){
        return next(new ErrorResponse("Group not found", 404))
    }
    
    await group.removeMember(userId)
    
    group.save()
    
    res.status(200).json({success:true,group})
}


exports.getGroupMessages = async (req, res, next) => {
    const groupId = req.params.groupId
    const group = await Group.findById(groupId)
    
    if(!group){
        return next(new ErrorResponse("Group not found", 404))
    }
    const list = await group.getMessages()
    res.status(200).json({success:true,list})
}


exports.undoTodo = async (req, res, next) => {
    const id = req.params.todoItem
    const item = await TodoItem.findById(id)
    const username = getToken(req).username

    if(!item){
        return next(new ErrorResponse("Item not found", 404))
    }

    await item.undoTask(username)

    item.save()

    res.status(200).json({success:true,item})
    
}

const getToken = (req) => {
    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET)
    return decoded
}