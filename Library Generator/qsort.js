var _ = require('lodash');
var request = require('request')

var database = require('./library.json');
const jsonfile = require('jsonfile')
database = _.sortBy(database.track_list, 'emoScore');
jsonfile.writeFile('lib2.json', database, {spaces: 2}, function(err) {
  console.log(err)
})

