import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase";
import {
  setEmailId,
  setImageUrl,
  setCompanyName,
  setUid,
} from "../redux/slices/UserSlice";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const currentUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(setCompanyName(currentUser.user.displayName));
      dispatch(setImageUrl(currentUser.user.photoURL));
      dispatch(setEmailId(currentUser.user.email));
      dispatch(setUid(currentUser.user.uid));
      toast.success("Logged In Successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#282c34] flex items-center justify-center">
      <div className="h-[70%] w-[98%] sm:w-[90%] md:w-[60%] bg-[#eee] shadow-lg flex">
        <div className="w-[30%] h-full bg-[url('https://images.pexels.com/photos/8872400/pexels-photo-8872400.jpeg?auto=compress&cs=tinysrgb&w=600')] bg-cover "></div>
        <div className="w-[70%] h-full p-6 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold text-purple-700">Login</h2>
          <form onSubmit={submitHandler} className="flex flex-col w-full gap-2">
            <label>Email</label>
            <input
              required
              className="p-2 rounded-lg border-none outline-none shadow-md"
              type="text"
              placeholder="email"
              name="email"
            />
            <label>Password</label>
            <input
              required
              className="p-2 rounded-lg border-none outline-none shadow-md"
              type="password"
              placeholder="password"
              name="password"
            />
            <button className="p-2 bg-blue-500 text-white mt-4 hover:bg-blue-400 rounded-lg shadow-md">
              {loading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}{" "}
              Login
            </button>
          </form>
          <p>
            Dont have Account!{" "}
            <Link to="/register" className="underline hover:text-blue-800 mt-4">
              Register
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Login;
