require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
const axios = require("axios");
const Spotify = require("node-spotify-api");
const moment = require("moment");
const inquirer = require("inquirer");

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
  
  let searchedItem;

  if(response.searchName === "" && response.typeOfEvent === "Songs"){
    searchedItem = "The Sign";
    console.log("The default search is ", searchedItem);
  }
  else if(response.searchName === "" && response.typeOfEvent === "Movies"){
    searchedItem = "Mr. Nobody";
    console.log("The default search is ", searchedItem);
  }
  else if(response.searchName === "" && response.typeOfEvent === "Concerts"){
    searchedItem = "Chris Brown";
    console.log("The default search is ", searchedItem);
  }
  else{
    searchedItem = response.searchName;
    console.log("You searched ", searchedItem);
  }
  
  console.log("-----------------------------------------------------------------------------------------------------------------------");
  writeToLog("----------------------------------------------------------------------------------------------------------------------------------------\n" + moment().format('LLLL') + "\n" + response.name + " looked for " + response.typeOfEvent + ": " + searchedItem + "\n----------------------------------------------------------------------------------------------------------------------------------------\n");
  search(response.typeOfEvent, searchedItem);
})
.catch((err) => {
    console.error(err.message);
});

function search(type, item){
  switch (type) {
    case "Songs":
        searchSpotify(item);
      break;
    case "Concerts":
      searchBandsInTown(item);
      break;
    case "Movies":
      searchMovie(item)
      break;
    default:
      //"do-what-it-says"
      searchRandom();
      break;
  }
}

function searchSpotify(item){
  var spotify = new Spotify(keys.spotify);
 
  spotify.search({ type: 'track', query: item, limit: 5 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } 
    
      // console.log("data object", data.tracks.items[0]);
      // console.log("artist", data.tracks.items[0].artists[0].name);
      // console.log("song", data.tracks.items[0].name);
      // console.log("album", data.tracks.items[0].album.name);
      // console.log("preview", data.tracks.items[0].external_urls.spotify);
      
      let songResp = data.tracks.items;
      for (let i = 0; i < songResp.length; i++) {
        console.log("Song Name: " + songResp[i].name + "\nArtist Name: " + songResp[i].artists[0].name + "\nAlbum Name: " + songResp[i].album.name + "\nLink to Sample: " + songResp[i].external_urls.spotify + "\n");

        writeToLog("Song Name: " + songResp[i].name + "\nArtist Name: " + songResp[i].artists[0].name + "\nAlbum Name: " + songResp[i].album.name + "\nLink to Sample: " + songResp[i].external_urls.spotify + "\n\n");
      }
    });
}

function searchBandsInTown(artist){
  let url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  axios.get(url).then(
  function(response) {
    //console.log("BIT response: ", response);
    // console.log("Venue Name gives the name of the Tour: ", response.data[0].venue.name);
    // console.log("Venue Location: ", response.data[0].venue.city + ", " + response.data[0].venue.region);
    // console.log("Date (still needs to be converted): ", response.data[0].datetime);

    let concertResp = response.data;
    if(concertResp.length > 0){
    for (let i = 0; i < concertResp.length; i++) {
      console.log("Artist(s): " + concertResp[i].lineup + "\nVenue: " + concertResp[i].venue.name + "\nLocation: " + concertResp[i].venue.city + ", " + concertResp[i].venue.region + "\nDate: " + moment(concertResp[i].datetime).format('MM/DD/YYYY') + "\n");

      writeToLog("Artist(s): " + concertResp[i].lineup + "\nVenue: " + concertResp[i].venue.name + "\nLocation: " + concertResp[i].venue.city + ", " + concertResp[i].venue.region + "\nDate: " + moment(concertResp[i].datetime).format('MM/DD/YYYY') + "\n\n");
    }
  }
  else{
    console.log("Sorry, no concerts for " + artist + " were found.");
    writeToLog("Sorry, no concerts for " + artist + " were found.\n\n");
  }

  }).catch(function(error) {
  if (error.response) {
    console.log('---------------Data---------------');
    console.log(error.response.data);
    console.log('---------------Status---------------');
    console.log(error.response.status);
    console.log('---------------Status---------------');
    console.log(error.response.headers);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log('Error', error.message);
  }
    console.log(error.config);
  })
}

function searchMovie(film) {
  let url = "https://www.omdbapi.com/?t=" + film + "&y=&plot=short&apikey=trilogy";
  axios.get(url).then(
  function(response) {
    //console.log("Movie response: ", response);
    
    let movieResp = response.data;
    console.log("Title: " + movieResp.Title + "\nYear: " + movieResp.Year + "\nRating: " + movieResp.Rated + "\nIMDb Rating: " + movieResp.imdbRating + "\nRotten Tomatoes Rating: " + movieResp.Ratings[1].Value + "\nCountry: " + movieResp.Country + "\nLanguage: " + movieResp.Language + "\nPlot: " + movieResp.Plot + "\nActors: " + movieResp.Actors + "\n");

    writeToLog("Title: " + movieResp.Title + "\nYear: " + movieResp.Year + "\nRating: " + movieResp.Rated + "\nIMDb Rating: " + movieResp.imdbRating + "\nRotten Tomatoes Rating: " + movieResp.Ratings[1].Value + "\nCountry: " + movieResp.Country + "\nLanguage: " + movieResp.Language + "\nPlot: " + movieResp.Plot + "\nActors: " + movieResp.Actors + "\n\n");
  }).catch(function(error) {
  if (error.response) {
  console.log('---------------Data---------------');
  console.log(error.response.data);
  console.log('---------------Status---------------');
  console.log(error.response.status);
  console.log('---------------Status---------------');
  console.log(error.response.headers);
  } else if (error.request) {
  console.log(error.request);
  } else {
  console.log('Error', error.message);
  }
  console.log(error.config);
  })
}

function searchRandom(){
  fs.readFile("./assets/random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }

    let dataLine = data.split("\n");
    //console.log(dataLine + "\n");

    for (let i = 0; i < dataLine.length; i++) {
      let dataArr = dataLine[i].split(",");
      
      switch (dataArr[0]) {
        case "spotify-this-song":
            searchSpotify(dataArr[1]);
          break;
        case "concert-this":
            searchBandsInTown(dataArr[1]);
          break;
        case "movie-this":
            searchMovie(dataArr[1]);
          break;
        default:
          console.log("You are now entering the Twilight Zone.");
          break;
      }      
    }
       
    

  });
}

function writeToLog(info){
  fs.appendFile("./assets/log.txt", info, function(err) {

    if (err) {
      return console.log(err);
    }
  
  });
}