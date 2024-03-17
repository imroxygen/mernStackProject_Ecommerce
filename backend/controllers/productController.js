const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErros = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");
const catchAsyncError = require("../middleware/catchAsyncError");
const cloudinary = require("cloudinary");

//create Product --->Admin

exports.createProduct = catchAsyncErros(async (req, res, next) => {
  let image = [];
  if (typeof req.body.image === "string") {
    image.push(req.body.image);
  } else {
    image = req.body.image;
  }

  const imagesLinks = [];
  for (let i = 0; i < image.length; i++) {
    const result = await cloudinary.v2.uploader.upload(image[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.image = imagesLinks;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//Get all product
exports.getAllProducts = catchAsyncErros(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
  });
});
//Get all product(Admin)
exports.getAdminProducts = catchAsyncErros(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});
//get product Details
exports.getProductDetails = catchAsyncErros(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});
//Upade--->Admin
exports.upadateProduct = catchAsyncErros(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  //images start here
  let image = [];
  if (typeof req.body.image === "string") {
    image.push(req.body.image);
  } else {
    image = req.body.image;
  }

  if (image !== undefined) {
    //delete images from clodinary
    for (let i = 0; i < product.image.length; i++) {
      await cloudinary.v2.uploader.destroy(product.image[i].public_id);
    }
 
    const imagesLinks = [];
    for (let i = 0; i < image.length; i++) {
      const result = await cloudinary.v2.uploader.upload(image[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.image=imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//Delete product--Admin
exports.deleteProduct = catchAsyncErros(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  //delete images from clodinary
  for (let i = 0; i < product.image.length; i++) {
    await cloudinary.v2.uploader.destroy(product.image[i].public_id);
  }
  await Product.deleteOne({ _id: product._id });

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

//create new review or update the review

exports.createProductreview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.ratings = product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//get all review of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//delete reviews
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  let ratings=0;
  if(reviews.length===0){
    ratings=0;
  }else{
    ratings = avg / reviews.length;
  }


  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
});
