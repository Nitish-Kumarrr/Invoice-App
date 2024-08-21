import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth, db, storage } from "../Firebase";
import {
  setCompanyName,
  setEmailId,
  setImageUrl,
} from "../redux/slices/UserSlice";
import { updateEmail, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Setting = () => {
  const dispatch = useDispatch();

  const imageUrl = useSelector((state) => state.user.imageUrl);
  const uid = useSelector((state) => state.user.uid);
  const companyName = useSelector((state) => state.user.companyName);

  const [file, setFile] = useState(null);
  const [displayName, setDisplayName] = useState(companyName);
  const [imageSrc, setImageSrc] = useState(imageUrl);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const nameInputRef = useRef(null);

  const onSelectFile = (e) => {
    setFile(e.target.files[0]);
    setImageSrc(URL.createObjectURL(e.target.files[0]));
  };

  const updateLogo = async () => {
    setLoading(false);
    const fileRef = ref(storage, imageUrl);
    console.log(fileRef._location.path_);
    const storageRef = ref(storage, fileRef._location.path_);
    try {
      await uploadBytesResumable(storageRef, file);
      toast.success("Logo Updated Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateName = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName,
      });
      await updateDoc(doc(db, "users", uid), {
        displayName,
      });
      dispatch(setCompanyName(displayName));
      toast.success("Name updated Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-full p-6  ">
      <div className="w-[80%] min-h-[400px] bg-white mx-auto mt-10 shadow-lg rounded-lg ">
        <div className="p-6 flex flex-col items-center gap-4 relative">
          <img
            onClick={() => {
              setLoading(true);
              fileInputRef.current.click();
            }}
            className="h-24 w-24 rounded-full shadow-lg cursor-pointer "
            src={imageSrc}
            alt="logo"
          />

          <input
            className="hidden"
            type="file"
            onChange={(e) => {
              onSelectFile(e);
            }}
            ref={fileInputRef}
          />
          {file && (
            <button
              onClick={updateLogo}
              className="bg-amber-600 h-max p-2 text-white w-2/4"
            >
              {loading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}{" "}
              Update Profile
            </button>
          )}
        </div>
        <div className="p-6 flex  justify-center gap-2">
          <input
            className="shadow-gray-600 shadow-sm w-2/4 p-2 border-none outline-none rounded-lg"
            type="text"
            placeholder="Company Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            ref={nameInputRef}
          />
          <button
            onClick={() => nameInputRef.current.focus()}
            className="bg-amber-600  p-2 text-white border-none rounded-lg"
          >
            <i class="fa-solid fa-pen"></i> Edit
          </button>
          <button
            onClick={updateName}
            className="bg-amber-600  p-2 text-white border-none rounded-lg"
          >
            <i className="fa-solid fa-circle-check"></i> Update
          </button>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Setting;
