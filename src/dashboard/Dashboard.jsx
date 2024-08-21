import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../Firebase";
import {
  setCompanyName,
  setEmailId,
  setImageUrl,
} from "../redux/slices/UserSlice";
import { signOut } from "firebase/auth";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [displayMenu, setDisplayMenu] = useState(false);

  const imagUrl = useSelector((state) => state.user.imageUrl);
  const cName = useSelector((state) => state.user.companyName);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Logged Out Successfully");
        dispatch(setCompanyName(""));
        dispatch(setImageUrl(""));
        dispatch(setEmailId(""));
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.message);
      });
    handleToggle();
  };

  const handleToggle = () => {
    setDisplayMenu(!displayMenu);
  };

  return (
    <div className="w-full h-screen md:flex bg-[#eee]">
      <div
        className={`w-full ${
          displayMenu ? "absolute md:fixed" : "hidden md:flex"
        }  md:w-1/5 flex flex-col h-screen bg-[#282c34] p-3 `}
      >
        <div className="flex w-full  text-white justify-between ">
          <div className="flex flex-col w-full items-center justify-center gap-1 relative">
            <i
              onClick={handleToggle}
              className="fa-solid fa-square-xmark md:hidden text-xl cursor-pointer text-white absolute right-0 top-0 hover:text-red-500 p-1"
            ></i>
            <img
              className="w-16 h-16 rounded-full "
              src={imagUrl}
              alt="profile"
            />
            <p className="text-xl">{cName}</p>
            <button
              onClick={handleLogout}
              className="bg-white border-none rounded-lg p-2 text-black"
            >
              Logout
            </button>
          </div>
        </div>
        <hr className="mt-4" />
        <div className="flex flex-col text-white gap-4 mt-6 w-full">
          <Link
            to="/dashboard"
            className="no-underline  hover:bg-blue-700 p-2"
            onClick={() => displayMenu && handleToggle()}
          >
            <i className="fa-solid fa-house"></i> Home
          </Link>
          <Link
            to="/dashboard/invoices"
            className="no-underline  hover:bg-blue-700 p-2"
            onClick={() => {
              displayMenu && handleToggle();
            }}
          >
            <i className="fa-solid fa-file-invoice"></i> Invoices
          </Link>
          <Link
            to="/dashboard/new-invoice"
            className="no-underline  hover:bg-blue-700 p-2"
            onClick={() => displayMenu && handleToggle()}
          >
            <i className="fa-solid fa-file-circle-plus"></i> New Invoice
          </Link>
          <Link
            to="/dashboard/setting"
            className="no-underline  hover:bg-blue-700 p-2"
            onClick={() => displayMenu && handleToggle()}
          >
            <i className="fa-solid fa-gear"></i> Setting
          </Link>
        </div>
      </div>
      <i
        onClick={handleToggle}
        className="fa-solid fa-bars text-xl md:hidden rounded-lg cursor-pointer py-1 px-2 "
      ></i>
      <div
        className={`w-full md:w-4/5 ${
          displayMenu && "hidden md:block"
        }hidden h-screen bg-[#eee] p-2 md:p-4`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
