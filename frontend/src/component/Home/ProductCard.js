import { Rating } from "@material-ui/lab";
import React from "react";
import { Link } from "react-router-dom";



const ProductCard = ({product}) => {
  const options={
    size:"large",
    value:product.ratings,
    readOnly:true,
    precision:0.5,
  }
  return ( 
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={product.image[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <Rating {...options} />
        <span className="productCardSpan">({product.numOfReviews} Review)</span>
      </div>
      <span>₹{product.price}</span>
    </Link>
  );
};

export default ProductCard;
