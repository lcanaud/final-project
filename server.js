/*
  file:   server.js
  desc:   script that configures a HTTP server that listens to incoming client connections.
          Clients are expected to send chat-like messages (see index.html) which are replied 
          to depending if certain patterns are recognised in the message (or not). The idea
          is to create a simple artificial conversation between the a human subject and the 
          script. The work is inspired by Alan Turing's Imitation Game and Joseph Weizenbaum's
          ELIZA. 
  author: Lena Canaud (Based on David Gauthier's work)
  date:   21/11/16
*/

// import express ()
var express = require('express');		// npm install --save express
var app = express();

// import node.js http
var server = require('http').Server(app);

// import socket.io
var io = require('socket.io')(server);	// npm install --save socket.io

// import chance (http://chancejs.com)
var chance = require('chance').Chance(); // npm install --save chance

//Parameters for the Quizz

var mix=0;
var qst=new Array();
var n=-1

n++;qst[n]=new Array(10);
qst[n][0]=

/**
* Picks a random element from an array
* @param {Array} array
* @return {Object} choice
*/
function choice(array) {

  var index = chance.natural({'min': 0, 'max': array.length - 1});  // **** NOTE: 'max': array.length - 1

  return array[index];
}

/**
* Randomly picks or not a random element from an array
* @param {Array} array
* @return {Object} choice 
* @return {String} empty string
*/
function maybe(array) {

  if( chance.bool() ) {

    return choice(array);

  } else {

    return '';

  }
}

function validerForm(){
    document.getElementById("formulaire").submit();
}

function question(){
  console.log("Ceci est un test en attendant de parametrer")
}




/* ----------------------------------
	Server and Socket Configuration
--------------------------------------*/

// tell express to server our index.html file
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// configure socket.io
// (1) when there is a connection 
io.on('connection', function(socket) {

  console.log('Somebody is here! ');

  
  io.emit('message from robot', 'Hi! my name is Deep Thought!'); // greetings

  // (2) configure the connected socket to receive custom messages ('message from human')
  // and call the function answer to produce a response
  socket.on('message from human', function(msg) {

    console.log('You have a new message: ' + msg);

    var response = answer(msg);  	                  /// <--- call of the function answer defined above 

  	io.emit('message from robot', response);

  });

  socket.on('disconnet', function() {

  	console.log('Your friend has gone.');
  	
  });

});

/* -------------------
	Start the server
----------------------*/

// listen to connection on port 8088 --> http://localhost:8088
server.listen(8088, function () {
	console.log('listening on port: ' + 8088);
});