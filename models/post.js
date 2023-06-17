const postCollection = require("../db")
  .db(process.env.DATABASE_NAME)
  .collection("posts");

const ObjectID = require("mongodb").ObjectId;

let Post = function (data, req) {
  this.data = data;
  this.errors = [];
  this.userId = req.session.user._id; // Merrni userID-në nga session cookie
};

Post.prototype.cleanUp = function () {
  if (typeof this.data.title !== "string") {
    this.data.title = "";
  }
  if (typeof this.data.body !== "string") {
    this.data.body = "";
  }

  this.data = {
    title: this.data.title.trim(),
    body: this.data.body.trim(),
    createDate: new Date(),
    author: ObjectID(this.userId),
  };
};

Post.prototype.validate = function () {
  if (this.data.title === "") {
    this.errors.push("You must provide a title.");
  }
  if (this.data.body === "") {
    this.errors.push("You must provide a body text.");
  }
};

Post.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();

    if (!this.errors.length) {
      postCollection
        .insertOne(this.data)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          this.errors.push(
            `Something went wrong, Please try again later. ${err}`
          );
          reject(this.errors);
        });
    } else {
      reject(this.errors);
    }
  });
};

Post.findBySingleId = function (id) {
  return new Promise(async function (resolve, reject) {
    if (typeof id !== "string" || !ObjectID.isValid(id)) {
      reject();
      return;
    }

    let post = await postCollection.findOne({ _id: new ObjectID(id) });
    if (post) {
      resolve(post);
    } else {
      reject(`No Post found with the ID of "${id}"`);
    }
  });
};

module.exports = Post;
