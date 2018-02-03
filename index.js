const
  express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  app = express();

console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/acmlink');

let
	linkSchema = mongoose.Schema({
    shorturl: {
      type: String,
      unique: true,
      required: true,
    },
		longurl: {
      type: String,
      required: true,
    },
	}),
  Link = mongoose.model("Link", linkSchema);

app.use(bodyParser.json());

app.post("/", (request, response) => {
  let link = new Link(request.body);
  link.save((err,newLink) => {
    if (err) {
      return response
        .status(500)
        .send("Link couldn't be made", err);
    }
    
    return response.send(newLink); 
  });
});

app.get('/:shorturl', (request, response) => {
  Link.findOne({
    shorturl: request.params.shorturl,
  }, (err, link) => {
    if (err) {
      return response
        .status(500)
        .send("Link couldn't be found", err);
    } else if (!link) {
      return response
        .status(404)
        .send("Link doesn't exist");
    }

    return response.send(link);
  });
});

console.log("Server running on localhost:" + process.env.PORT || 3000);
app.listen(process.env.PORT || 3000);
