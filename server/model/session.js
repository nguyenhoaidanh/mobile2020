const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Float = require('mongoose-float').loadType(mongoose);

const schema = new Schema({
  room_id: { type: String, required: true },
  link_face:{type: String,require: true},
  location: { type: { longtitude: { type: Float }, latitude: { type: Float } }, required: true },
  user_create: { type: String, require: true },
  create_date: { type: Date, default: Date.now },
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});

module.exports = mongoose.model('Session', schema);
