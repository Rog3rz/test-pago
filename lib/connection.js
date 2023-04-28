const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://Rog3rz:1234@cluster0.ts5vvu6.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const dbName = "DummyJSON";
const collName = "DummyProducts";

const connectCluster = async () => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collName);
  console.log("Connected to Mongo Cluster");
  return {
    db,
    collection,
  };
};

module.exports = {
    connectCluster,
    client,
    dbName
};
