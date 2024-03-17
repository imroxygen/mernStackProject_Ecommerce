import React, { useEffect } from "react";
import { LuMouse } from "react-icons/lu";
import "./Home.css";
import MetaData from "../layout/MetaData";
import { clearError, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import {useAlert} from "react-alert";
import ProductCard from "./ProductCard";




const Home = () => {
  const alert=useAlert();
  const dispatch = useDispatch();
  const { loading, error, products} = useSelector(
    (state) => state.products
  );
  
  useEffect(() => {
    if(error){
      alert.error(error);
      dispatch(clearError());
    }
    dispatch(getProduct());
  }, [dispatch,error,alert]);
  return (
    <>
      {loading ? (
        <Loader/>
      ) : (
        <>
          <MetaData title={"ECOMMERCE."} />
          <div className="banner">
            <p>Welcome to Ecommerce.</p>
            <h1>Find Amazing Products Below</h1>

            <a href="#container">
              <button>
                Scroll <LuMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Product</h2>
          <div className="container" id="container">
            {products && products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
