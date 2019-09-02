// var moment=require('moment')
// var date=moment(new Date()).add(1, 'days').format()


// // var date=new Date().add(1).day()

// console.log(typeof(date))

var http = require("https");

var options = {
  "method": "GET",
  "hostname": "api.rajaongkir.com",
  "port": null,
  "path": "/starter/province",
  "headers": {
    "key": "a69e60a290c4bd5e92b679513277e54f"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    // console.log(body.toJSON());
    console.log(JSON.stringify(body.toString()))
  });
});

req.end();