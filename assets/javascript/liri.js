require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var params = {screen_name: 'sblapray'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});

var command = process.argv[2];
var songName = process.argv.slice(3).join(" ");

spotify.search({ type: 'track', query: songName })
    .then(function (response) {
        var items = response.tracks.items;
        for (item of items) {
            console.log("------------------------------");
            console.log("Song: " + item.name);
            var artists = [];
            for (artist of item.album.artists) {
                artists.push(artist.name);
            }

            if (artists.length > 1) {
                console.log("Artists: " + artists.join(", "));
            } else {
                console.log("Artist: " + artists.shift());
            }

            console.log("Preview: " + item.external_urls.spotify);
            console.log("Album: " + item.album.name);
            console.log("------------------------------");
        }
    })
    .catch(function (error) {
        console.log("Error: " + error);
    });

var request = require("request");

var command = process.argv[2];
var movieName = process.argv.slice(3).join("+");

request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
    console.log(response.body, JSON.parse(body));

    if (!error && response.statusCode === 200) {


        console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
    }
});


function runCommand(command, input) {
    switch (command) {
        case "my-tweets":
            selectedShowMyTweets();
            break;
        case "spotify-this-song":
            spotifySearchSongName(input)
            break
        case "movie-this":
            getMovieInfo(input);
            break
        default: break
    }
}

function selectedDoWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        var command = dataArr[0];

        if (dataArr.length == 0) {
            console.log("No data in random.txt");
        } else if (dataArr.length == 1) {
            runCommand(dataArr[0], "")
        } else if (dataArr.length > 1) {
            runCommand(dataArr[0], dataArr[1])
        }
    });
}