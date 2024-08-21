import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);

  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.uid);

  useEffect(() => {
    getData();
  }, [uid]);
  const getData = async () => {
    const q = query(collection(db, "invoices"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setInvoices(data);
  };

  const deleteInvoice = async (id) => {
    const isConfirm = window.confirm("Are you sure you want to delete");
    if (isConfirm) {
      try {
        await deleteDoc(doc(db, "invoices", id));
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 ">
      {invoices.length ? (
        invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex bg-white p-2 rounded-lg shadow-md items-center justify-between"
          >
            <p className="w-1/5">{invoice.to}</p>
            <p className="w-1/5">
              {new Date(invoice.date.seconds * 1000).toLocaleDateString()}
            </p>
            <p className="w-1/5">{invoice.total}</p>
            <button
              onClick={() => {
                deleteInvoice(invoice.id);
              }}
              className="bg-red-600 hover:bg-red-400 text-white p-2 border-none rounded-lg"
            >
              <i className="fa-solid fa-trash"></i> Delete
            </button>
            <button
              onClick={() =>
                navigate("/dashboard/invoice-detail", { state: invoice })
              }
              className="bg-blue-500 hover:bg-blue-400 text-white p-2 border-none rounded-lg ml-2"
            >
              <i className="fa-solid fa-eye"></i> View
            </button>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center w-full h-screen ">
          <i className="fa-solid fa-circle-notch fa-spin font-bold text-4xl text-orange-500"></i>
        </div>
      )}
    </div>
  );
};

export default Invoices;
