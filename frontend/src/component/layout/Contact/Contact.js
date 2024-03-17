import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";
import MetaData from "../MetaData";

const Contact = () => {
  return (
    <>
      <MetaData title={"Contact"} />
      <div className="contactContainer">
        <a className="mailBtn" href="mailto:mymailforabhi@gmail.com">
          <Button>Contact: ecommerce@gmail.com</Button>
        </a>
      </div>
    </>
  );
};

export default Contact;
