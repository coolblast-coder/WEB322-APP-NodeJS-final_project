
/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Anton Lyapunov Student ID: 048687131 Date: 2022-02-20
*
*  Heroku App URL: https://pacific-cliffs-09871.herokuapp.com/about
* 
*  GitHub Repository URL: https://github.com/coolblast-coder/WEB322-APP
*
********************************************************************************/ 


const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');

const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

const stripJs = require('strip-js');

const blogService = require('./blog-service')


const HTTP_PORT = process.env.PORT || 8080
const onHttptart = () => console.log('Express http server listening on ' + HTTP_PORT);

app.use(express.static('public'));

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = (route == "/") ? "/" : "/" + route.replace(/\/(.*)/, "");
    app.locals.viewingCategory = req.query.category;
    next();
});


app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));


app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: { 
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
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
        safeHTML: function(context){
            return stripJs(context);
        }
        
    }
    
}));

app.set('view engine', '.hbs');

cloudinary.config({
    cloud_name: 'alyapunovseneca',
    api_key: '726415785191287',
    api_secret: 'ej0Nlo8qDnjYPBmH1tBssOmqdIQ',
    secure: true
});

const upload = multer(); // no { storage: storage } since we are not using disk storage

app.get('/', (req, res) => {
    res.redirect('/blog');
})

app.get('/about', (req, res) => {
    res.render(path.join(__dirname, '/views/about.hbs'));

    // res.render('about', {
    //     data: info,
    //     layout: 'main.hbs'
    // });

})

// app.get('/blog', (req, res) => {
//     // res.send('TODO: get all posts who have published==true')
//     blogService.getPublishedPosts().then((data) => {
//         res.json(data);
//     }).catch((error) => {
//         res.status(404).send("Error!")
//     })

// })

app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogService.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogService.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogService.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})

});


app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the post by "id"
        viewData.post = await blogData.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});


app.get('/posts', (req, res) => {
    // res.send('hello posts');

    let category = req.query.category;
    let minDate = req.query.minDate;

    if(category){
    blogService.getPostsByCategory(category).then((data) => {
        res.render("posts", {posts: data});
    }).catch((error) => {
        res.render({message: "no results"});
    })
}
else if(minDate != "" && minDate != null ){
    blogService.getPostsByMinDate(minDate).then((data) => {
        res.render("posts", {posts: data});
    }).catch((error) => {
        res.render({message: "no results"});
    })
}
else{
    blogService.getAllPosts().then((data) => {
        res.render("posts", {posts: data});
    }).catch((error) => {
        res.render({message: "no results"});
    })
}
})

app.get('/categories', (req, res) => {
    // res.send('hello categories')
    blogService.getCategories().then((data) => {
        res.render("categories", {categories: data});
    }).catch((error) => {
        res.render("categories", {message: "no results"});
    })

})

app.get('/posts/add', (req, res) => {
    res.render(path.join(__dirname, './views/addPost.hbs'));
})

app.post('/posts/add', upload.single("featureImage"), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }

                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }

        upload(req).then((uploaded) => {
            req.body.featureImage = uploaded.url;

            // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
         
            });
        }
            blogService.addPost(req.body).then(() => {
                res.redirect('/posts');
        });

    })


app.get('/posts/:value', (req,res) =>{
    blogService.getPostById(req.params.value).then((data)=>{
        res.json(data);
    }).catch(error=>{
        res.status(404).send("Error!");
    })
})



app.use((req, res) => {
    res.status(404).send("Page Not Found")
})

blogService.initialize().then((data) => {
    app.listen(HTTP_PORT, onHttptart);
}).catch((error) => {
    res.status(404).send("Error loading data!")
})