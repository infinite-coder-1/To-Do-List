const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect("mongodb+srv://admin-Harshit:hg12345@cluster0.usfhxel.mongodb.net/todolistdb", {useNewUrlParser: true});

const itemSchema = {
  name: String
};

const Item = mongoose.model("item", itemSchema);

const item1 = new Item({
  name: "Welcome to todolist!"
});

const item2 = new Item({
  name: "Hit + button to add an item"
});

const item3 = new Item({
  name: "<-- Hit this to delete  an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("list", listSchema);


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"));

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Success");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listHeading: date.getDate(),
        newListItems: foundItems
      });
    }

  })


});

app.get("/:listName", function(req, res) {
  const listName = _.capitalize(req.params.listName);
  List.findOne({
    name: listName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: listName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + listName);
      } else {
        res.render("list", {
          listHeading: listName,
          newListItems: foundList.items
        });
      }
    }
  });

})

app.post("/", function(req, res) {
  const itemName = req.body.listItem;
  const list = req.body.list;
  const item = new Item({
    name: itemName
  });
  if (list === date.getDate()) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: list
    }, function(err, foundList) {
      if(!err){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + list);
      }
    });
  }

});

app.post("/delete", function(req, res) {
  const itemID = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === date.getDate()){
    Item.findByIdAndRemove(req.body.checkbox, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted");
      }
    });
    res.redirect("/");
  }
  else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemID}}}, function(err, foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }

});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
})
