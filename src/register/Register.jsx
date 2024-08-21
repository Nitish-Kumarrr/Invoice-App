import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../Firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import {
  setImageUrl,
  setCompanyName,
  setEmailId,
  setUid,
} from "../redux/slices/UserSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const fileInputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSelectFile = (e) => {
    setFile(e.target.files[0]);
    setImageSrc(URL.createObjectURL(e.target.files[0]));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (file) {
        const storageRef = ref(storage, `images/${new Date() + file.name}`);
        await uploadBytesResumable(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        updateProfile(newUser.user, {
          displayName,
          photoURL: imageUrl,
        });
        await setDoc(doc(db, "users", newUser.user.uid), {
          email,
          displayName,
          uid: newUser.user.uid,
          photoURL: imageUrl,
        });

        dispatch(setCompanyName(displayName));
        dispatch(setImageUrl(imageUrl));
        dispatch(setEmailId(email));
        dispatch(setUid(newUser.user.uid));
        toast.success("Account Created Successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen bg-[#282c34] flex items-center justify-center">
      <div className="h-[80%] w-[98%]  sm:w-[90%] md:w-[60%] bg-[#eee] shadow-lg flex">
        <div className="w-[30%] h-full bg-[url('https://images.pexels.com/photos/8872400/pexels-photo-8872400.jpeg?auto=compress&cs=tinysrgb&w=600')] bg-cover"></div>
        <div className="w-[70%] h-full p-6 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold text-purple-700">
            Create an Account
          </h2>
          <form onSubmit={submitHandler} className="flex flex-col w-full gap-2">
            <label>Email</label>
            <input
              required
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded-lg border-none outline-none shadow-md"
              type="text"
              placeholder="email"
            />
            <label>Company Name</label>
            <input
              required
              className="p-2 rounded-lg border-none outline-none shadow-md"
              type="text"
              placeholder="company name"
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <label>Password</label>
            <input
              required
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 rounded-lg border-none outline-none shadow-md"
              type="password"
              placeholder="password"
            />
            <input
              required
              onChange={(e) => {
                onSelectFile(e);
              }}
              type="file"
              className="mt-4 hidden"
              ref={fileInputRef}
            />
            <input
              required
              type="button"
              value="Choose an image"
              className="p-2 rounded-lg border-none outline-none shadow-md bg-white mt-2"
              onClick={() => {
                fileInputRef.current.click();
              }}
            />
            {imageSrc && (
              <img
                className="h-20 w-20 object-cover rounded-lg"
                src={imageSrc}
                alt="logo"
              />
            )}
            <button className="p-2 bg-blue-500 text-white mt-4 hover:bg-blue-400 rounded-lg shadow-md">
              {loading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}{" "}
              Register
            </button>
          </form>
          <p>
            Already have an account!{"  "}
            <Link to="/login" className="underline hover:text-blue-800 mt-4">
              Login
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Register;
