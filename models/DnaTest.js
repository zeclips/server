const mongoose = require('mongoose')

const DnaTestSchema = new mongoose.Schema({
    address: {
        type: String,
        required: [true, "Please provide adress"],
    },
    kitType: {
        type: String,
        required: [true, "Please provide a kit Type"]
    },
    requestTime: {
        type: Date,
        default: Date.now()
    },
    requestBy: String,
    paymentMethod: {
        type: String,
        required: [true, "Please provide a payment method"]
    },
    recieved: {
        type: Boolean,
        default: false
    }
})

DnaTestSchema.methods.matchUser = function(requestBy){
    return requestBy === this.requestBy
}

DnaTestSchema.methods.deliverTest = function(){
    this.recieved = true
}

const DnaItem = mongoose.model("DnaTest",DnaTestSchema);

module.exports = DnaItem;