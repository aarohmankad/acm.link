const
  express = require('express'),
  mongoose = require('mongoose'),
  app = express();

mongoose.connect('mongodb://localhost/acmlink');
let 
	linkSchema = mongoose.Schema({
    shorturl: String,
		longurl: String,
	}),
  Link = mongoose.model("Link", linkSchema);

app.post("/", (request, response) => {
  let link = new Link(request.body);
  link.save((err,newLink) => {
    if (err) {
      return response
        .status(500)
        .send("Link couldn't be made", err);
    }
    response.send(newLink); 
  });
});

app.get('/:shorturl', (request, response) => {
  response.redirect('http://google.com');
});




console.log("Server running on localhost:3000");
app.listen(3000);
