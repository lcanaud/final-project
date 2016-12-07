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
const will_verbs = ["want", "prefer", "try to", "chose", "propose", "would like", "would enjoy"];


// Question specific arrays

const q_verbs1 = ["ate", "got away with", "curtomized", "gave back to", "ran into", "talked with", "walked with"];
const q_verbs2 = ["rode", "was proud of", "congratulated", "got married with", "forgot"];
const q_verbs3 = ["kissed", "invited to conquer the world", "stayed", "remained"];


//Answer Level 1 = passive (something relatively normal)

const characters1 = ["your primary school teacher", "your Grand-ma", "a cat", "a dog", "a squirrel ", "a ghost", "your secret love", "your boss", "my friend"];
const verbs1 = ["eat", "get away with", "customize", "give back to", "run into", "talk with", "walk with"];
const objects1 = ["a mathematic test", "your mum's vase", "bouquet of flowers", "laptop", "slice of pizza", "cloud", "rain", "hat"];
const adjectives1 = ["brilliant", "catastrophic", "ridiculous", "forgotten", "clam", "small", "big", "enormous", "delicate", "ideal", "cold"];
const adverbs1 = ["gently", "lovely", "kindly", "suddently"];
const place1 = ["in a bathroom", "in a classroom", "on the Dam", "at Centraal Station", "near a windmill", "in the world", "in your bed"];
const time1 = ["Suddenly", "On Monday", "On Sunday", "On week days", "During school", "At word"];

//Answer Level 2 = cretive (something a bit creative)

const characters2 = ["a pig", "your Grand-pa", "the Prime Minister", "a crocodile", "a gentleman", "a lawyer", "me", "your lover"];
const verbs2 = ["ride", "be proud of", "congratulates", "get married with", "forget"];
const objects2 = ["an apple pie", "the film", "the movie", "some Youtube video", "an illusion"];
const adjectives2 = ["unexpected", "brilliant", "catastrophic", "weak", "kind", "cute", "charming", "admirable", "lovely"];
const adverbs2 = ["unbelievably", "suddently"];
const place2 = ["in the world", "on the Titanic", "on a boat", "on a deserted island", "in Japan", "in Hungary", "in the US", "in The Netherlands", "in a church"];
const time2 = ["Suddenly", "On Monday", "Tomorow", "Next week", "In 42 minutes", "Sometimes", "Usualy", ""];


// Answeer Level 3 = wierd  (something really wierd)

const characters3 = ["God", "a unicorn", "an unkown creature", "a salsa dancer", "a flying car", "a pangolin", "me", "a pinguin"];
const verbs3 = ["kiss", "invite to conquer the world", "stay", "remain"];
const objects3 = ["trousers", "a ladybug", "socks", "a toenail", "a pumpkin", "an illusion", "clumble of bread", "a cotton candy", "a witch"];
const adjectives3 = ["ironic", "unknown", "alive", "alone", "strange", "hypothetical", "magic", "adorable", "angelic"];
const adverbs3 = ["ironically", "magically", "gently", "suddently"];
const place3 = ["in the world", "in the universe", "on Pluto", "on Saturn", "in a spaceship", "in the Milky Way"];
const time3 = ["Suddenly", "On Sunday", "Tomorow", "Next week", "In 42 minutes", "Sometimes", "Usualy", "In another life", "After the end of the world"];

// Results 1 Passive :

const adjectives_r_1 = ["passive", "laid-back", "quiet", "patient", "complient", "nonviolent", "easygoing", "mellow", "low-pressure", "unhurried"];
const verbs_r_1 = ["walk", "talk", "play", "dance", "sing", "relax", "sit", "communicate", "bake"];
const characters_r_1 = ["Grand-ma", "Grand-pa", "pets", "dogs", "cats", "flowers", "the sky", "horses", "students", "stars"];

// Results 2 Creative :
const adjectives_r_2 = ["gifted", "ingenious", "innovative", "original", "clever", "inspired"];
const verbs_r_2 = ["draw", "paint", "observe", "study", "look at", "smell", "taste", "experiment on"];
const characters_r_2 = ["colours", "art", "sculpture", "painting", "museum", "music", "stars", "planets", "plants", "nature", "nature"];

// Results 3 Wierd :
const adjectives_r_3 = ["weird", "strange", "extraordinary", "mysterious", "mysterious", "eccentric", "freaky", "odd", "peculiar"];
const verbs_r_3 = ["assault", "cook", "dance", "conquer the world", "have a philosophic discussion", "haut", "debate politics", "build a spaceship"];
const characters_r_3 = ["unicorns", "rainbows", "bicycles", "giraffes", "garbage", "bird", "ladybugs", "toenails", "pumpkins"];



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


//First 
function capitalizeFirstLetters(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


//Questions builders (in function of the level chosen)

function question_level1() {
  
   switch(choice([1, 2, 3, 4, 5]))
  {
    case 1:
      return choice(time1)+" a "+choice(adjectives1)+" event happens: "+choice(characters1)+" "+choice(q_verbs1)+" "+choice(characters1)+".";

    case 2:
      return "What would you do if "+choice(characters1)+' '+choice(q_verbs1)+' '+choice(characters1)+'?';

    case 3:
      return choice(characters1)+" seems to be in "+choice(adjectives1)+" trouble "+choice(place1)+". What would you do?";

    case 4:
      return  choice(objects1)+" are on sale. "+choice(wh_words)+" do you "+choice(verbs1);

    case 5: 
      return choice(characters1)+" likes to "+choice(verbs1)+" "+choice(adverbs1)+". Do you join in?"; 
      
  }
}

function question_level2() {
 
   switch(choice([1, 2, 3, 4, 5]))
  {
    case 1:
      return choice(time1)+" a "+choice(adjectives2)+" event happens: "+choice(characters2)+" "+choice(q_verbs2)+" "+choice(characters2)+".";

    case 2:
      return "What would you do if "+choice(characters1)+' '+choice(q_verbs2)+' '+choice(characters2)+'?';

    case 3:
      return choice(characters2)+" seems to be in "+choice(adjectives2)+" trouble "+choice(place2)+ ". What would you do?";

    case 4:
      return  choice(objects2)+" are on sale. "+choice(wh_words)+" do you "+choice(verbs2);

    case 5: 
      return choice(characters2)+" likes to "+choice(verbs2)+" "+choice(adverbs2)+". Do you join in?";   
     
  }
}

function question_level3() {
  
   switch(choice([1, 2, 3, 4, 5]))
  {
    case 1:
      return choice(time1)+" a "+choice(adjectives3)+" event happens: "+choice(characters3)+" "+choice(q_verbs3)+" "+choice(characters3)+".";

    case 2:
      return "What would you do if "+choice(characters3)+' '+choice(q_verbs3)+' '+choice(characters3)+'?';
  
    case 3:
      return choice(characters3)+" seems to be in "+choice(adjectives3)+" trouble "+choice(place3)+". What would you do?";

    case 4:
      return  choice(objects3)+" are on sale. "+choice(wh_words)+" do you "+choice(verbs3);

    case 5: 
      return choice(characters3)+" likes to "+choice(verbs3)+" "+choice(adverbs3)+". Do you join in?";   
      
  }
}


// Answer builder (in function of the level)

function answer_level1() {
  switch(choice([1, 2, 3, 4, 5, 6]))
  {
    case 1:
      return "I would "+choice(adverbs1)+' '+choice(verbs1)+' '+choice(characters1);

    case 2:
      return "I would "+choice(verbs1)+' '+choice(characters1)+" and "+choice(verbs1)+' '+choice(objects1);
  
    case 3:
      return "Oh, I "+choice(["am sorry", "apologize"])+", this question is too "+choice(adjectives1)+" for me. I can't "+choice(["choose", "select", "elect", "prefer"])+" one.";

    case 4:
      return choice(characters1)+" needs to be "+choice(adjectives1)+". I "+choice(will_verbs)+" settle the matter peacefully.";

    case 5:
      return  "I don't like to "+choice(verbs1)+" "+choice(adverbs1)+". I shouldn't get involved "+choice(time1)+".";

     case 6: 
      return "That sounds "+choice(adjectives1)+". I agree.";
  }
}

function answer_level2() {
  switch(choice([1, 2, 3, 4, 5]))
  {
    case 1:
      return "I would "+choice(adverbs2)+' '+choice(verbs2)+' with '+choice(characters2);

    case 2:
      return "I would "+choice(verbs2)+' '+choice(characters2)+" and "+choice(verbs2)+' '+choice(objects2);

    case 3:
    return choice(characters2)+" is "+choice(adjectives2)+". I "+choice(adverbs2)+" "+choice(will_verbs)+" help immediately."  

    case 4:
    return choice(characters2)+" is my "+choice(adjectives2)+" inspiration. I "+choice(will_verbs)+" "+choice(verbs2)+" "+choice(place2)+".";

    case 5:
      return "I think whatever "+choice(characters2)+" is doing, is "+choice(adjectives2)+".";
  }
}

function answer_level3() {
  switch(choice([1, 2, 3, 4, 5]))
  {
    case 1:
      return "I would "+choice(adverbs3)+' '+choice(verbs3)+' with '+choice(characters3);

    case 2:
      return "I would "+choice(verbs3)+' '+choice(characters3)+" and "+choice(verbs3)+' '+choice(objects3);

    case 3: 
      return choice(characters3)+" has a lot of "+choice(adjectives3)+" "+choice(objects3)+". So I'll "+choice(adverbs3)+" "+choice(verbs3)+" with "+choice(characters3)+".";

    case 4:
      return  choice(adjectives3)+" "+choice(objects3)+" are "+choice(adjectives3)+" "+choice(place3)+". I don't like "+choice(characters3)+", so that's "+choice(adjectives3)+".";

    case 5:
      return "I "+choice(verbs3)+" a lot "+choice(time3)+" with "+choice(objects3)+". So yeah, you could say I "+choice(verbs3)+" "+choice(adjectives3)+".";  


  }
}

// Results Functions :

function results_passive() {

  return "You are a "+choice(adjectives_r_1)+" person. You like to "+choice(verbs_r_1)+" with "+choice(characters_r_1)+". Your dreams will feature "+choice(adjectives_r_1)+" "+choice(characters_r_1)+" on most days. However, if you have nightmares, there will be "+choice(adjectives_r_1)+" "+choice(characters_r_1)+" in them. You should watch out for "+choice(characters_r_1)+".";

}

function results_creative() {

  return "You are a "+choice(adjectives_r_2)+" person. You like to "+choice(verbs_r_2)+" "+choice(characters_r_2)+". Your dreams will feature "+choice(adjectives_r_2)+" "+choice(characters_r_2)+" on most days. However, if you have nightmares, there will be "+choice(adjectives_r_2)+" "+choice(characters_r_2)+" in them. You should watch out for "+choice(characters_r_2)+".";

}

function results_wierd() {

  return "You are a "+choice(adjectives_r_3)+" person. You like to "+choice(verbs_r_3)+" with "+choice(characters_r_3)+". Your dreams will feature "+choice(adjectives_r_2)+" "+choice(characters_r_3)+" on most days. However, if you have nightmares, there will be "+choice(adjectives_r_3)+" "+choice(characters_r_3)+" in them. You should watch out for "+choice(characters_r_3)+".";

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
  return {"question": "You can read the results below", "response_1": "", "response_2": "", "response_3": "", "results": results_passive()};
}

function results_2(previous_question) {
  return {"question": "You can read the results below", "response_1": "", "response_2": "", "response_3": "", "results": results_creative()};
}

function results_3(previous_question) {
  return {"question": "You can read the results below", "response_1": "", "response_2": "", "response_3": "",  "results": results_wierd()};
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
 
  
  io.emit('message from robot', {"question": "Which kind of dream do you prefer?", "response_1": "I "+choice(will_verbs)+" something "+choice(adjectives1), "response_2": "I "+choice(will_verbs)+" something "+choice(adjectives2), "response_3": "I "+choice(will_verbs)+" something "+choice(adjectives3), "results": ""}); // greetings
  

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