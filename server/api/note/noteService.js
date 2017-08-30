const Note = require('../../models/note');

exports.create = function(req, res) {
  Note.find().byTitle(req.body.title).exec(function (err, note){
    if(err){
      res.send(err);
    }else if (note.length > 0) {
      return res.json('Woops, the note '+note[0].title+' already exists.');
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

  Note.find().byTitle(noteTitle).exec(function (err, note){
    console.log(err);
  });
  res.send("The title of your note is: "+noteTitle);
};

