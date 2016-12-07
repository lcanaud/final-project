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

//Questions (general)

const wh_words = ["What", "Why", "How", "Where"];
const will_verbs = ["want", "prefer", "try to", "chose", "argue to", "propose"];
const belonging = ["my ", "your ", "a ", "the ", "the ", "a ", "a "];

// Answer arrays

//const person_answers = ["grand-ma", "UK prime minister", "dog", "your secret love", "an alien", "an unicorn"];
//const object_answers = [];
//const verbs = ["run into", "eat", "forget", "go with", "build a comic show with" ];
//const colour_answer = ["orange", "blue", "red", "brown", "I don't have a favorite colour"];
//const adverbs = ["magically", 'gently'];


//Answer Level 1 = passive (something relatively normal)

const characters1 = ["primary school teacher", "Grand-ma", "cat", "dog", "squirrel ", "ghost", "secret love"];
const verbs1 = ["eat", "go away with", "curtomize", "give back", "run into"];
const objects1 = ["mathematic test", "vase", "bouquet of flowers", "laptop", "slice of pizza", "cloud", "rain", "hat"];
const adjectives1 = ["brilliant", "catastrophic", "ridiculus", "forgotten", "strange", "small", "little", "big", "enormous"];
const adverbs1 = ["gently", "lovely", "kindly", "suddently"];
const place1 = ["a bathroom", "a classroom", "the Dam", "Centraal Station", "a windmill", "the world", "your bed"];
const time1 = ["suddently", "on Monday", "on Wednesday", "on Sunday"];

//Answer Level 2 = cretive (something a bit creative)

const characters2 = ["a pig", "Grand-pa", "Prime Minister", "crocodile", "gentleman", "lawyer", "me"];
const verbs2 = ["ride", "be proud of", "congratulates", "get married with", "forget"];
const objects2 = ["apple pie", "film", "movie", "Youtube video", "illusion"];
const adjectives2 = ["unexpected", "brilliant", "catastrophic", "weak", "kind", "cute"];
const adverbs2 = ["unbelievably", "suddently"];
const place2 = ["the world", "the Titanic", "a boat", "a desert island", "Japan", "Hungary", "the US", "The Netherlands", "a church"];
const time2 = ["suddently", "on Monday", "on Wednesday", "on Sunday", "tomorow", "next week", "in 42 minutes", "sometimes", "usualy", ""];


// Answeer Level 3 = wierd  (something really wierd)

const characters3 = ["God", "unicorn", "unkown creature", "salsa dancer", "flying car", "pangolin", "me"];
const verbs3 = ["kiss", "invite to conquier the world with", "stay", "remain", "cotton candy"];
const objects3 = ["trousers", "ladybug", "socks", "toenail", "pumpkin", "illusion"];
const adjectives3 = ["ironic", "unknown", "alive", "alone", "calm", "strange", "hypothetical", "magic"];
const adverbs3 = ["ironically", "magically", "gently", "suddently"];
const place3 = ["the world", "the universe", "Pluton", "Saturn", "a spatialship"];
const time3 = ["Suddently", "On Monday", "On Wednesday", "On Sunday", "Tomorow", "Next week", "In 42 minutes", "Sometimes", "Usualy", "In another life", "After the end of the world"];

// Results 1 Passive :

const adjectives_r_1 = [];
const verbs_r_1 = [];
const characters_r_1 = [];
const adverbs_r_1 = [];

// Results 2 Creative :
const adjectives_r_2 = [];
const verbs_r_2 = [];
const characters_r_2 = [];
const adverbs_r_2 = [];

// Results 3 Creative :
const adjectives_r_3 = [];
const verbs_r_3 = [];
const characters_r_3 = [];
const adverbs_r_3 = [];


/**
* Picks a random element from an array
* @param {Array} array
* @return {Object} choice
*/
function choice(array) {

  if(array.length == 0) return "***nothing***";

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

/*function question_builder(){
  
  switch(choice([1, 2]))
  {
    case 1:
      return choice(wh_words)+' is your '+choice(question_adjective)+' '+choice(nouns_tastes);

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
      return "I would "+choice(verbs)+' '+choice(person_answers)+" and "+choice(verbs)+' '+choice(object_answers);
  }
}
*/

//Questions builders (in function of the level chosen)

function question_level1() {
  
   switch(choice([1, 2]))
  {
    case 1:
      return choice(time1)+" a "+choice(adjectives1)+" event happens: "+choice(characters1)+" "+choice(verbs1)+" "+choice(objects1)+" "+choice(characters1)+".";

    case 2:
      return "What would you do if "+choice(characters1)+' '+choice(verbs1)+' '+choice(characters1)+'?';
  }
}

function question_level2() {
 
   switch(choice([1, 2]))
  {
    case 1:
      return choice(time1)+" a "+choice(adjectives1)+" event happens: "+choice(belonging)+choice(characters1)+" "+choice(verbs1)+" "+choice(belonging)+choice(objects1)+" "+choice(belonging)+choice(characters1)+".";

    case 2:
      return "What would you do if "+choice(belonging)+choice(characters1)+' '+choice(verbs2)+' '+choice(belonging)+choice(characters2)+'?';
  }
}

function question_level3() {
  
   switch(choice([1, 2]))
  {
    case 1:
      return choice(time1)+" a "+choice(adjectives1)+" event happens: "+choice(belonging)+choice(characters1)+" "+choice(verbs1)+" "+choice(belonging)+choice(objects1)+" "+choice(belonging)+choice(characters1)+".";

    case 2:
      return "What would you do if "+choice(belonging)+choice(characters3)+' '+choice(verbs3)+' '+choice(belonging)+choice(characters3)+'?';
  }
}


// Answer builder (in function of the level)

function answer_level1() {
  switch(choice([1, 2, 3]))
  {
    case 1:
      return "I would "+choice(adverbs1)+' '+choice(verbs1)+' '+choice(belonging)+choice(characters1);

    case 2:
      return "I would "+choice(verbs1)+' '+choice(belonging)+choice(characters1)+" and "+choice(belonging)+choice(verbs1)+' '+choice(belonging)+choice(objects1);
  
    case 3:
      return "Oh, I "+choice(["am sorry", "apologize"])+", this question is too "+choice(adjectives1)+" for me. I can't "+choice(["choose", "select", "elect", "prefer"])+" one.";
  }
}

function answer_level2() {
  switch(choice([1, 2]))
  {
    case 1:
      return "I would "+choice(adverbs2)+' '+choice(verbs2)+' with '+choice(belonging)+choice(characters2);

    case 2:
      return "I would "+choice(verbs2)+' '+choice(belonging)+choice(characters2)+" and "+choice(verbs2)+' '+choice(belonging)+choice(objects2);
  }
}

function answer_level3() {
  switch(choice([1, 2]))
  {
    case 1:
      return "I would "+choice(adverbs3)+' '+choice(verbs3)+' with '+choice(belonging)+choice(characters3);

    case 2:
      return "I would "+choice(verbs3)+' '+choice(belonging)+choice(characters3)+" and "+choice(verbs3)+' '+choice(belonging)+choice(objects3);
  }
}


function make_choice1(previous_question) {


  return {"question": question_level1(), "response_1": answer_level1(), "response_2": answer_level2(), "response_3": answer_level3(), "results": ""};

}

function make_choice2(previous_question) {


  return {"question": question_level2(), "response_1": answer_level1(), "response_2": answer_level2(), "response_3": answer_level3(), "results": ""};

}

function make_choice3(previous_question) {

  return {"question": question_level3(), "response_1": answer_level1(), "response_2": answer_level2(), "response_3": answer_level3(), "results": ""};
}

function results_1(previous_question) {
  return {"question": "You can read the results below", "response_1": "", "response_2": "", "response_3": "", "results": "ceci est un test 1"};
}

function results_2(previous_question) {
  return {"question": "You can read the results below", "response_1": "", "response_2": "", "response_3": "", "results": "ceci est un test 2"};
}

function results_3(previous_question) {
  return {"question": "You can read the results below", "response_1": "", "response_2": "", "response_3": "",  "results": "ceci est un test 3"};
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
 
  
  io.emit('message from robot', {"question": "Which kind of dream do you prefer?", "response_1": "Something relatively normal", "response_2": "Something a bit creative", "response_3": "Something really weird!", "results": ""}); // greetings
  

  // (2) configure the connected socket to receive custom messages ('message from human')
  // and call the function answer to produce a response
  socket.on('message from human', function(msg) {

    console.log('You have a new message: ' + JSON.stringify(msg));

    if(msg.choice1) {

      console.log("choice1");

      io.emit('message from robot', make_choice1(msg.question));

      count_1++;
    }

    if(msg.choice2) {

      console.log("choice2");

      io.emit('message from robot', make_choice2(msg.question));

      count_2++;
    }

    if(msg.choice3) {

      console.log("choice3");

      io.emit('message from robot', make_choice3(msg.question));

      count_3++;
    }



    if (count_1 + count_2 + count_3 == 4) {

      if (count_1 >= count_2 && count_1 > count_3) {

        io.emit('message from robot', results_1());

      }
      
      if (count_2 > count_1 && count_2 >= count_3) {

        io.emit('message from robot', results_2());
      }

      if (count_3 >= count_1 && count_3>count_2) {

        io.emit('message from robot', results_3());
      }

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