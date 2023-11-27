/****************************************************************************** ***
 *	ITE5315 – Assignment 4
 *	I declare that this assignment is my own work in accordance with Humber Academic Policy.   *  No part of this assignment has been copied manually or electronically from any other source *  (including web sites) or distributed to other students.
 *
 *	Name: Surya Karan Sharma
 *   Student ID: N01530697
 *   Date: 25th November, 2024
 *
 *
 ******************************************************************************
 **/
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const database = require("./config/database");
const bodyParser = require("body-parser"); // pull information from HTML POST (express4)

const port = process.env.PORT || 3000;

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

app.use(express.static("public"));

// Setting up Handlebars as the template/view engine
const exphbs = require("express-handlebars");

// Handlebars initialization with custom helpers
const hbs = exphbs.create({
  extname: ".hbs",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", "hbs");

mongoose.connect(database.url);

const Book = require("./models/book");

// Route for the main page or default page
app.get("/", function (req, res) {
  res.render("index", { title: "Assignment 4" });
});

//get all book data from db
app.get("/api/books", function (req, res) {
  // use mongoose to get all todos in the database
  Book.find(function (err, books) {
    // if there is an error retrieving, send the error otherwise send data
    if (err) res.send(err);
    res.render("all-books", { books }); // return all books in JSON format
  }).lean();
});

// get a book with ID of 1
app.get("/api/books/:book_id", function (req, res) {
  let id = req.params.book_id;
  Book.findById(id, function (err, book) {
    if (err) res.send(err);

    res.json(book);
  });
});

app.get('/api/addbook', function (req, res) {
  res.render('addbook')
})

// create book and send back all books after creation
app.post("/api/books", function (req, res) {
  // create mongoose method to create a new record into collection
  console.log(req.body);

  Book.create(
    {
      ISBN: req.body.ISBN,
      img: req.body.img,
      title: req.body.title,
      author: req.body.author,
      inventory: req.body.inventory,
      category: req.body.category,
    },
    function (err, book) {
      if (err) res.send(err);

      // get and return all the books after newly created book record
      Book.find(function (err, books) {
        if (err) res.send(err);
        res.send(book);
      });
    }
  );
});

// Even though it's a POST METHOD, We are using it to DELETE the Resource as HTML only supports GET and POST.
app.post("/api/books/:book_id", function (req, res) {
  // Access the value of the hidden "_method" field
  const method = req.body._method;

  // Check if the intended method is DELETE
  if (method === "DELETE") {
    // Continue with your DELETE logic
    let id = req.params.book_id;
    Book.findByIdAndRemove(id, function (err, book) {
      if (err) res.send(err);
      else res.send("Successfully! Book has been Deleted.");
    });
  } else {
    // Handle unexpected method
    res.status(400).send("Bad Request: Unexpected method");
  }
});


// create book and send back all books after creation
app.put("/api/books/:book_id", function (req, res) {
  // create mongoose method to update an existing record into collection
  console.log(req.body);

  let id = req.params.book_id;
  const data = {
    ISBN: req.body.ISBN,
    img: req.body.img,
    title: req.body.title,
    author: req.body.author,
    inventory: req.body.inventory,
    category: req.body.category,
  };

  // save the user
  Book.findByIdAndUpdate(id, data, function (err, book) {
    if (err) throw err;

    res.send("Successfully! Book updated - " + book.title);
  });
});

// delete a book by id
app.delete("/api/books/:book_id", function (req, res) {
  console.log(req.params.book_id);
  let id = req.params.book_id;
  Book.remove(
    {
      _id: id,
    },
    function (err) {
      if (err) res.send(err);
      else res.send("Successfully! Book has been Deleted.");
    }
  );
});

app.listen(port);
console.log("App listening on port : " + port);
