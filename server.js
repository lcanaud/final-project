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


var count_1 = 0;
var count_2 = 0;
var count_3 = 0;

//Questions arrays

const wh_words = ["What", "Why", "How", "Where"];
const nouns_tastes = ["cat", "colour", "plant", "day of the week"];
const question_adjective = ["favourite", "beloved", ""]

// Answer arrays
/* here is the elememtns to buil answers. There is 2 types :
 - dependting in the word used in the question (eg. colour)
 - elements to build answers randomly generated.
*/
const person_answers = ["grand-ma", "UK prime minister", "dog", "your secret love", "an alien", "an unicorn"];
const object_answers = [];
const verbs = ["run into", "eat", "forget", "go with", ];
const colour_answer = []
const adverbs = ["magically", 'gently']


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

function question_builder(){
  
  switch(choice([1, 2]))
  {
    case 1:
      return choice(wh_words)+' is your'+choice(question_adjective)+' '+choice(nouns_tastes);

    case 2:
      return "What would you do if "+choice(person_answers)+' '+choice(verbs)+' '+choice(person_answers)+'?';
  }
}

function answer_builder(){

  switch(choice([1, 2]))
  {
    case 1:
      return "I would "+choice(adverbs)+' '+choice(verbs)+' with '+choice(person_answers);

    case 2:
      return "I would"+choice(verbs)+' '+choice(person_answers)+" and "+choice(verbs)+' '+choice(object_answers);
  }
}

function display_question() {
  return "is it okay ?";
  }

function make_choice2(previous_question) {



  return {"question": question_builder(), "response_1": "haha", "response_2": "hééééé", "response_3": "hooooo"};

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
 
  
  io.emit('message from robot', {"question": "§§§§§§§§§§§§", "response_1": "oooo", "response_2": "llllll", "response_3": "pppppp"}); // greetings
  

  // (2) configure the connected socket to receive custom messages ('message from human')
  // and call the function answer to produce a response
  socket.on('message from human', function(msg) {

    console.log('You have a new message: ' + JSON.stringify(msg));

    if(msg.choice2) {

      console.log("choice2");

      io.emit('message from robot', make_choice2(msg.question));
    }


  });

  /*socket.on ('somebody answered', function(ans) {

    var reponse = question_builder(ans);

     io.emit('new question', reponse);

  });
  */

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