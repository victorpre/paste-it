const express = require('express');
const noteService = require('../api/note/noteService')

module.exports = function(server) {

  const apiRouter = express.Router();
  const staticRouter = express.Router();

  // Static Pages rendering router
  staticRouter.get('/', function(req, res){
    res.json({message: "horray"});
  });

  //  API router
  apiRouter.get('/notes/:title.:format?', noteService.show);
  apiRouter.post('/notes', noteService.create);

  server.use('/', staticRouter);
  server.use('/api/v2', apiRouter);

}
