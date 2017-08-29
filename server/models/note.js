const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true  },
  text:  { type: String }
});

module.exports = mongoose.model('Note', noteSchema);
