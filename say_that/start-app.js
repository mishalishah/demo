var app = require('./app');

var server = app.listen(3000, function() {
  console.log("Server started on http://localhost:3000");
});
