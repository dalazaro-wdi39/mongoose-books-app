// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////

//require express in our app
var express = require('express'),
  bodyParser = require('body-parser');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({
  extended: true
}));

// database
var db = require('./models')



////////////////////
//  DATA
///////////////////



////////////////////
//  ROUTES
///////////////////

// define a root route: localhost:3000/
app.get('/', function(req, res) {
  res.sendFile('views/index.html', {
    root: __dirname
  });
});

// get all books
app.get('/api/books', function index(req, res) {

  // send all books as JSON response
  db.Book.find()
    // populate fills in the author id with all the author data
    .populate('author')
    .exec(function(err, books) {
      if (err) {
        return console.log("index error: " + err);
        res.sendStatus(500);
      }
      res.json(books);
    })
});

// get one book
app.get('/api/books/:id', function show(req, res) {

  // find one book by its id
  var bookId = req.params.id;
  console.log('books show', bookId);

  //find book by id method
  db.Book.findById(bookId)
    .populate('author')
    .exec(function(err, foundBook) {
      if (err) {
        console.log("index error: " + err);
        res.sendStatus(500);
      }
      res.json(foundBook);
    });

});

// create new book
app.post('/api/books', function create(req, res) {

  // create new book with form data (`req.body`)
  var newBook = new db.Book({
    title: req.body.title,
    image: req.body.image,
    releaseDate: req.body.releaseDate
  });
  console.log('books create', req.body);

  // create method
  // this code will only add an author to a book if the author already exists
  db.Author.findOne({name: req.body.author}, function(err, author) {
    if (err) {
      return console.log(err);
    }
    // add author to book
    newBook.author = author;
    // add newBook to database
    newBook.save(function(err, book) {
      if (err) {
        return console.log("create error: " + err);
      }
      console.log("created ", book.title);
      res.json(book);
    });
  });

});

// delete book
app.delete('/api/books/:id', function destroy(req, res) {
  // get book id from url params (`req.params`)
  var bookId = req.params.id;
  console.log('deleting book with index', bookId);

  // destroy method
  db.Book.findOneAndRemove({_id: bookId}, function(err, deleteBook) {
    if (err) {
      res.sendStatus(500);
      console.log("index error: " + err);
    }
    res.json(deleteBook);
  });

});


app.listen(process.env.PORT || 3000, function() {
  console.log('Book app listening at http://localhost:3000/');
});
