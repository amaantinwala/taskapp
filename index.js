const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const port = 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    res.render("index", {
      files,
    });
  });
});

app.post("/create-tasks", (req, res) => {
  const title = req.body.title;
  const content = req.body.description;
  fs.writeFile(`./files/${title}.txt`, content, function (err) {
    res.redirect("/");
  });
});

app.get("/read/:task", (req, res) => {
  fs.readFile(`./files/${req.params.task}.txt`, function (err, data) {
    res.render("tasks", {
      data,
      title : req.params.task,
    });
  });
});

app.get("/update/:title",function(req,res){
  fs.readFile(`./files/${req.params.title}.txt`, function (err, data) {
    res.render("update", {
      data,
      title1 : req.params.title,
    });
  });
})

app.post("/update", (req, res) => {
  const title = req.body.title;
  const content = req.body.description;

  fs.writeFile(`./files/${title}.txt`, content, function (err) {
    res.redirect(`/read/${title}`);
  });
})

app.get("/delete/:title",function(req, res){
  const title = req.params.title;

  fs.unlink(`./files/${title}.txt`, function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("File Deleted Succedfully");
      res.redirect('/')
    }
  })
})

app.listen(port, function () {
  console.log(`Server Started at Port:${port}`);
});
