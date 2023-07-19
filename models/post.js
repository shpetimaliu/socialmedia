const { ObjectId } = require("mongodb");
const User = require("./user");
const postCollection = require("../db")
  .db(process.env.DATABASE_NAME)
  .collection("posts");

let Post = function (data, req) {
  this.data = data;
  this.errors = [];
  this.userId =
    req.session && req.session.user && new ObjectId(req.session.user._id);
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

Post.reusablePostQuery = function (uniqueOperations, visitorId) {
  return new Promise(async (resolve, reject) => {
    let aggOperations = uniqueOperations.concat([
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
          authorId: "$author",
          author: { $arrayElemAt: ["$authorDocument", 0] },
        },
      },
    ]);

    let posts = await postCollection.aggregate(aggOperations).toArray();

    posts = posts.map((post) => {
      post.isVisitorOwner = new ObjectId(post.authorId).equals(visitorId);

      post.author = {
        username: post.author.username,
        profile: new User(post.author, true).profile,
      };
      return post;
    });

    resolve(posts);
  });
};

Post.findBySingleId = function (id, visitorId) {
  return new Promise(async (resolve, reject) => {
    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      reject();
      return;
    }

    let posts = await Post.reusablePostQuery(
      [{ $match: { _id: new ObjectId(id) } }],
      visitorId
    );

    if (posts.length) {
      console.log(posts[0]);
      resolve(posts[0]);
    } else {
      reject("No Post found with the ID of " + id);
    }
  });
};

Post.findByAuthorId = (authorId) => {
  return Post.reusablePostQuery([
    { $match: { author: authorId } },
    { $sort: { createDate: -1 } },
  ]);
};

module.exports = Post;
