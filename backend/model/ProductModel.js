const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please fill the product name"],
    maxLength: [100, "Product exceed the 100 character limit"],
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: [true, "please enter product description"],
  },
  rating: {
    type: String,
    default: 0,
  },
  image: [
    {
      image: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "please enter the category"],
    enum: {
      values: [
        "Electronics",
        "Laptop",
        "Mobile phone",
        "Food",
        "Clothes",
        "Books",
        "Accessories",
        "Headphones",
        "Sports",
      ],
      message: "Please select the correct category",
    },
  },
  seller: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: [true, "Please enter the product stock count"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

let product = mongoose.model("product", productSchema);

module.exports = product;
