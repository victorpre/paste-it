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
  apiRouter.get('/notes/:title', noteService.show);
  apiRouter.post('/notes', noteService.create);
  apiRouter.put('/notes/:title', noteService.update);

  server.use('/', staticRouter);
  server.use('/api/v2', apiRouter);

}
