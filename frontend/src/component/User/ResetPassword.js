import React, { Fragment, useState, useEffect } from "react";
import "./ResetPassword.css";
import Loader from "../layout/Loader/Loader";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword } from "../../actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import LockIcon from '@mui/icons-material/Lock';


const ResetPassword = () => {
    const navigate=useNavigate();
    const params=useParams();
    const dispatch = useDispatch();
    const alert = useAlert();
  
    const { error,success, loading } = useSelector((state) => state.forgotPassword);
    
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
  
    const resetPasswordSubmit = (e) => {
      e.preventDefault();
  
      const myForm = new FormData();
  
      myForm.set("password",password);
      myForm.set("confirmPassword",confirmPassword);
      
      dispatch(resetPassword(params.token, myForm));
    };
  
    
  
    //const redirect = location.search ? location.search.split("=")[1] : "/account";
  
    useEffect(() => {
      
      if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }
  
      if (success) {
        alert.success("Password Updated Successfully");
        navigate("/login");
        
      }
    }, [dispatch, error, alert,navigate, success]);
    return (
      <Fragment>
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <MetaData title="Reset Password" />
            <div className="resetPasswordContainer">
              <div className="resetPasswordBox">
                <h2 className="resetPasswordHeading">Reset Password</h2>
                <form
                  className="resetPasswordForm"
                  onSubmit={resetPasswordSubmit}
                >
                  
                  
                  <div>
                    <LockIcon />
                    <input
                      type="password"
                      placeholder="New Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <LockOpenIcon />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
  
                  <input
                    type="submit"
                    value="Update"
                    className="resetPasswordBtn"
                  />
                </form>
              </div>
            </div>
          </Fragment>
        )}
      </Fragment>
    )
}

export default ResetPassword