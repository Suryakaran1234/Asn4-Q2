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
// load mongoose since we need it to define a model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
BookSchema = new Schema({
  ISBN: String,
  img: String,
  title: String,
  author: String,
  inventory: Number,
  category: String,
});
module.exports = mongoose.model("Book", BookSchema);
