module.exports = app => {
  const blogs = require("../controllers/blog.controller.js");

  var router = require("express").Router();

  // Create a new blog
  router.post("/", blogs.create);

  // Retrieve all blogs
  router.get("/", blogs.findAll);

  // Retrieve a single blog with id
  router.get("/:id", blogs.findOne);

  // Update a blog with id
  router.put("/:id", blogs.update);

  // Delete a blog with id
  router.delete("/:id", blogs.delete);


  app.use("/api/blogs", router);
};
