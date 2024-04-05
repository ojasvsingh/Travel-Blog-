import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//Array where all of the posts are stored
var blogArr = [];

//constructor for Blog Class
function Blog(name,title,content){
    this.name = name;
    this.title = title;
    this.content = content;
    this.date = new Date().toLocaleDateString();
}

//function that adds the blog post
function createBlog(name,title,content){
    let blog = new Blog(name,title,content);
    if(blogArr.length>0){
        blogArr.unshift(blog);
    }
    else{
        blogArr.push(blog);
    }
}

//function to delete the blog post
function deleteBlog(index){
    blogArr.splice(index,1);
}

//function to edit the blog post
function editBlog(index,name,title,content){
    blogArr[index] = new Blog(name,title,content);
}


//opens up the home page
app.get("/",(req,res)=>{
    res.render("index.ejs", {blogArr: blogArr});
});

//opens up the page to create the blogs
app.get("/create", (req,res)=>{
    res.render("create.ejs");
});

//save and publish a blog
app.post("/save",(req,res)=>{
    const name = req.body["name"];
    const title = req.body["title"];
    const content = req.body["content"];

    createBlog(name,title,content);
    // console.log(blogArr);
    res.redirect("/");
});

//view a blog post
app.get("/blogPage/:id", (req,res)=>{
    let index = req.params.id;
    let blog = blogArr[index];

    res.render("blogPage.ejs",{blogId: index, name: blog.name, title: blog.title, content: blog.content});

});

//delete a blog post
app.get("/delete/:id",(req,res)=>{
    let index = req.params.id;
    deleteBlog(index);
    res.redirect("/");
});

//button to select to edit the blog post
app.get("/edit/:id",(req,res)=>{
    let index = req.params.id;
    let blog = blogArr[index];
    res.render("create.ejs",{blogId:index, name:blog.name, title: blog.title, content: blog.content});
});

//updates the newly edited blog post
app.post("/update",(req,res)=>{
    const index = req.body["index"];
    const name = req.body["name"];
    const title = req.body["title"];
    const content = req.body["content"];

    editBlog(index,name,title,content);
    res.redirect("/");
});

app.listen(port, ()=>{
    createBlog("Ojasv Singh","My First Blog", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lorem ex, tempor quis lacus non, mattis volutpat urna. Curabitur et pulvinar ipsum, nec dapibus velit. Pellentesque ut leo varius odio eleifend pellentesque. Integer pretium vulputate neque, ut mollis est elementum pharetra. Duis pulvinar molestie metus, varius luctus diam varius ac. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur ligula odio, hendrerit scelerisque purus ut, feugiat elementum tortor. Integer et diam tortor. Vestibulum felis mauris, finibus ac mauris non, porta commodo magna. Donec mi dolor, condimentum vel tortor id, dapibus consequat turpis. Pellentesque vel dapibus purus. Proin luctus ac mi id scelerisque. Aenean vitae felis arcu. Integer non lacinia magna. Nam vitae erat magna. Suspendisse laoreet, sem at commodo faucibus, leo mi consectetur lectus, nec dapibus felis metus in diam.");
    createBlog("Ojasv Singh","Another Adventure", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lorem ex, tempor quis lacus non, mattis volutpat urna. Curabitur et pulvinar ipsum, nec dapibus velit. Pellentesque ut leo varius odio eleifend pellentesque. Integer pretium vulputate neque, ut mollis est elementum pharetra. Duis pulvinar molestie metus, varius luctus diam varius ac. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur ligula odio, hendrerit scelerisque purus ut, feugiat elementum tortor. Integer et diam tortor. Vestibulum felis mauris, finibus ac mauris non, porta commodo magna. Donec mi dolor, condimentum vel tortor id, dapibus consequat turpis. Pellentesque vel dapibus purus. Proin luctus ac mi id scelerisque. Aenean vitae felis arcu. Integer non lacinia magna. Nam vitae erat magna. Suspendisse laoreet, sem at commodo faucibus, leo mi consectetur lectus, nec dapibus felis metus in diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lorem ex, tempor quis lacus non, mattis volutpat urna. Curabitur et pulvinar ipsum, nec dapibus velit. Pellentesque ut leo varius odio eleifend pellentesque. Integer pretium vulputate neque, ut mollis est elementum pharetra. Duis pulvinar molestie metus, varius luctus diam varius ac. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur ligula odio, hendrerit scelerisque purus ut, feugiat elementum tortor. Integer et diam tortor. Vestibulum felis mauris, finibus ac mauris non, porta commodo magna. Donec mi dolor, condimentum vel tortor id, dapibus consequat turpis. Pellentesque vel dapibus purus. Proin luctus ac mi id scelerisque. Aenean vitae felis arcu. Integer non lacinia magna. Nam vitae erat magna. Suspendisse laoreet, sem at commodo faucibus, leo mi consectetur lectus, nec dapibus felis metus in diam.");
    console.log(`Listening on port ${port}`);
});


