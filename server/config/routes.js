const express = require('express');
const noteService = require('../api/note/noteService')

module.exports = function(server) {

  const router = express.Router();
  router.get('/', function(req, res){
    res.json({message: "horray"});
  });

  router.get('/teste', noteService.test);

  server.use('/api', router);

}
