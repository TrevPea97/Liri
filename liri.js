console.log("inside liri js");

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs 		= require('fs');

var spotify = new Spotify({
	id: '2c7c838f2f094b92a90d8a1c01a88a27',
	secret: '2c7c838f2f094b92a90d8a1c01a88a27'
});

var keys 	= require('/twitter.js');

var cmdArgs = process.argv;

var liriCommand = process.argv[2];

var liriArg = '';
for(var i=3; i<cmdArgs.length; i++){
	liriArg += cmdArgs[i] + '';
}

function retrieveTweets(){
	fs.appendFile('./log.txt', 'User Command: node liri.js my-tweets\n\n', (err) => {
		if(err) throw err;
	});

	var client = new Twitter(keys);
	var params = {screen_name: 'Jaymar_14', count: 20};

	client.get('statuses/user_timeline', params, function(error,tweets,response){
		console.log('Tweets: ' + response);
		console.log(tweets);
		if(error){
			var errorStr = 'ERROR: retrieving user tweets -- ' + error;
			fs.appendFile('./log.txt', errorStr,(err) => {
				if(err) throw err;
				console.log(errorStr);
			});
			return;
		} else {
			var outputStr = '--------------\n' +
										'User Tweets:\n' +
											'----------------\n\n';
			for(var i=0; i<tweetsLength; i++){
				outputStr += 'Created on: ' + tweets[i].created_at + '\n' + 
												'Tweets: ' + tweets[i].text + '\n' +
												'-------------------------\n';

			}
			fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n',(err) => {
				if(err) throw err;
				console.log(outputStr);
			});

		}
	});
}

function spotifySong(song){

			fs.appendFile('./log.txt', 'User Command: node liri.js spotify-this-song' + song + '\n\n', (err) => {
				if(err) throw err;
			});
			var search;
			if(song === ''){
				search = 'The Sign Of Ace';
			} else {
				search = song;
			}

			spotify.search({ type: 'track', query: search}, function(error, data){
				if(error) {
					var errorStr1 = 'ERROR: Retrieving Spotify track -- ' + error;
					fs.appendFile('./log.txt', errorStr1, (err) => {
						if(err) throw err;
						console.log(errorStr1);
					});
					return;
				} else{
					var songInfo = data.tracks.items[0];
					if(!songinfo){
						var errorStr2 = 'ERROR: No song info retrieved';
						fs.appendFile('./log.txt', errorStr2, (err) => {
							if(err) throw err;
							console.log(errorStr2);
						});
						return;
					} else {
						var outputStr = '--------------\n'+
													'Song Information:\n' +
													'---------------------\n\n'+
													'Song Name: ' + songInfo.name + '\n'+
													'Artist: ' + songInfo.artist[0].name+ '\n'+
													'Album: ' + songInfo.album.name+ '\n' +
													'Preview Here: ' + songInfo.preview_url + '\n';

						fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr +'\n', (err) => {
							if(err) throw err;
							console.log(outputStr);
						});
					}
				}
			});
		}

	function retrieveOBDBInfo(movie) {

	fs.appendFile('./log.txt', 'User Command: node liri.js movie-this ' + movie + '\n\n', (err) => {
		if (err) throw err;
	});


	var search;
	if (movie === '') {
		search = 'Mr. Nobody';
	} else {
		search = movie;
	}

	


	var queryStr = 'http://www.omdbapi.com/?t=' + search + '&y=&plot=full&apikey=40e9cece';


	request(queryStr, function (error, response, body) {
		if ( error || (response.statusCode !== 200) ) {
			var errorStr1 = 'ERROR: Retrieving OMDB entry -- ' + error;

		
			fs.appendFile('./log.txt', errorStr1, (err) => {
				if (err) throw err;
				console.log(errorStr1);
			});
			return;
		} else {
			var data = JSON.parse(body);
			if (!data.Title && !data.Released && !data.imdbRating) {
				var errorStr2 = 'ERROR: No movie info retrieved!';

			
				fs.appendFile('./log.txt', errorStr2, (err) => {
					if (err) throw err;
					console.log(errorStr2);
				});
				return;
			} else {
		  
		    	var outputStr = '------------------------\n' + 
								'Movie Information:\n' + 
								'------------------------\n\n' +
								'Movie Title: ' + data.Title + '\n' + 
								'Year Released: ' + data.Released + '\n' +
								'IMBD Rating: ' + data.imdbRating + '\n' +
								'Rotten Tomatoes Rating: ' + data.tomatoRating + '\n' +
								'Country Produced: ' + data.Country + '\n' +
								'Language: ' + data.Language + '\n' +
								'Plot: ' + data.Plot + '\n' +
								'Actors: ' + data.Actors + '\n'; 
								

	
				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
					if (err) throw err;
					console.log(outputStr);
				});
			}
		}
	});
}


function doAsTheySay() {

	fs.appendFile('./log.txt', 'User Command: node liri.js do-what-it-says\n\n', (err) => {
		if (err) throw err;
	});


	fs.readFile('./random.txt', 'utf8', function (error, data) {
		if (error) {
			console.log('ERROR: Reading random.txt -- ' + error);
			return;
		} else {
	
			var cmdString = data.split(',');
			var command = cmdString[0].trim();
			var param = cmdString[1].trim();

			switch(command) {
				case 'my-tweets':
					retrieveTweets(); 
					break;

				case 'spotify-this-song':
					spotifySong(param);
					break;

				case 'movie-this':
					retrieveOBDBInfo(param);
					break;
			}
		}
	});
}


if (liriCommand === 'my-tweets') {
	retrieveTweets(); 

} else if (liriCommand === `spotify-this-song`) {
	spotifySong(liriArg);

} else if (liriCommand === `movie-this`) {
	retrieveOBDBInfo(liriArg);

} else if (liriCommand ===  `do-what-it-says`) {
	doAsTheySay();

} else {

	fs.appendFile('./log.txt', 'User Command: ' + cmdArgs + '\n', (err) => {
		if (err) throw err;


		outputStr = 'Commands:\n' + 
				   '    node liri.js my-tweets\n' + 
				   '    node liri.js spotify-this-song "<song_name>"\n' + 
				   '    node liri.js movie-this "<movie_name>"\n' + 
				   '    node liri.js do-what-it-says\n';

		fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
			if (err) throw err;
			console.log(outputStr);
		});
    });
    

}	
