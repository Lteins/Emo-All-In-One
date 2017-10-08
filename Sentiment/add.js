const https = require('https')
const querystring = require('querystring');

const clientId = 'fcecfc72172e4cd267473117a17cbd4d';
const clientSecret = 'a6338157c9bb5ac9c71924cb2940e1a7'
const albumName = 'Emosong recommend'

//const accessToken = "BQDubcfRJ9tJDbAOZRtvI9UBUhuZv7FMtsVtqEXIuguS-nG4JH595YIUxRRcDUoIrVYrgx_gDOIxtsS6vi5_Xq0LwEKn-LSmU_6AVsj3J3QieiJSjwRS-1LlmCNjPwG0VR7g66biFY9M4jgXiCVhBfHJ5fP8przsLV_bmWHT9xbqOQn3eoSLUxdwc4Zo5e1D8zt_GMfaMYeH01vEuDV4J8_T6SqyL3vbKxd1I4wkKfZIHSwooOp0gxRo1FYoNldVEIK02PuaQA1nqNe95vAFY0Df7ZxQLI5Iw8QtnAs4vQUay04QaWU";

const userID = 'gn920arx8c50mbgmg1cv78exf';
const playlistID = "1AxpqnTLrD9k6uDfskwwiY";
var userJson = "../data/data1.json";


exports.add = function(id){
var jsonfile = require('jsonfile')
jsonfile.readFile(userJson, function(err, obj) {
    accessToken = JSON.parse(obj.spotify).access_token;
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
})
}
