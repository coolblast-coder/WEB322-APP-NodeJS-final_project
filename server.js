/*********************************************************************************
 *  WEB322 – Assignment 05
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Anton Lyapunov Student ID: 048687131 Date: 2022-03-14
 *
 *  Heroku App URL: https://pacific-cliffs-09871.herokuapp.com/
 *
 *  GitHub Repository URL: https://github.com/coolblast-coder/WEB322-APP
 *
 ********************************************************************************/

const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const stripJs = require("strip-js");
const blogService = require("./blog-service");

const HTTP_PORT = process.env.PORT || 8080;
const onHttptart = () =>
  console.log("Express http server listening on " + HTTP_PORT);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },

      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
      safeHTML: function (context) {
        return stripJs(context);
      },
      formatDate: function (dateObj) {
        let year = dateObj.getFullYear();
        let month = (dateObj.getMonth() + 1).toString();
        let day = dateObj.getDate().toString();
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      },
    },
  })
);

app.set("view engine", ".hbs");

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    route == "/" ? "/" : "/" + route.replace(/\/(.*)/, "");
  app.locals.viewingCategory = req.query.category;
  next();
});

cloudinary.config({
  cloud_name: "alyapunovseneca",
  api_key: "726415785191287",
  api_secret: "ej0Nlo8qDnjYPBmH1tBssOmqdIQ",
  secure: true,
});

const upload = multer(); // no { storage: storage } since we are not using disk storage

app.get("/", (req, res) => {
  res.redirect("/blog");
});

app.get("/about", (req, res) => {
  res.render(path.join(__dirname, "/views/about.hbs"));

  // res.render('about', {
  //     data: info,
  //     layout: 'main.hbs'
  // });
});

// app.get('/blog', (req, res) => {
//     // res.send('TODO: get all posts who have published==true')
//     blogService.getPublishedPosts().then((data) => {
//         res.json(data);
//     }).catch((error) => {
//         res.status(404).send("Error!")
//     })

// })

app.get("/blog", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  try {
    // declare empty array to hold "post" objects
    let posts = [];

    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      posts = await blogService.getPublishedPostsByCategory(req.query.category);
    } else {
      // Obtain the published "posts"
      posts = await blogService.getPublishedPosts();
    }

    // sort the published posts by postDate
    posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    // get the latest post from the front of the list (element 0)
    let post = posts[0];

    // store the "posts" and "post" data in the viewData object (to be passed to the view)
    viewData.posts = posts;
    viewData.post = post;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await blogService.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData });
});

app.get("/blog/:id", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  try {
    // declare empty array to hold "post" objects
    let posts = [];

    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      posts = await blogData.getPublishedPostsByCategory(req.query.category);
    } else {
      // Obtain the published "posts"
      posts = await blogData.getPublishedPosts();
    }

    // sort the published posts by postDate
    posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    // store the "posts" and "post" data in the viewData object (to be passed to the view)
    viewData.posts = posts;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the post by "id"
    viewData.post = await blogData.getPostById(req.params.id);
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await blogData.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData });
});

app.get("/posts", (req, res) => {
  // res.send('hello posts');

  let category = req.query.category;
  let minDate = req.query.minDate;

  if (category) {
    blogService.getPostsByCategory(category).then((data) => {
      if (data.length > 0) {
        res.render("posts", { posts: data });
      } else {
        res.render("posts", { message: "no results" });
      }
    });
  } else if (minDate != "" && minDate != null) {
    blogService.getPostsByMinDate(minDate).then((data) => {
      if (data.length > 0) {
        res.render("posts", { posts: data });
      } else {
        res.render({ message: "no results" });
      }
    });
  } else {
    blogService.getAllPosts().then((data) => {
      if (data.length > 0) {
        res.render("posts", { posts: data });
      } else {
        res.render("posts", { message: "no results" });
      }
    });
  }
});

app.get("/categories", (req, res) => {
  // res.send('hello categories')
  blogService.getCategories().then((data) => {
    if (data.length > 0) {
      res.render("categories", { categories: data });
    } else {
      res.render("categories", { message: "no results" });
    }
  });
});

app.get("/posts/add", (req, res) => {
  //   res.render(path.join(__dirname, "./views/addPost.hbs"));

  blogService
    .getCategories()
    .then((data) => res.render("addPost", { categories: data }))
    .catch((err) => {
      res.render("addPost", { categories: [] });
      console.log(err);
    });
});

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      // req.body.featureImage = uploaded.url;

      processPost(uploaded.url);

      // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
    });
  } else {
    processPost("");
  }
  function processPost(imageUrl) {
    req.body.featureImage = imageUrl;
    blogService
      .addPost(req.body)
      .then(() => {
        res.redirect("/posts");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
});

app.get("/posts/:value", (req, res) => {
  blogService
    .getPostById(req.params.value)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(404).send("Error!");
    });
});



//Assignment 5
app.get("/categories/add", (req, res) => {
//   res.render(path.join(__dirname, "./views/addCategory.hbs"));
  res.render("addCategory", {});
});

app.post("/categories/add", (req, res) => {
  blogService.addCategory(req.body).then(() => {
    res.redirect("/categories");
  });
});

app.get("/categories/delete/:id", (req, res) => {
  blogService
    .deleteCategoryById(req.params.id)
    .then(() => {
      res.redirect("/categories");
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Category / Category not found");
      console.log(err);
    });
});

app.get("/posts/delete/:id", (req, res) => {
  blogService
    .deletePostById(req.params.id)
    .then(() => {
      res.redirect("/posts");
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Post / Post not found");
      console.log(err);
    });
});


app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });

blogService
  .initialize()
  .then((data) => {
    app.listen(HTTP_PORT, onHttptart);
  })
  .catch((error) => {
    res.status(404).send("Error loading data!");
  });
