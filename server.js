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
    // res.send('hello home')
    // musicData.getAlbums().then((data) => {
    //     res.send(data)
    // })
    res.sendFile(path.join(__dirname, '/views/about.html'));
})

app.get('/blog', (req, res) => {
    res.send('TODO: get all posts who have published==true')
})

app.get('/posts', (req, res) => {
    res.send('hello posts')
})

app.get('/categories', (req, res) => {
    res.send('hello categories')
})

app.listen(HTTP_PORT, onHttptart);