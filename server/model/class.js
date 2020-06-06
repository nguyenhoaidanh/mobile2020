const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name_subject: { type: String, required: true },
  code_subject: { type: String, required: true },
  secret: { type: String, required: true },
  number_of_student: { type: Number, required: true },
  code_class: { type: String, required: true },
  user_create: { type: String },
  teacher_id: { type: String, require },
  semester: { type: String, require: true },
  createdDate: { type: Date, default: Date.now },
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});

module.exports = mongoose.model('Class', schema);
