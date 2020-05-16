const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Float = require('mongoose-float').loadType(mongoose);

const schema = new Schema({
    class_id: { type: String, required: true },
    secret: { type: String, required: true },
    location: { type: {longtitude:{type:Float},latitude:{type:Float}}},
    user_create:{type:String},
    isOpen:{type:Boolean,default:true},
    created_date: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('Room', schema);