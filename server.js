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