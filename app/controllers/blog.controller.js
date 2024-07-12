const db = require("../models");
const Blog = db.blog;

// Create and Save a new Blog
exports.createBlog = (req, socket) => {
  // Create a Blog
  const blog = new Blog({
    title: req.title,
    description: req.description,
    status: req.status
  });

  // Save Blog in the database
  blog.save(blog)
    .then(data => {
      socket.emit('todo:create', {
        message:
          "task created successfully", status: true
      })
    })
    .catch(err => {
      socket.emit('todo:create', {
        message:
          err.message || "Some error occurred while creating the Blog."
      })
    });
};

// Retrieve all Blog from the database.
exports.findAllBlog = (socket) => {
  var condition = {};
  Blog.find(condition)
    .then(data => {
      socket.emit('todo:list', data)
    })
    .catch(err => {
      socket.emit('todo:list', {
        message:
          err.message || "Some error occurred while retrieving Blog."
      })
    });
};



// Update a Blog by the id in the request
exports.updateBlog = (req, socket) => {
  if (!req) {
    socket.emit('todo:edit', {
      message:
        "Data to update can not be empty!", status: false
    })
  }

  const id = req.id;

  Blog.findByIdAndUpdate(id, req, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        socket.emit('todo:edit', {
          message:
            `Cannot update Blog with id=${id}. Maybe Blog was not found!`, status: false
        })
      } else {
        socket.emit('todo:edit', {
          message:
            "Blog was updated successfully.", status: true
        })
      }

    })
    .catch(err => {
      socket.emit('todo:edit', {
        message:
          "Error updating Blog with id=" + id, status: false
      })
    });
};

// Delete a Blog with the specified id in the request
exports.removeBlog = (id, socket) => {
  Blog.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        socket.emit('todo:delete', {
          message: `Cannot delete Blog with id=${id}. Maybe Blog was not found!`
        })
      } else {
        socket.emit('todo:delete', {
          message: "Blog was deleted successfully!", status: true
        })
      }
    })
    .catch(err => {
      socket.emit('todo:delete', {
        message: "Blog was deleted successfully!", status: true, error: err
      })
    });
};


