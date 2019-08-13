// Include the npm packages 
require("dotenv").config();
let inquirer = require("inquirer");
var axios = require("axios");
var fs = require("fs");
var spotify = require("node-spotify-api");
let moment = require("moment");
//keys
var keys = require("./keys.js");
var spotify = new spotify(keys.spotify);


/*
// Then run a request with axios to the OMDB API with the movie specified
axios.get("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy").then(
  function(response) {
    console.log("The movie's rating is: " + response.data.imdbRating);
  })
  .catch(function(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("---------------Data---------------");
      console.log(error.response.data);
      console.log("---------------Status---------------");
      console.log(error.response.status);
      console.log("---------------Status---------------");
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });


   
  spotify.search({ type: 'track', query: 'Silent in the morning' }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
  console.log("======Artist Name=======")
  console.log(data.tracks.items[0].album.artists[0]);
  console.log(`Previrew : ${data.tracks.items[7].album.external_urls.spotify}`); 
  }); */

  //calling the name of the user
inquirer
.prompt([
  {
    type: "input",
    message: "What is your name?",
    name: "username"
  },
  {
    type: "list",
    message: "What would you like to ask about: concerts, spotify songs, movies?",
    choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
    name: "choice"
  },
])
//concert this
.then(function (res) {
  if (res.choice === "concert-this") {
    console.log("\n=================");
    console.log(`\nWelcome ${res.username}`);
    console.log("\n=================");
    //asking about an artist
    inquirer
      .prompt([
        {
          type: "input",
          message: "What artist are you interested?",
          name: "artist"
        }
      ]).then(function (result) {
        let artist = result.artist;
        //calling Bands in Town api
        let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
        //getting results from API
        if(result.artist == ""){
          console.log("Please, enter an artist");
        } else {
          axios.get(queryUrl).then(
            function (response) {
              //looping through resonse data info
              for (let i = 0; i < response.data.length; i++) {
                //converting date with moment()
                let date = moment(response.data[i].datetime).format('MM/DD/YYYY')
                console.log("\n=================");
                console.log(`Venue name:  ${response.data[i].venue.name}`);
                console.log(`Country:  ${response.data[i].venue.country}`);
                console.log(`Date:  ${date}`);
                console.log("=================");
              }
              //appending artist to log.txt
              fs.appendFile("log.txt", `\nArtist: ${artist}`, function (err) {
                // If an error was experienced we will log it.
                if (err) {
                  console.log(err);
                }
                // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                else {
                  console.log(`Artist ${artist.toUpperCase()} added to log.txt file !`);
                }
              });
            })
        }
    
      })
  } else if (res.choice === "spotify-this-song") {
    console.log("\n=================");
    console.log(`\nWelcome ${res.username}`);
    console.log("\n=================");
    //asking about Spotify
    inquirer
      .prompt([
        {
          type: "input",
          message: "What track are you interested?",
          name: "track"
        }
      ])
      .then(function (result) {
        if (result.track == "") {
          result.track = "The Sign";
          spotify
            .search({ type: 'track', query: result.track })
            .then(function (response) {

              console.log("\n=================");
              console.log("\n=================");
              console.log(`Song:  ${response.tracks.items[7].name}`);
              console.log(`Artist: ${response.tracks.items[7].album.artists[0].name}`);
              console.log(`Spotify Preview: ${response.tracks.items[7].album.external_urls.spotify}`);
              console.log(`Album: ${response.tracks.items[7].album.name}`);
              console.log(`Release Year: ${response.tracks.items[7].album.release_date}`);
              console.log(`Preview: ${response.tracks.items[7].preview_url}`);
              console.log("\n=================");
              //appending song to log.txt
              fs.appendFile("log.txt", `\nSong: ${result.track}`, function (err) {
                // If an error was experienced we will log it.
                if (err) {
                  console.log(err);
                }
                // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                else {
                  console.log(`Song ${result.track.toUpperCase()} added to log.txt file !`);
                }
              });
            })
            .catch(function (err) {
              console.log(err);
            });
        } else {
          spotify
            .search({ type: 'track', query: result.track })
            .then(function (response) {

              console.log("\n=================");
              for (let i = 0; i < response.tracks.items.length; i++) {
                console.log("\n=================");
                console.log(`Song:  ${response.tracks.items[i].name}`);
                console.log(`Artist: ${response.tracks.items[i].album.artists[0].name}`);
                console.log(`Spotify Preview: ${response.tracks.items[i].album.external_urls.spotify}`);
                console.log(`Album: ${response.tracks.items[i].album.name}`);
                console.log(`Release Year: ${response.tracks.items[i].album.release_date}`);
                console.log(`Preview: ${response.tracks.items[i].preview_url}`);
                console.log("\n=================");
              }
              //appending song to log.txt
              fs.appendFile("log.txt", `\nSong: ${result.track}`, function (err) {
                // If an error was experienced we will log it.
                if (err) {
                  console.log(err);
                }
                // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                else {
                  console.log(`Song ${result.track.toUpperCase()} added to log.txt file !`);
                }
              });
            })
            .catch(function (err) {
              console.log(err);
            });
        }

      })
    //Do what it says
  } else if (res.choice === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
      // If the code experiences any errors it will log the error to the console.
      if (error) {
        return console.log(error);
      }
      spotify
        .search({ type: 'track', query: data })
        .then(function (response) {
          console.log("\n=================");
          for (let i = 0; i < response.tracks.items.length; i++) {
            console.log("\n=================");
            console.log(`Song:  ${response.tracks.items[i].name}`);
            console.log(`Artist: ${response.tracks.items[i].album.artists[0].name}`);
            console.log(`Spotify Preview: ${response.tracks.items[i].album.external_urls.spotify}`);
            console.log(`Album: ${response.tracks.items[i].album.name}`);
            console.log(`Release Year: ${response.tracks.items[i].album.release_date}`);
            console.log(`Preview: ${response.tracks.items[i].preview_url}`);
            console.log("\n=================");
          }
          //appending movies to log file
          fs.appendFile("log.txt", `\nSong: ${data}`, function (err) {
            // If an error was experienced we will log it.
            if (err) {
              console.log(err);
            }
            // If no error is experienced, we'll log the phrase "Content Added" to our node console.
            else {
              console.log(`Song ${data.toUpperCase()} Added to log.txt file !`);
            }
          });
        })

    })

  }
  // OMDB movie-this
  else if (res.choice === "movie-this") {
    console.log("\n=================");
    console.log(`\nWelcome ${res.username}`);
    console.log("\n=================");
    //asking about movie
    inquirer
      .prompt([
        {
          type: "input",
          message: "What movie are you interested?",
          name: "movie"
        }
      ]).then(function (result) {
        //if a user enters nothing then Mr Nobody
        if (result.movie == "") {
          // result.movie = "Mr.Nobody";
          // console.log(result.movie);
          // ombdMovie();
          axios.get("http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy").then(
            function (response) {
              console.log("\n=================");
              console.log(`Title: ${response.data.Title}`);
              console.log(`Year: ${response.data.Year}`);
              console.log(`IMBD Rating: ${response.data.imdbRating}`);
              console.log(`Country: ${response.data.Country}`);
              console.log(`Language: ${response.data.Language}`);
              console.log(`Actors: ${response.data.Actors}`);
              console.log(`Plot: ${response.data.Plot}`);
              console.log("\n=================");
            })
          //appending Mr/Nobody to log file
          fs.appendFile("log.txt", `\nMovie: ${'Mr.Nobody'}`, function (err) {

            // If an error was experienced we will log it.
            if (err) {
              console.log(err);
            }

            // If no error is experienced, we'll log the phrase "Content Added" to our node console.
            else {
              console.log(`Movie ${'Mr.Nobody'} Added to log.txt file!`);
            }

          });
        }
        else {
          let ombdMovie = function () {
            axios.get("http://www.omdbapi.com/?t=" + result.movie + "&y=&plot=short&apikey=trilogy").then(
              function (response) {
                // if Error
                if (response.data.Error) {
                  console.log('Movie not found!');
                }
                //if movie found
                else if (result.movie) {
                  console.log("\n=================");
                  console.log(`Title: ${response.data.Title}`);
                  console.log(`Year: ${response.data.Year}`);
                  console.log(`IMBD Rating: ${response.data.imdbRating}`);
                  console.log(`Country: ${response.data.Country}`);
                  console.log(`Language: ${response.data.Language}`);
                  console.log(`Actors: ${response.data.Actors}`);
                  console.log(`Plot: ${response.data.Plot}`);
                  console.log("\n=================");
                }
              })
          }
          ombdMovie();
          //appending movies to log file
          fs.appendFile("log.txt", `\nMovie: ${result.movie}`, function (err) {

            // If an error was experienced we will log it.
            if (err) {
              console.log(err);
            }

            // If no error is experienced, we'll log the phrase "Content Added" to our node console.
            else {
              console.log(`Movie ${result.movie.toUpperCase()} Added to log.txt file !`);
            }
          });
        }
      })
  }
})


