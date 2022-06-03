const DnaTest = require('../models/DnaTest')
const ErrorResponse = require('../utils/errorResponse')
const jwt = require('jsonwebtoken');

exports.getList = async (req, res, next) => {
    const requestBy = getToken(req).username
    const list = await DnaTest.find({ requestBy:  requestBy}).exec();
    res.status(200).json({success:true,list})
    
}

exports.requestDna = async (req, res, next) => {
    const {address, kitType, paymentMethod} = req.body;
    const requestBy = getToken(req).username
    if(!address){
        return next(new ErrorResponse("Please provide a address", 400))
    }
    try {
        const test = await DnaTest.create({ 
            address, kitType, paymentMethod, requestBy
        })
        res.status(200).json({success:true,test})
    } catch (error) {
        next(error);
    }
    
}
exports.deliverDna = async (req, res, next) => {
    const testId = req.params.dnatestid
    const test = await DnaTest.findById(testId)
    
    if(!test){
        return next(new ErrorResponse("DNA test not found", 404))
    }
    
    await test.deliverTest()
    
    test.save()
    
    res.status(200).json({success:true,test})
}



const getToken = (req) => {
    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET)
    return decoded
}