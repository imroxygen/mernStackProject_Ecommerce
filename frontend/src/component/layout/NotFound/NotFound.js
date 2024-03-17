import React from "react";
import ErrorIcon from '@mui/icons-material/Error';
import "./NotFound.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import MetaData from "../MetaData";

const NotFound = () => {
  return (
    <>
    <MetaData title={"Error"} />
    <div className="PageNotFound">
      <ErrorIcon />

      <Typography>Page Not Found </Typography>
      <Link to="/">Home</Link>
    </div>
    </>
  );
};

export default NotFound;