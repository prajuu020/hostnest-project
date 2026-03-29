const express = require('express');
const router = express.Router();

//Index - users
router.get('/', (req, res) => {
  res.send('Users Index Page from user.js');
});             

//Show - users
router.get('/:id', (req, res) => {
  res.send("GET for show users");
});
    //Index - posts
router.post('/', (req, res) => {
  res.send('Posts for Users');
});

//Delete - users
router.delete('/:id', (req, res) => {
  res.send("Delete for users");
});
module.exports = router;

