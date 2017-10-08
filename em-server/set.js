const https = require('https')
const querystring = require('querystring');
const clientId = 'fcecfc72172e4cd267473117a17cbd4d';
const clientSecret = 'a6338157c9bb5ac9c71924cb2940e1a7'
const albumName = 'Emosong recommend'
const accessToken ="BQAKHV0lsdemZ44hXWmIH_7IEMMXJNy85RhPInPlzq1ZDydKYbYR4LwoaiDmMlcgXCLspvUpvp6s8Xv-sZdJexkznT9kXP3yotqNHcAsLXi1z6S2zQ5Bv468mMiuB8l0VrfsKhE_HO-NDJ4i0P1U-37DOoqub19iRY_5ArKaSTVnA_geb2QMYmvoCHr9FrUqo9aPyq7Tmbe23CaDwQXCKjAFAj_NjVS4pAzlRHkTXVpA7Teu6eWEh46b8r7oE-0sPauY3h9rhkudIUMY3H3nCJmdEwPIenxcQvoJi3w-A783NyEaMjk"
const userID = 'gn920arx8c50mbgmg1cv78exf';


    const host = "accounts.spotify.com"
    var path = ""
    var access_token

    const options = {
        hostname: 'api.spotify.com',
        path:'/v1/users/'+userID+'/playlists',
        headers: {
          'Accept': 'application/json',
          'Authorization': "Bearer " + accessToken,
          'Content-Type': 'application/json'
        },
        method: 'POST'
     };

    const postData = {
    'name': 'Emosong'
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