/**  **/
const
  express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/acmlink');

/** SCHEMA **/
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
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

/** POST A NEW LINK OBJECT **/
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

/** UPDATING A SHORTURL **/
app.put('/:shorturl', (request,response) => {
  Link.findOneAndUpdate({
    shorturl: request.params.shorturl,
  }, {
    $set: {
      longurl: request.body.longurl,
    },
  }, {
    new: true,
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

/** GET LINK OBJECT GIVEN SHORTURL **/
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
