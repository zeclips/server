const crypto = require('crypto')
const mongoose = require('mongoose'), Schema = mongoose.Schema
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"]
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        match: [
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            "Please provide a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    gender: {
        //required: [false, "Please provide a gender"],
        default: "",
        type: String
    },
    parents: {
        type: [{
            id: { type: Schema.Types.ObjectId, ref: 'User' },
            type: {type: String}
        }],
        default: []
    },
    siblings: {
        type: [{
            id: { type: Schema.Types.ObjectId, ref: 'User' },
            type: {type: String}
        }],
        default: []
    },
    children: {
        type: [{
            id: { type: Schema.Types.ObjectId, ref: 'User' },
            type: {type: String}
        }],
        default: []
    },
    spouses: {
        type: [{
            id: { type: Schema.Types.ObjectId, ref: 'User' },
            type: {type: String}
        }],
        default: []
    }

});

UserSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return//next()
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    //next()
})

UserSchema.methods.addProgenitor = function(index,progenitor) {
    const aux = this.progenitors
    aux[index] = progenitor
    this.progenitors = aux
}

UserSchema.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.getSignedToken = function(){
    return jwt.sign({ id: this._id, username: this.username}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
}

UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
    
    return resetToken
}

const User = mongoose.model("User",UserSchema);

module.exports = User;