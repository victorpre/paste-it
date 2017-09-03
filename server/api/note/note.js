const restful = require('node-restful');
const mongoose = restful.mongoose;

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true  },
  text:  { type: String }
});

module.exports = restful.model('Note', noteSchema);
