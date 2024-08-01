const connectDb = require("../config/dataBaseConnection");
const products = require("../data/products.json");
const product = require("../model/ProductModel");

const seeder = async () => {
  try {
    await connectDb();
    await product.deleteMany();
    console.log("All deleted");
    await product.insertMany(products);
    console.log("All product added");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
seeder();
