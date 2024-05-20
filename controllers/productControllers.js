const productsModel = require("../models/productsModel");

// create product controller
// creating a product
const createProduct = async (req, res) => {
  try {
    const thumbnail = req.file;
    // importing images
    let {
      type,
      title,
      metaTitle,
      slug,
      description,
      metaDescription,
      productDetails,
      lastPrice,
      newPrice,
      stock,
      reviews,
      brand,
    } = req.body;
    // checking validations
    switch (true) {
      case !thumbnail:
        return res
          .status(404)
          .send({ success: false, error: "please provide a thumbnail" });

      case !type:
        return res
          .status(404)
          .send({ success: false, error: "please provide product type" });
      case !title:
        return res
          .status(404)
          .send({ success: false, error: "please provide product title" });
      case !metaTitle:
        return res
          .status(404)
          .send({ success: false, error: "please provide product metaTitle" });
      case !slug:
        return res
          .status(404)
          .send({ success: false, error: "please provide product slug" });
      case !description:
        return res.status(404).send({
          success: false,
          error: "please provide product description",
        });
      case !productDetails:
        return res.status(404).send({
          success: false,
          error: "please provide product productDetails",
        });
      case !newPrice:
        return res
          .status(404)
          .send({ success: false, error: "please provide product newPrice" });
      case !brand:
        return res
          .status(404)
          .send({ success: false, error: "please provide product brand" });
    }
    let parsedDetails;
    if (typeof productDetails !== "object") {
      parsedDetails = JSON.parse(productDetails);
    } else {
      parsedDetails = productDetails;
    }
    // setting first image of images as thumbnail
    // checking slug check if other product have it would cancel it to save
    const slugcheck = await productsModel.findOne({ slug });
    if (slugcheck) {
      return res
        .status(404)
        .send({ success: false, error: "slug already exists" });
    }
    // savign data to database
    const product = await new productsModel({
      type,
      title,
      metaTitle,
      slug,
      description,
      metaDescription,
      brand,
      productDetails: parsedDetails,
      lastPrice,
      newPrice,
      stock,
      reviews,
      thumbnail: thumbnail.filename,
    }).save();
    if (product) {
      return res
        .status(201)
        .send({ success: true, message: "data saved successfully", product });
    } else {
      // if any error occured while saving data to database this respone will be send
      return res.status(500).send({
        success: false,
        error: "an error occured while saving the data",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
      message: "error in creating a product",
    });
    console.log(error.message);
  }
};

// get products controller
const getProducts = async (req, res) => {
  try {
    // getting products and setting the limit of 20
    const products = await productsModel.find({}).sort({ createdAt: -1 });
    res.send({ success: true, total: products.length, products });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};
// get product by type
const getProductsByType = async (req, res) => {
  try {
    const type = req.params.type;
    const limit = req.query.limit || 20;
    const page = req.query.page || 1;
    let brand = req.query.brand;
    let price = req.query.pricing;
    let sort = req.query.sort;
    let sorting = {};

    const args = {
      type,
    };

    if (brand) {
      if (brand.length > 0) {
        brand = brand.split(",");
        args.brand = brand;
      }
    }
    if (price) {
      if (price.length > 0) {
        price = price.split(",");
        let all = [];
        price.map((hi) => {
          let splitted = hi.split("to");
          all.push({ newPrice: { $gte: splitted[0], $lte: splitted[1] } });
        });
        args.$or = all;
      }
    }

    if (sort) {
      if (sort === "price_inc") {
        sorting.newPrice = 1;
      }
      if (sort === "price_dec") {
        sorting.newPrice = -1;
      }
    } else {
      sorting.createdAt = -1;
    }

    const totalCount = (await productsModel.find(args)).length;
    const products = await productsModel
      .find(args)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sorting);

    res.send({ success: true, products, total: totalCount, page });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};
const searchProduct = async (req, res) => {
  try {
    const search = req.params.search;
    const limit = req.query.limit || 20;
    const page = req.query.page || 1;
    let brand = req.query.brand;
    let price = req.query.pricing;
    let sort = req.query.sort;
    let sorting = {};

    const args = {
      $and: [
        { title: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ],
    };

    if (brand) {
      if (brand.length > 0) {
        brand = brand.split(",");
        args.brand = brand;
      }
    }
    if (price) {
      if (price.length > 0) {
        price = price.split(",");
        let all = [];
        price.map((hi) => {
          let splitted = hi.split("to");
          all.push({ newPrice: { $gte: splitted[0], $lte: splitted[1] } });
        });
        args.$or = all;
      }
    }

    if (sort) {
      if (sort === "price_inc") {
        sorting.newPrice = 1;
      }
      if (sort === "price_dec") {
        sorting.newPrice = -1;
      }
    } else {
      sorting.createdAt = -1;
    }

    const totalCount = (await productsModel.find(args)).length;
    const products = await productsModel
      .find(args)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sorting);

    res.send({ success: true, products, total: totalCount, page });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// getting single product
const getSingleProduct = async (req, res) => {
  try {
    // getting single product with _id
    const { slug } = req.params;
    const product = await productsModel.findOne({ slug });
    if (!product) {
      return res
        .status(404)
        .send({ success: false, error: "product does not exist" });
    }
    res.send({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// deleting a product
const deleteProduct = async (req, res) => {
  try {
    // deleting the product with _id
    const _id = req.params._id;
    const product = await productsModel.findByIdAndDelete(_id);
    if (!product) {
      return res
        .status(404)
        .send({ success: false, error: "products does not exist" });
    }
    res.send({
      success: true,
      message: "product deleted successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });

    console.log(error);
  }
};

// updating product
const updateProduct = async (req, res) => {
  try {
    // updating the products with _id
    const _id = req.params._id;
    // check product if it exists
    const checkproduct = await productsModel.findOne({ _id });
    // importing images
    const thumbnail = req.file;

    let {
      type,
      title,
      metaTitle,
      slug,
      description,
      metaDescription,
      productDetails,
      lastPrice,
      newPrice,
      stock,
      reviews,
      brand,
    } = req.body;

    switch (true) {
      // if product will not found
      case !checkproduct:
        return res
          .status(404)
          .send({ success: false, error: "product not found" });

      case !type:
        return res
          .status(404)
          .send({ success: false, error: "please provide product type" });
      case !title:
        return res
          .status(404)
          .send({ success: false, error: "please provide product title" });
      case !metaTitle:
        return res
          .status(404)
          .send({ success: false, error: "please provide product metaTitle" });
      case !slug:
        return res
          .status(404)
          .send({ success: false, error: "please provide product slug" });
      case !description:
        return res.status(404).send({
          success: false,
          error: "please provide product description",
        });
      case !productDetails:
        return res.status(404).send({
          success: false,
          error: "please provide product productDetails",
        });
      case !newPrice:
        return res
          .status(404)
          .send({ success: false, error: "please provide product newPrice" });
      case !brand:
        return res
          .status(404)
          .send({ success: false, error: "please provide product brand" });
    }
    // checking slug
    const slugcheck = await productsModel.findOne({ slug });
    if (slugcheck) {
      if (slugcheck.slug !== checkproduct.slug) {
        return res
          .status(404)
          .send({ success: false, error: "slug already exists" });
      }
    }
    let parsedDetails;
    if (typeof productDetails !== "object") {
      parsedDetails = JSON.parse(productDetails);
    } else {
      parsedDetails = productDetails;
    }

    // updating the data
    const product = await productsModel.findByIdAndUpdate(
      _id,
      {
        type,
        title,
        metaTitle,
        slug,
        description,
        metaDescription,
        brand,
        productDetails: parsedDetails,
        lastPrice,
        newPrice,
        stock,
        reviews,
        thumbnail: thumbnail ? thumbnail.filename : checkproduct.thumbnail,
      },
      { new: true }
    );
    if (product) {
      return res
        .status(200)
        .send({ success: true, message: "data updated successfully", product });
    } else {
      return res.status(500).send({
        success: false,
        error: "an error occured while saving the data",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
    });
    console.log(error.message);
  }
};

// rating a product
const rateProduct = async (req, res) => {
  try {
    // rating the product by _id
    const _id = req.params._id;
    const user = req.user;
    // destructuring data
    const { rate, comment } = req.body;
    const checkproduct = await productsModel.findById(_id);
    const productreviews = checkproduct.reviews;
    // checking usr review count
    const reviewcount = productreviews.filter(
      (review) => review.user._id === user._id
    );

    if (!checkproduct) {
      return res.status(404).send({
        success: false,
        error: "product does not exist",
      });
    }
    if (reviewcount.length >= 2) {
      return res.status(401).send({
        success: false,
        error: "a user cannot post more then 2 reviews",
      });
    }
    if (!rate) {
      return res
        .status(404)
        .send({ success: false, error: "rate is required for review" });
    }
    if (!comment) {
      return res
        .status(404)
        .send({ success: false, error: "comment is required for review" });
    }
    // rating the product
    const reviewFinal = {
      rate: +rate,
      comment,
      _id: user._id + Math.round(Math.random() * 10000000000),
      allowed: false,
      pid: _id,
      createdAt: new Date(),
      user: {
        name: user.name,
        roll: user.roll,
        _id: user._id,
      },
    };
    const ratedProduct = await productsModel.findByIdAndUpdate(
      _id,
      {
        reviews: [reviewFinal, ...checkproduct.reviews],
      },
      {
        new: true,
      }
    );
    if (!ratedProduct) {
      return res
        .status(500)
        .send({ success: false, error: "error while reviewing the product" });
    }
    return res.status(201).send({
      success: true,
      message: "product rated successfully",
      review: reviewFinal,
    });
  } catch (error) {
    console.log(error);
    res.send({ success: false, error: error.message });
  }
};

// deleting review
const deleterate = async (req, res) => {
  try {
    const _id = req.params._id;
    const rid = req.params.rid;
    const user = req.user;
    // destructuring data
    const checkproduct = await productsModel.findById(_id);
    // checking product existence
    if (!checkproduct) {
      return res
        .status(404)
        .send({ success: false, error: "product not found" });
    }
    // getting review
    const gettingreview = checkproduct.reviews.find(
      (review) => review._id === rid
    );
    if (!gettingreview) {
      return res
        .status(404)
        .send({ success: false, error: "review not found" });
    }
    // if (gettingreview.user._id !== user._id || user.role !== "ADMIN") {
    //   return res.status(401).send({
    //     success: "false",
    //     user,
    //     error: "only admin or user can delete this rate",
    //   });
    // }
    const filterreviews = checkproduct.reviews.filter(
      (review) => review._id !== rid
    );

    const deleterate = await productsModel.findByIdAndUpdate(
      _id,
      {
        reviews: filterreviews,
      },
      { new: true }
    );

    if (!deleterate) {
      return res
        .status(500)
        .send({ success: false, error: "an error occured" });
    }
    return res.send({ success: true, message: "review deleted successfully" });
  } catch (error) {
    console.log(error);
    res.send({ success: false, error: error.message });
  }
};

// getting not allowed reviews
const getnotallowedreviews = async (req, res) => {
  try {
    const getProducts = await productsModel.find({});
    let allproductreviews = [];
    getProducts.map((product) => {
      product.reviews.map((review) => {
        allproductreviews.push(review);
      });
    });

    const notallowedreviews = allproductreviews.filter(
      (review) => !review.allowed
    );

    notallowedreviews.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    notallowedreviews.reverse();
    res.send({ reviews: notallowedreviews, success: true });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
};

// upadating allowed permission of review

const updateallowedreview = async (req, res) => {
  try {
    const _id = req.params._id;
    const rid = req.params.rid;
    let action = req.body.action;
    const checkproduct = await productsModel.findById(_id);
    if (!checkproduct) {
      return res
        .status(404)
        .send({ error: "product not found", success: false });
    }
    const checkreview = checkproduct.reviews.find(
      (review) => review._id == rid
    );
    if (!checkreview) {
      return res
        .status(404)
        .send({ error: "review not found", success: false });
    }
    if (!action) {
      action = false;
    }
    const remainingreview = checkproduct.reviews.filter(
      (review) => review._id !== rid
    );
    const { allowed, ...review } = checkreview;
    const updatereview = await productsModel.findByIdAndUpdate(_id, {
      reviews: [{ ...review, allowed: action }, ...remainingreview],
    });
    if (!updatereview) {
      return res
        .status(500)
        .send({ success: false, error: "an error occured" });
    }
    res.send({ message: "review updated successfull", success: true, action });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  rateProduct,
  deleterate,
  getnotallowedreviews,
  updateallowedreview,
  getProductsByType,
  searchProduct,
};
