const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const role = require('../helper/role');

const schema = new Schema({
  username: { type: String, unique: true, required: true },
  avatar_link: { type: String },
  gmail: { type: String, unique: true, required: true },
  mssv: { type: Number, unique: true, required: true },
  hash: { type: String, required: true },
  fullname: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  khoa: { type: String, require: true },
  nien_khoa: { type: String, require: true },
  address: { type: String },
  role: { type: role, require: true },
  class_ids: { type: [] },
  create_date: { type: Date, default: Date.now },
  list_images: { type: [] },
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});

module.exports = mongoose.model('User', schema);
