angular.module('pasteit.services', [])

.factory('socket', function(){
    //Creating connection with server
    var socket = io.connect('http://localhost:3000');


    socket.on('socketToMe', function(data){
      // use the socket as usual
      console.log(data);
    });
  return socket;

});
