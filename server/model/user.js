const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const role = require('../helper/role');

const schema = new Schema({
  username: { type: String, unique: true, required: true },
  avatar_url: { type: String },
  email: { type: String, unique: true, required: true },
  mssv: { type: Number, unique: true, required: true },
  hash: { type: String, required: true },
  fullname: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  faculty: { type: String, require: true },
  academic_year: { type: Number, require: true },
  address: { type: String },
  role: { type: role, require: true },
  class_ids: { type: [] },
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

module.exports = mongoose.model('User', schema);
