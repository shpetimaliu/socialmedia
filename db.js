const { MongoClient } = require("mongodb");

require("dotenv").config();

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const dbName = process.env.dbName;

const uri = `mongodb+srv://${username}:${password}@cluster0.v1bgkee.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const connectDB = async function () {
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log("Connected with MongoDB");

    module.exports = client.db(dbName);

    const app = require("./server");
    app.listen(process.env.PORT);
  } catch (error) {
    console.error("Error related to MongoDB:", error);
  }
};

connectDB();
