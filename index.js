import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "blogApp",
    password: "4yeo",
    port: 5432,
});
db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


//constructor for Blog Class
function Blog(id,name,title,content,country_name,country_code){
    this.blog_id = id
    this.name = name;
    this.title = title;
    this.content = content;
    this.country_name = country_name;
    this.country_code = country_code;
    this.date = new Date().toLocaleDateString();
}


//function to delete the blog post
function deleteBlog(index){
    blogArr.splice(index,1);
}

//function to edit the blog post
function editBlog(index,name,title,content){
    blogArr[index] = new Blog(name,title,content);
}

async function getBlogs(){
    const result = await db.query("SELECT * FROM blogs");
    let blogArr = [];
    result.rows.forEach((blogData)=>{
        const blog = new Blog(blogData.id,blogData.author_name,blogData.title,blogData.content,blogData.country_name,blogData.country_code);
        if (blogArr.length>0){
            blogArr.unshift(blog);
        }else{
            blogArr.push(blog);
        }
    });
    return blogArr;
}

//opens up the home page
app.get("/", async (req,res)=>{
    let blogs = [];
    blogs = await getBlogs();
    console.log(blogs);
    res.render("index.ejs", {blogArr: blogs});
});

//opens up the page to create the blogs
app.get("/create", (req,res)=>{
    res.render("create.ejs");
});

//save and publish a blog
app.post("/save", async (req,res)=>{
    const name = req.body.name;
    const title = req.body.title;
    const content = req.body.content;
    const country_name = req.body.country_name;

    try{
        const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE $1 || '%';",[country_name.toLowerCase()]);
        const data = result.rows[0];
        const country_code = data.country_code;
        try{
            await db.query("INSERT INTO blogs (title, country_name, content, author_name, country_code) VALUES($1,$2,$3,$4,$5)",
            [title,country_name,content,name,country_code]);
            res.redirect("/");
        }catch (err){
            console.log(err);
        }
    } catch(err){
        console.log(err);
    }

});

//view a blog post
app.get("/blogPage/:id", async (req,res)=>{
    let id = parseInt(req.params.id)
    const result = await db.query("SELECT * FROM blogs WHERE id = $1 ORDER BY id DESC;",[id]);
   
    const blog = result.rows[0];
    res.render("blogPage.ejs", {blog: blog});

});

//delete a blog post
app.get("/delete/:id", async (req,res)=>{
    const id = parseInt(req.params.id);
    try{
        await db.query("DELETE FROM blogs WHERE id = $1",[id]);
        res.redirect("/")
    } catch(err){
        console.log(err);
    }
});

//button to select to edit the blog post
app.get("/edit/:id", async (req,res)=>{
    let id = parseInt(req.params.id);
    const result = await db.query("SELECT * FROM blogs WHERE id = $1",[id]);
    const blog = result.rows[0]
    res.render("create.ejs",{blog:blog});

});

//updates the newly edited blog post
app.post("/update",async (req,res)=>{
    const id = parseInt(req.body.index);
    const name = req.body.name;
    const title = req.body.title;
    const content = req.body.content;
    const country_name = req.body.country_name;
    try{
        const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE $1 || '%';",[country_name.toLowerCase()]);
        const data = result.rows[0];
        const country_code = data.country_code;
        console.log(data);
        console.log(country_code);
        try{
            await db.query("UPDATE blogs SET author_name = $1, country_name = $2, country_code = $3, title = $4, content = $5 WHERE id = $6", [name,country_name,country_code,title,content,id]);
            res.redirect("/");

        }catch(err){
            console.log(err);
        }
    } catch(err){
        console.log(err);
    }
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});


