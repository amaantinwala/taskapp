const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const flash = require("connect-flash");
const session = require("express-session");
const port = 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(session({
  secret:"terakaamkar",
  cookie:{maxAge: 50000},
  resave:false,
  saveUninitialized:false
}));

app.get("/", function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    res.render("index", {
      message:req.flash("message"),
      Deletemessage:req.flash("deletemessage"),
      Renamemessage:req.flash("renamemessage"),
      files,
    });
  });
});

app.post("/create-tasks", (req, res) => {
  const title = req.body.title;
  const content = req.body.description;
  fs.writeFile(`./files/${title.trim()}.txt`, content, function (err) {
    req.flash("message", "Task created successfully");
  res.redirect("/");
  });
});

app.get("/read/:task", (req, res) => {
  // console.log(req.params.task);
  fs.readFile(`./files/${req.params.task}.txt`, "utf-8", function (err, data) {
    if(err){
      console.log(err);
    }else{
      // console.log(data);
      res.render("tasks", {
        data,
        title : req.params.task,
        message: req.flash("successMessage")
      });
  
    }
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

app.get("/updatename/:title",function(req,res){
    res.render("updatename", {
      title1 : req.params.title,
    });
})


app.post("/update", (req, res) => {
  const title = req.body.title;
  const content = req.body.description;
  const message = "Update of data is Successful."
  fs.writeFile(`./files/${title}.txt`, content, function (err) {
    if(!err){
      req.flash("successMessage", message);
      res.redirect(`/read/${title}`);
    }else{
      req.flasf("errorMessage","Error updating data");
      res.redirect(`/read/${title}`);
    }

  });
})

app.post("/updatename", (req, res) => {
  const prevTitle = req.body.title;
  const newTitle = req.body.newtitle;

  fs.rename(`./files/${prevTitle}.txt`,`./files/${newTitle.trim()}.txt`, function (err){
    if(err){
      console.log(err);
    }else{
      req.flash("renamemessage","Filename Renamed Successfully")
      res.redirect("/");
    }
  })
})

app.get("/delete/:title",function(req, res){
  const title = req.params.title;

  fs.unlink(`./files/${title}.txt`, function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("File Deleted Succedfully");
      req.flash("deletemessage","File Deleted Successfully")
      res.redirect('/')
    }
  })
})

app.listen(port, function () {
  console.log(`Server Started at Port:${port}`);
});
