// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var tumblr = require('tumblr');
var url = require('url');
var ejs = require('ejs');
var async = require('async');

var view = fs.readFileSync(__dirname + '/view.ejs', 'utf8');


var oauth = {
  consumer_key: 'SUNpLgKqnJjL8biuJCEA0Iktk7oudjtinZIW4n7d7ueJi9N8ZG',
  consumer_secret: 'ExLHAr9JtVhaBqXhrtWcMURLMz0o6L00S6gk6OYrPvfDvwF7E6',
  token: 'SUNpLgKqnJjL8biuJCEA0Iktk7oudjtinZIW4n7d7ueJi9N8ZG',
  token_secret: 'ExLHAr9JtVhaBqXhrtWcMURLMz0o6L00S6gk6OYrPvfDvwF7E6'
};

var dataStore = [];

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    var queryData = url.parse(request.url, true).query;
    queryData = queryData.data;

   var finalData = [];

    var user = new tumblr.User(oauth);
     var tagged = new tumblr.Tagged(oauth);

function searchTumblr(item, callback) {

            tagged.search(item, function(error, res) {
                    if (error) {
                          throw new Error(error);
                    }
                    finalData.push(res);
                    callback();

            });

}

    response.writeHead(200, {'Content-Type': 'text/html'});

    if (typeof queryData !== 'undefined' && queryData!=null) {

          dataStore.push(queryData);

          async.each(dataStore, searchTumblr, function(err){
                          console.log(finalData.length);
                          console.log(dataStore);

                          console.log(finalData);
                          if(typeof finalData !== 'undefined' && finalData!=null && finalData.length>0) {

			                          response.write(ejs.render(view, {locals: {
			                                data: finalData,
			                                dataStore: dataStore.length,
                                      queryData: queryData
			                           }}));

                                console.log("made it here");
			                          response.end();

			                   } else {

			                          response.write(ejs.render(view));
			                          response.end();
			                    }
          });


    }


}).listen(Number(process.env.PORT || 5000));

console.log("Server running at http://127.0.0.1:5000/");
