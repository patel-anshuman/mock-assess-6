const {BlogModel} = require('../models/blog.model');
const {Router} = require('express');

const blogRouter = Router();

// This endpoint should give all the blogs
// api/blogs?title=”Present” -> This endpoint should allow users to search for blogs using their title.
// 

blogRouter.get('/blogs', async (req,res) => {
    const {title, category, sort, order} = req.query;
    const query = {}, sortBy = {};
    if(category){
        query.category = category;
    }
    if(title){
        query.title = title;
    }
    if(sort){
        if(order=='asc'){
            sortBy.date = 1;
        } else if(order=='desc'){
            sortBy.date = -1;
        }
    }
    try {
        let data = null;
        if(sort){
            data = await BlogModel.find(query).sort(sortBy);
        } else {
            data = await BlogModel.find(query);
        }
        res.status(200).json({data: data});
    } catch (err) {
        res.status(400).json({msg: err.message});
    }
})

// Add blogs
blogRouter.post('/blogs', async (req,res) => {
    const {username, title, content, category, date} = req.body;
    const payload = { username, title, content, category, date, likes: 0, comments: [] };
    try {
        const data = new BlogModel(payload);
        await data.save();
        res.status(200).json({msg: "Blog Uploaded"});
    } catch (err) {
        res.status(400).json({msg: err.message});
    }
});

// Update Blog
blogRouter.patch('/blogs/:id', async (req,res) => {
    const {id} = req.params;
    const payload = req.body;
    try {
        const blog = await BlogModel.findById(id);
        if(blog.username==payload.username){
            await BlogModel.findByIdAndUpdate(id,payload);
            res.status(200).json({msg: "Blog Updated"});
        } else {
            res.status(400).json({msg: "Unauthorised Update Request"});
        }
    } catch (err) {
        res.status(400).json({msg: err.message});
    }
});

// Delete Blog
blogRouter.delete('/blogs/:id', async (req,res) => {
    const {id} = req.params;
    try {
        const blog = await BlogModel.findById(id);
        if(blog.username==req.body.username){
            await BlogModel.findByIdAndDelete(id);
            res.status(200).json({msg: "Blog Deleted"});
        } else {
            res.status(400).json({msg: "Unauthorised Delete Request"});
        }
    } catch (err) {
        res.status(400).json({msg: err.message});
    }
});

// Like
blogRouter.patch('/blogs/:id/like', async (req,res) => {
    const {id} = req.params;
    try {
        const blog = await BlogModel.findById(id);
        let { likes } = blog;
        const payload = {likes: likes+1};
        await BlogModel.findByIdAndUpdate(id,payload);
        res.status(200).json({msg: "Liked"});
    } catch (err) {
        res.status(400).json({msg: err.message});
    }
});

// Comment
blogRouter.patch('/blogs/:id/comment', async (req,res) => {
    const {id} = req.params;
    const {username, content} = req.body;
    const comment = {username, content};
    try {
        const blog = await BlogModel.findById(id);
        let { comments } = blog;
        comments.push(comment);
        const payload = { comments };
        await BlogModel.findByIdAndUpdate(id,payload);
        res.status(200).json({msg: "Commented"});
    } catch (err) {
        res.status(400).json({msg: err.message});
    }
});

module.exports = blogRouter;
