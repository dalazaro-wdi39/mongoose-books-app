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
  db.Book.find(function(err, books) {
    if (err) {
      console.log("index error: " + err);
      res.sendStatus(500);
    }
    res.json(books);
  });
});

// get one book
app.get('/api/books/:id', function show(req, res) {
  // find one book by its id
  var bookId = req.params.id;
  console.log('books show', bookId);

  //find book by id method
  db.Book.findById(bookId, function (err, foundBook){
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
  var newBook = req.body;
  console.log('books create', req.body);

  //create method
  let book = new db.Book(newBook);
    book.save(function(err, savedBook){
      if (err) {
        console.log("index error: " + err);
        res.sendStatus(500);
      }
      res.json(savedBook);
    });
});

// delete book
app.delete('/api/books/:id', function destroy(req, res) {
  // get book id from url params (`req.params`)
  var bookId = req.params.id;
  console.log('deleting book with index', bookId);

  // destroy method
  db.Book.findByIdAndRemove(bookId, function (err, deleteBook){
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
