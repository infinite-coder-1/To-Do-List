const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const listItems = [];
const workItem = [];

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));

app.get("/", function(req, res){

  res.render("list", {listHeading : date.getDay(), newListItems : listItems});
});

app.get("/work", function(req, res){
  res.render("list", {listHeading : "Work List", newListItems: workItem});
});

app.post("/", function(req, res){
  if(req.body.add==="Work List"){
    workItem.push(req.body.listItem)
    res.redirect("/work");
  }else{
    listItems.push(req.body.listItem);
    res.redirect("/");
  }

});

app.listen(3000, function(){
  console.log("Server is running on port 3000");
})
