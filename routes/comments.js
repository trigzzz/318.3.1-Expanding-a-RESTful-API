const express = require("express");
const router = express.Router();

const comments = require("../data/comments");
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    res.json({ comments });
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.postId && req.body.body) {
      const comment = {
        id: comments.length + 1,
        userId: req.body.userId,
        postId: req.body.postId,
        body: req.body.body,
      };

      comments.push(comment);
      res.json(comment);
    } else next(error(400, "Insufficient Data"));
  });

router.route("/:id").get((req, res, next) => {
  const comment = comments.find((c) => c.id == req.params.id);
  if (comment) res.json(comment);
  else next();
});

router.route("/:id").patch((req, res, next) => {
  const comment = comments.find((c) => {
    if (c.id == req.params.id) {
      c.body = req.body.body;
      return true;
    }
  });
  if (comment) res.json(comment);
  else next();
});

router.route("/:id").delete((req, res, next) => {
  const commentIndex = comments.findIndex((c) => c.id == req.params.id);
  if (commentIndex !== -1) {
    const deletedComment = comments.splice(commentIndex, 1);
    res.json(deletedComment[0]);
  } else next();
});

router.route("/").get((req, res) => {
  const userId = req.query.userId;
  const postId = req.query.postId;

  if (userId) {
    const userComments = comments.filter((c) => c.userId == userId);
    res.json({ userComments });
  } else if (postId) {
    const postComments = comments.filter((c) => c.postId == postId);
    res.json({ postComments });
  } else {
    res.json({ comments });
  }
});

module.exports = router;
