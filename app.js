var express = require("express");

var app = express();

var bodyParser = require("body-parser");

var mongoose = require("mongoose");

var passport = require("passport");

var LocalStrategy = require("passport-local");

var passportLocalMongoose = require("passport-local-mongoose");

var User = require("./models/user");

var methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/restfulblog_app");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride("_method"));
//mongo config

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now}
})

var Blog = mongoose.model("Blog", blogSchema);


// Blog.create(
//     {
//         title: "Test Blog",
//         image: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         body: "HELLO THIS IS BLOG POST"
//     }
// );

app.use(require("express-session")({
    secret: "Once again rusty wins the cutest",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//routes
app.get("/", function(req,res)
{
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res)
{
    Blog.find({}, function(err, blogs)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index", {blogs: blogs,currentUser: req.user});
        }
    });
});


//new route

app.get("/blogs/new", function(req,res)
{
    res.render("new");
});

app.get("/blogs/:id", function(req,res)
{
    Blog.findById(req.params.id, function(err, foundblog)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("show", {blog: foundblog});
        }
    });
});



//create route

app.post("/blogs", function(req,res)
{
    Blog.create(req.body.blog, function(err, newBlog)
    {
        if(err)
        {
            res.render("new");
        }
        else
        {
            res.redirect("\blogs");
        }
    });
});

//edit route

app.get("/blogs/:id/edit", function(req,res)
{
    Blog.findById(req.params.id, function(err, foundblog)
    {
        if(err)
        {
            res.redirect("\blogs");
        }
        else
        {
            res.render("edit", {blog: foundblog});
        }
    });
});

app.put("/blogs/:id", function(req,res)
{
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs/" +req.params.id);
        }
    });
});

//delete

app.delete("/blogs/:id", function(req,res)
{
    Blog.findByIdAndRemove(req.params.id, function(err)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
});
    
// app.get("/register", function(req, res)
// {
//     res.render("register");
// });

// //signup logic

// app.post("/register", function(req, res)
// {
//     var newUser = new User({username: req.body.username});
//     User.register(newUser, req.body.password, function(err, user)
//     {
//         if(err)
//         {
//             console.log(err);
//             return res.render("register");
//         }
//         passport.authenticate("local")(req, res, function()
//         {
//             res.redirect("/campgrounds");
//         });
//     });
// });

// //show login form 

// app.get("/login", function(req,res)
// {
//     res.render("login");
// });

// //login logic

// app.post("/login", passport.authenticate("local",
//  {
//     successRedirect: "/campgrounds",
//     failureRedirect: "/login"
// }) , function(req,res)
// {
// });

// app.get("/logout", function(req,res)
// {
//     req.logout();
//     res.redirect("/campgrounds");
// });

app.listen(3000, function(req, res)
{
    console.log("Server is running");
});