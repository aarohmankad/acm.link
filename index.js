const
  express = require('express'),
  app = express();

app.get('/:shorturl', (request, response) => {
  response.redirect('http://google.com');
});

console.log("Server running on localhost:3000");
app.listen(3000);
