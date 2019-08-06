require("dotenv").config();
//require("node-spotify-api");
let keys = require("./keys.js");
const axios = require("axios");
const Spotify = require("node-spotify-api");
const moment = require("moment");
//const dotenv = require("dotenv").config();
const inquirer = require("inquirer");

let command;
let searchedItem;

//This may not be needed

inquirer
.prompt([
    {
        type: "input",
        name: "name",
        message: "What is your name?"
    },
    {
        type: "list",
        name: "typeOfEvent",
        message: "Which suits your fancy?",
        choices: ["Songs", "Concerts", "Movies", "Random"]
    },
    {
      type: "input",
      name: "searchName",
      message: "What are you looking for?"
  }
])
.then((response) => {
  console.log("Welcome " + response.name + ". You are looking for " + response.typeOfEvent + ".");
  
  switch (response.typeOfEvent) {
    case "Songs":
      command = "spotify-this-song";
      break;
    case "Concerts":
      command = "concert-this";
      break;
    case "Movies":
      command = "movie-this";
      break;
    case "Random":
      command = "do-what-it-says";
      break;
    default:
      console.log("Please pick a valid command.");
      break;
  }

  searchedItem = response.searchName;

  search(searchedItem);
})
.catch((err) => {
    console.error(err.message);
});

/*
function getCommand(){
  switch (process.argv[2]) {
    case "Songs":
      command = "spotify-this-song";
      break;
    case "Concerts":
      command = "concert-this";
      break;
    case "Movies":
      command = "movie-this";
      break;
    case "Random":
      command = "do-what-it-says";
      break;
    default:
      console.log("Please pick a valid command.");
      break;
  }

  searchedItem = process.argv[3];
  search(searchedItem);
}*/

function search(item){
  var spotify = new Spotify(keys.spotify);
 
  spotify.search({ type: 'track', query: searchedItem }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } 
    console.log(data); 
    });
}

//getCommand();