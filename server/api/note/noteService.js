const Note = require('../../models/note');

exports.create = function(req, res) {
  const noteTitle = req.body.title;
  Note.findOne({ title: noteTitle }, function (err, note) {
    if(err){
      res.send(err);
    }else if(note != null){
      return res.status(409).json({ success: false, data: {message: 'Woops, the note '+noteTitle+' already exists.'}});
    }else {
      var newNote = Note({title: req.body.title, text: req.body.text });
      newNote.save(function(err){
        if(!err){
          console.log('Note created.');
        }
      })
       return res.json(newNote);
    }
  });
};

exports.show = function(req, res) {
  const noteTitle = req.params.title;

  Note.findOne({ title: noteTitle }, function (err, note) {
    if(note != null){
      res.json(note);
    }else {
      res.status(404).json({ success: false, data: {message: 'This note doesnt exist.'} });
    }
  });
};


exports.update = function(req, res) {
  const noteTitle = req.params.title;
  const noteText  = req.body.text;
  Note.findOneAndUpdate({ title: noteTitle }, { text: noteText }, {new: true}, function(err, note){
    if(err){
      res.send(err);
    }

    if(note != null){
      res.json(note);
    }else {
      res.status(404).json({ success: false, data: {message: 'This note doesnt exist.'}});
    }
  });
};
