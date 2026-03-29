const express = require('express');
const router = express.Router();


//4 different routes for Posts resource
//Index - Posts
router.get('/', (req, res) => {
  res.send('Posts Index Page');
});

//Show - Posts
router.get('/:id', (req, res) => {
  res.send("GET for Posts");
});
    //POST
router.post('/', (req, res) => {
  res.send('POST for Posts');
});

//Delete - Posts
router.delete('/:id', (req, res) => {
  res.send("Delete for Posts");
});

module.exports = router;