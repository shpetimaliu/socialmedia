const { ObjectID } = require("mongodb");
const { ObjectId } = require("mongodb");
const { post } = require("../server");
const postCollection = require("../db")
  .db(process.env.DATABASE_NAME)
  .collection("posts");

let Post = function (data, req) {
  this.data = data;
  this.errors = [];
  this.userId =
    req.session && req.session.user && req.session.user._id.toString(); // Merrni userID-në nga session cookie dhe konvertoni në string
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
    author: this.userId,
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
  return new Promise(async (resolve, reject) => {
    if (typeof id != "string" || !ObjectId.isValid(id)) {
      reject();
      return;
    }
    let posts = await postCollection
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorDocument",
          },
        },
        {
          $project: {
            title: 1,
            body: 1,
            createDate: 1,
            author: { $arrayElemAt: ["$authorDocument", 0] },
          },
        },
      ])
      .toArray();
    if (posts.length) {
      console.log(posts[0]);
      resolve(posts[0]);
    } else {
      reject("No Post found with the ID of " + id);
    }
  });
};
module.exports = Post;
