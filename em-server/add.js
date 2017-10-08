const https = require('https')
const querystring = require('querystring');
const clientId = 'fcecfc72172e4cd267473117a17cbd4d';
const clientSecret = 'a6338157c9bb5ac9c71924cb2940e1a7'
const albumName = 'Emosong recommend'
const accessToken ="BQBJ0te1L_sVnygejYQ7l3fHArvBKT7PKdNlRlON0bOtsQRta-n27ohVxkABdekTjmwpwY7-PBVUfUtZ7NkZ_IuDrOxGabYhlz2SdzUqbzZUdovHyPkybQQsjUOxDdXvdfZviXsU9SdiK4KO8kul1Sb8d5l3FlhsSROL9O5wNPFalu57gc4tgEuuCjv-YYfDq9KsDNzEMzkSNGnQcQ-0a5z8ea6IkD9ZWx6UCNc_Y7KCungFZbz2rcmyxJzpZI9wlNQHkcAmabSzxY1LxaYbTQm532A6UWfNcf2tfGrdPPyyBoqidso"

const userID = 'gn920arx8c50mbgmg1cv78exf';
const playlistID = "1AxpqnTLrD9k6uDfskwwiY";




exports.add = function(id){
const options = {
    hostname: 'api.spotify.com',
    path:"/v1/users/"+userID+"/playlists/"+playlistID+"/tracks",
    headers: {
      'Accept': 'application/json',
      'Authorization': "Bearer " + accessToken,
      'Content-Type': 'application/json'
    },
    method: 'POST'
 };

const postData = {
'uris': ["spotify:track:"+id]
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(JSON.stringify(postData));
req.end();  
}
