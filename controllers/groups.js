const Group = require('../models/Group')
const Message = require('../models/Message')
const ErrorResponse = require('../utils/errorResponse')
const jwt = require('jsonwebtoken');
/*
exports.getList = (req, res, next) => {
    Group.find({}, function(err, list) {
        res.status(200).json({success:true,list})
    })
    
}*/

exports.getGroup = async (req, res, next) => {    
    const userId = getToken(req).id
    try{
        const groups = await Group.find({ members: userId })
    
    
        if(groups.length===0){
            return next(new ErrorResponse("No Groups found", 404))
        }
        
        res.status(200).json({success:true,groups})
    }catch(e){
        console.log(e.message)
    }
}

exports.getPublicGroups = async (req, res, next) => {    
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

exports.createGroup = async (req, res, next) => {
    const {name} = req.body;
    const createdBy = getToken(req).id
    const members = [createdBy]
    if(!name){
        return next(new ErrorResponse("Please provide a group name", 400))
    }
    try {
        const group = await Group.create({ 
            name, createdBy, members
        })
        res.status(200).json({success:true,group})
    } catch (error) {
        next(error);
    }
    
}

exports.joinGroup = async (req, res, next) => {
    const groupId = req.params.groupId
    const group = await Group.findById(groupId)
    const userId = getToken(req).id
    
    if(!group){
        return next(new ErrorResponse("Group not found", 404))
    }
    
    await group.addMember(userId)
    
    group.save()
    
    res.status(200).json({success:true,group})
}

exports.leaveGroup = async (req, res, next) => {
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

exports.messageGroup = async (req, res, next) => {
    const groupId = req.params.groupId
    const {text} = req.body;
    const group = await Group.findById(groupId)
    const author = {
        id: getToken(req).id,
        name: getToken(req).username
    }
    
    if(!group){
        return next(new ErrorResponse("Group not found", 404))
    }

    try {
        const message = await Message.create({ 
            text, author, groupId
        })
        
        await group.message(message._id)

        group.save()
        res.status(200).json({success:true,message})
    } catch (error) {
        next(error);
    }
    
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