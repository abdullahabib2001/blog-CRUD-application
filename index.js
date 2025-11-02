import express from "express";
import bodyParser from "body-parser";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

let postRecords = [];

// Update logic

function updatePost(post_id, post) {

  for (let i = 0; i < postRecords.length; i++) {
    if (post_id == postRecords[i].post_id) {
      postRecords[i].post = post;
      break;
    }
  }

}

// Create logic

function appendPost(post_id, post) {

  let canAppend = true;

  for (let i = 0; i < postRecords.length; i++) {
    if (post_id == postRecords[i].post_id) {
      canAppend = false;
      break;
    }
  }

  if (canAppend) {

    let postRecord = {
      post_id: post_id,
      post: post
    }

    postRecords.push(postRecord);
  }


}

// Delete logic

function deletePost(post_id) {

  for (let i = 0; i < postRecords.length; i++) {
    if (post_id == postRecords[i].post_id) {
      postRecords.splice(i, 1);
      break;
    }
  }

}

/* ------------------------------------------ */

/* Render Homepage (default view) */

app.get("/", (req, res) => {
  res.render(__dirname + "/views/home.ejs",
    { postRecords: postRecords }
  );
});

/* Handling when user clicks on Create Button from Homepage --> we redirect user to create blog post page */

app.get("/createupdate", (req, res) => {
  res.render(__dirname + "/views/createupdate.ejs");
});

/* Handling when the following happens:

1) User tries to delete a post from the Homepage

2) User tries to create a post from the create/update blog post page

3) User tries to update a post from the create/update blog post page


*/

app.post("/", (req, res) => {

  let post_id = req.body["post-id"];

  let post = req.body["post"];

  // DELETE FLOW

  if (req.body["action"] == "delete") {
    deletePost(post_id);

    res.render(__dirname + "/views/home.ejs",
      { postRecords: postRecords }
    );

    return;
  }

  // CREATE FLOW

  if (req.body["action"] == "create") {
    appendPost(post_id, post);

    res.render(__dirname + "/views/home.ejs",
      { postRecords: postRecords }
    );

    return;
  }

  // UPDATE FLOW

  else if (req.body["action"] == "update") {
    updatePost(post_id, post);

    res.render(__dirname + "/views/home.ejs",
      { postRecords: postRecords }
    );
  }

  return;

})

/* Handling when user tries to update a post from the homepage */

app.post("/createupdate", (req, res) => {
  let post_id = req.body["post_id"];
  let post;

  for (let i = 0; i < postRecords.length; i++) {
    if (post_id == postRecords[i].post_id) {
      post = postRecords[i].post;
      break;
    }
  }

  res.render(__dirname + "/views/createupdate.ejs", { post_id: post_id, post: post });


});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

