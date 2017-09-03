const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true, unique: true },
  text:  { type: String }
});

noteSchema.query.byTitle = function(title) {
  return this.find({ title: new RegExp(title, 'i')});
};

module.exports = mongoose.model('Note', noteSchema);
