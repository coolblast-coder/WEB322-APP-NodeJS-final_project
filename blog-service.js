module.exports.initialize = function () {
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

module.exports.getAllPosts = function () {
    return new Promise((resolve, reject) => {
        if (posts && posts.length > 0)
            resolve(posts);
        else {
            reject("no results returned");
        }

    })
}

module.exports.getPublishedPosts = function () {
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

module.exports.getCategories = function () {
    return new Promise((resolve, reject) => {
        if (categories && categories.length > 0)
            resolve(categories);
        else {
            reject("no results returned");
        }

    })
}

module.exports.addPost = function (postData) {

        return new Promise((resolve, reject) => {
        

        if (postData.published) {
            postData.published = true;
        }
        else {
            postData.published = false;
        }
        postData.id = (posts.length + 1);
        postData.postDate = (new Date()).toISOString().split("T")[0];
        
        posts.push(postData);
        resolve(postData);

    })

}
module.exports.getPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        let categoryPost = posts.filter(a => a.category == category);
        if (categoryPost.length != 0) {
            resolve(categoryPost);
        }
        else {
            reject("no results returned");
        }
    })

}

module.exports.getPostsByMinDate = function (minDateStr) {
    return new Promise((resolve, reject) => {
        let datePost = posts.filter(a => new Date(a.postDate) > new Date(minDateStr));
        if (datePost.length != 0) {
            resolve(datePost);
        }
        else {
            reject("no results returned");
        }
    })

}

module.exports.getPostById = function (id) {
    return new Promise((resolve, reject) => {
        let idPost = posts.filter(a => a.id == id);
        if (idPost.length != 0) {
            resolve(idPost);
        }
        else {
            reject("no results returned");
        }
    })
}


module.exports.getPublishedPostsByCategory = function (category) {
    var publishedPost = [];

    for (var i = 0; i < posts.length; i++) {
        if (posts[i].published && post.category == category) {
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