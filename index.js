const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const connection = require('./connection.js');
const moment = require('moment');

const app = express();

app.use(express.urlencoded({extended: true})); //form submission

app.set('view engine', 'ejs'); //set view engine to ejs
app.set("views", path.join(__dirname, '/views')); //set views path
app.use(express.static(path.join(__dirname, 'public'))); //use public folder for static files
app.use(methodOverride('_method')) //method override for HTML form

app.get('/', (req, res) => {
    res.redirect("/posts");
})

app.get('/posts', async (req, res) => {
    let posts = await fetchAll();
    res.render("index.ejs", {posts});
})

app.post('/posts', async (req, res) => {
    let newPost = req.body;
    newPost.id = uuidv4();
    await addPost(newPost);
    res.redirect("/posts");
})

app.get('/posts/new', (req,res) => {
    res.render("new.ejs");
})

app.get('/posts/:id', async (req, res) => {
    let {id} = req.params;
    let post = await findPost(id);
    res.render("single.ejs", {post});
})
app.patch('/posts/:id', async (req, res) => {
    let {id} = req.params;
    updatePost(id,req.body.content);
    res.redirect("/posts");
})

app.get('/posts/:id/edit', async (req, res) => {
    let {id} = req.params;
    let post = await findPost(id);
    res.render("edit.ejs", {post});
})

app.delete('/posts/:id', async (req, res) => {
    let {id} = req.params;
    await deletePost(id);
    res.redirect("/posts");
})

async function fetchAll() {
    return new Promise((resolve, reject) => {
        let q = `SELECT * FROM posts`;
        connection.query(q, (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.length > 0) {
                let posts = results;
               for(let post of posts){
                post.date = formatTimestamp(post.date);
               }
                resolve(posts);
            } else {
                resolve(null);
            }
        });
    });
}

async function addPost(newPost){
    return new Promise((resolve, reject) => {
        let q = `INSERT INTO posts (id, username, content) VALUES (?,?,?)`;
        let values = [newPost.id, newPost.username, newPost.content];
        connection.query(q, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}
async function findPost(id){
    return new Promise((resolve, reject) => {
        let q = `SELECT * FROM posts WHERE id = ?`;
        connection.query(q, [id], (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.length > 0) {
                let post = results[0];
                if (post.date) {
                    post.date = formatTimestamp(post.date);
                }
                resolve(post);
            } else {
                resolve(null);
            }
        });
    });
}
async function updatePost(id, newData){
    return new Promise((resolve, reject) => {
        let q = `UPDATE posts SET content = ? WHERE id = ?`;
        connection.query(q, [newData, id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}
async function deletePost(id){
    return new Promise((resolve, reject) => {
        let q = `DELETE FROM posts WHERE id = ?`;
        connection.query(q, [id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

function formatTimestamp(timestamp) {
    return moment(timestamp).format('DD-MM-YYYY hh:mm A');
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});