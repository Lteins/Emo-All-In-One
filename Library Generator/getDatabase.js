
const https = require('https')
//const request = require('request')
const jsonfile = require('jsonfile')
var waterfall = require('async-waterfall');
const Spotify = require('node-spotify-api')
const check = require('./check')
const apikey = 'd1fb43dfec91588198d98395842bbe9d'
var data = 'data.json';

const accessToken ="BQAKHV0lsdemZ44hXWmIH_7IEMMXJNy85RhPInPlzq1ZDydKYbYR4LwoaiDmMlcgXCLspvUpvp6s8Xv-sZdJexkznT9kXP3yotqNHcAsLXi1z6S2zQ5Bv468mMiuB8l0VrfsKhE_HO-NDJ4i0P1U-37DOoqub19iRY_5ArKaSTVnA_geb2QMYmvoCHr9FrUqo9aPyq7Tmbe23CaDwQXCKjAFAj_NjVS4pAzlRHkTXVpA7Teu6eWEh46b8r7oE-0sPauY3h9rhkudIUMY3H3nCJmdEwPIenxcQvoJi3w-A783NyEaMjk"

https.get('https://api.musixmatch.com/ws/1.1/chart.tracks.get?apikey='+apikey+'&country=US&page=2&page_size=100&f_has_lyrics=1&format=json', (resp) => {
	var allTracks = "";
	var lyric = "";
	resp.setEncoding('utf8')
	resp.on('data', (d) => {
		allTracks = allTracks + d
	})

	var dataSet = {"track_list": []}
	resp.on('end',
		function(){
		allTracks = JSON.parse(allTracks)
		var track_list = allTracks.message.body.track_list;


		var start = function (finish){
			var trackNum = 0;
			console.log("New Step");
			console.log(trackNum);
			https.get('https://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey='+apikey+'&track_id='+track_list[trackNum].track.track_id, (resp) => {
				var lyrics = '';
				resp.setEncoding('utf8')
				resp.on('data', (d2) => {
					d2 = JSON.parse(d2);
					lyrics = d2.message.body.lyrics.lyrics_body
					var trackInfo = ''
					var _track = track_list[trackNum].track

					// var HOST = "api.spotify.com"
					// var PATH = ("/v1/search?q=name:"+ _track.track_name+" album:"+_track.album_name+" artist:"+ _track.artist_name+"&type=track")//.replace(/([ ])/g, '\%')
					// console.log(HOST+PATH)
					// console.log("What happens?");
					// console.log(encodeURI(HOST+PATH));


					// const options = {
					// 	protocol: 'https:',
					// 	host: HOST,
					// 	path: encodeURI(PATH),
					// 	headers: {
					// 		"Authorization": "Bearer BQDUMYJA47EjvDDYJiixvqI2N36GDavcQhqg-8pj8raBxuJ7zVqqCkMU77H3Sla-FwFZIlmk58TAqfIEulID0g2--N3XolYgtFnNyH8CBvcXb_-McjE7XA1awwjysjSC9jSsU64MNKK4QFMTi3Kuw24SYm2H3aSBl15EpAap2H-_44sSS5THIsTYYpzjkBvK5Qe6LOlPhyRo3ZRwAH947R6oPgoEETn9NYUSvuvUf3ao4YToe82igLSceT0jA616rzJmT4o"
					// 	}
					// }
					// https.get(options, (resp3) => {
					// 		resp3.setEncoding('utf8')
					// 		resp3.on('data', (d3) => {
					// 			d3 = JSON.parse(d3);
					// 			console.log(d3)


					var q =  _track.track_name+'%20album:'+_track.album_name+'%20artist:'+_track.artist_name+'&type=track';
					// q = encodeURI(q);
					// while(q.indexOf('%20')>=0)
					// q = q.replace('%20',' ');
					

					// while (q.indexOf("%")>=0){
					// 	var cut = q.indexOf("%");
					// 	q = q.substring(0, cut) + q.substring(cut+3);
					// }

					console.log(q);
					const options = {
					    hostname: 'api.spotify.com',
					    path:'/v1/search?q='  + q + "&type=track" + "&limit=1",
					    headers: {
					      'Accept': 'application/json',
					      'Authorization': "Bearer " + accessToken,
					      'Content-Type': 'application/json'
					    },
					    method: 'GET'
					 };
					 
					 while (options.path.indexOf(" ") >= 0){
					 	options.path = options.path.replace(" ","%20");
					 }
					console.log(options.path);
					const requesting = https.request(options, (resp) => {
						// console.log("abc");
						resp.setEncoding('utf8');
						var data = "";
						resp.on('data', (d) => {
							data = data + d;
						})
						resp.on("end", function(){
							data = JSON.parse(data);
							console.log("Begin!");
							console.log("length is" + data.tracks.items.length)
							if (data.tracks.items.length > 0){
								console.log("We reach here");
							var id = data.tracks.items[0].id;
							var trackInfo ={

									"spotify_id": id,
									"spotify_total": data.tracks.total,
									"track_name": _track.track_name,
									"track_rating": _track.track_rating, 
									"artist" : _track.artist_name,
									"lyrics": lyrics,
									"emoScore": ''};
							check.analyze(lyrics, function(result) {
								// console.log("result is " + result);
								// console.log(JSON.parse(result));
								result = JSON.parse(result);
								trackInfo.emoScore = result.documents[0].score;
								dataSet.track_list.push(trackInfo)
								
								if(trackNum == track_list.length -1) {
									console.log("The final call back function");
									console.log(trackInfo);
									console.log(dataSet);
									//console.log(dataSet)
									finish(null, 'done');
								}else{
									console.log("We reach the strange point");
									finish(null, trackNum + 1);
								}
							});
							}else{
								
								if(trackNum == track_list.length - 1) {
									console.log("We reach another kind of final block");
									finish(null, 'done');
								}else{
									console.log("We reach the strange point");
									finish(null, trackNum + 1);
								}		
							}
						})


					})
					requesting.end();
				})
			})		
		}

		var step = function (trackNum,finish){
			console.log("Am i executed?");
			console.log("New Step");
			console.log(trackNum);
			https.get('https://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey='+apikey+'&track_id='+track_list[trackNum].track.track_id, (resp) => {
				var lyrics = ''
				resp.setEncoding('utf8')
				resp.on('data', (d2) => {
					d2 = JSON.parse(d2);
					lyrics = d2.message.body.lyrics.lyrics_body
					var trackInfo = ''
					var _track = track_list[trackNum].track

					var q =  _track.track_name+'%20album:'+_track.album_name+'%20artist:'+_track.artist_name+'&type=track';

					console.log(q);
					const options = {
					    hostname: 'api.spotify.com',
					    path:'/v1/search?q='  + q + "&type=track" + "&limit=1",
					    headers: {
					      'Accept': 'application/json',
					      'Authorization': "Bearer " + accessToken,
					      'Content-Type': 'application/json'
					    },
					    method: 'GET'
					 };
					 
					 while (options.path.indexOf(" ") >= 0){
					 	options.path = options.path.replace(" ","%20");
					 }
					console.log(options.path);
					const requesting = https.request(options, (resp) => {
						// console.log("abc");
						resp.setEncoding('utf8');
						var data = "";
						resp.on('data', (d) => {
							data = data + d;
						})
						resp.on("end", function(){
							data = JSON.parse(data);
							console.log("Begin!");
							console.log("length is" + data.tracks.items.length)
							if (data.tracks.items.length > 0){
								console.log("We reach here");
							var id = data.tracks.items[0].id;
							var trackInfo ={

									"spotify_id": id,
									"spotify_total": data.tracks.total,
									"track_name": _track.track_name,
									"track_rating": _track.track_rating, 
									"artist" : _track.artist_name,
									"lyrics": lyrics,
									"emoScore": ''};
							check.analyze(lyrics, function(result) {
								// console.log("result is " + result);
								// console.log(JSON.parse(result));
								result = JSON.parse(result);
								trackInfo.emoScore = result.documents[0].score;
								dataSet.track_list.push(trackInfo)
								
								if(trackNum == track_list.length -1) {
									console.log("The final call back function");
									console.log(trackInfo);
									console.log(dataSet);
									//console.log(dataSet)
									finish(null, 'done');
								}else{
									finish(null, trackNum + 1);
								}
							});
							}else{
				
								
								if(trackNum == track_list.length - 1) {
									console.log("We reach another kind of final block");
									finish(null, 'done');
								}else{
									finish(null, trackNum + 1);
								}		
							}
						})


					})
					requesting.end();
				})
			})		
		}

		function ending(err, result){
			console.log(err);
			console.log(dataSet)
			jsonfile.writeFile('library.json', dataSet, {spaces: 2}, function(err) {
				if(err) {
					console.log(err)
				}
			})
		}
		console.log("Before Everything begins");
		console.log(track_list.length);
		var tasks = [start];
		for (i = 1;i<track_list.length;i++){
			tasks.push(step);
		}
		waterfall(tasks, ending);
	})
})