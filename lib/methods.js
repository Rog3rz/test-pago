const { connectCluster } = require("./connection");

const getProducts = async () => {
  const { collection } = await connectCluster();
  const find = await collection
    .find({
      category: "laptops",
    })
    .toArray();
  return find;
};

module.exports = {
  getProducts,
};
