const { rejects } = require('assert');
const fs = require('fs');
const { resolve } = require('path/posix');

let posts = [];
let categories = [];

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/posts.json', 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                posts = JSON.parse(data);
                //console.log(posts);
            }
        })
        fs.readFile('./data/categories.json', 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                categories = JSON.parse(data);
                //console.log(categories);
            }
        })
        resolve("File read successfully.")
    })
}

module.exports.getAllPosts = function() {
    return new Promise((resolve, reject) => {
        if (posts && posts.length > 0)
            resolve(posts);
        else {
            reject("no results returned");
        }

    })
}

module.exports.getPublishedPosts = function() {
    var publishedPost = [];

    for (var i = 0; i < posts.length; i++) {
        if (posts[i].published) {
            publishedPost.push(posts[i])
        }
    }
    return new Promise((resolve, reject) => {
        if (publishedPost && publishedPost.length > 0) {
            resolve(publishedPost);
        } else {
            reject("no results returned");
        }

    })
}

module.exports.getCategories = function() {
    return new Promise((resolve, reject) => {
        if (categories && categories.length > 0)
            resolve(categories);
        else {
            reject("no results returned");
        }

    })
}