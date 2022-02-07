/*********************************************************************************
 *  WEB322 – Assignment 02
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Anton Lyapunov Student ID: 048687131 Date: 2022-02-06
 *
 *  Online (Heroku) URL: https://pacific-cliffs-09871.herokuapp.com/
 *
 *  GitHub Repository URL: https://github.com/coolblast-coder/WEB322-APP
 *
 ********************************************************************************/

const express = require('express');
const app = express();

const path = require('path');
const blogService = require('./blog-service')


const HTTP_PORT = process.env.port || 8080
const onHttptart = () => console.log('Express http server listening on ' + HTTP_PORT);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/about');
})

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
})

app.get('/blog', (req, res) => {
    // res.send('TODO: get all posts who have published==true')
    blogService.getPublishedPosts().then((data) => {
        res.json(data);
    }).catch((error) => {
        res.status(404).send("Error!")
    })

})

app.get('/posts', (req, res) => {
    // res.send('hello posts');
    blogService.getAllPosts().then((data) => {
        res.json(data);
    }).catch((error) => {
        res.status(404).send("Error!")
    })

})

app.get('/categories', (req, res) => {
    // res.send('hello categories')
    blogService.getCategories().then((data) => {
        res.json(data);
    }).catch((error) => {
        res.status(404).send("Error!")
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