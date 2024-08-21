import { addDoc, collection, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NewInvoice = () => {
  const [to, setTo] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [address, setAddress] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(1);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const uid = useSelector((state) => state.user.uid);

  const addProductHandler = (e) => {
    e.preventDefault();
    setProducts((prevProducts) => [
      ...prevProducts,
      { id: products.length, productName, price, qty },
    ]);

    const t = price * qty;
    setTotal(total + t);
    setProductName("");
    setPrice("");
    setQty(1);
  };

  const saveData = async () => {
    setLoading(true);
    const data = await addDoc(collection(db, "invoices"), {
      to,
      phoneno,
      address,
      products,
      total,
      date: Timestamp.fromDate(new Date()),
      uid,
    });
    navigate("/dashboard/invoices");
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="text-2xl font-semibold">New Invoice</h3>
        <button
          onClick={saveData}
          className="bg-blue-600 text-white  p-2 border-none hover:bg-blue-400 rounded-lg"
        >
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin-pulse"></i>
          ) : (
            <i className="fa-solid fa-floppy-disk"></i>
          )}{" "}
          Save Data
        </button>
      </div>
      <form className="mt-6 flex flex-col gap-6 justify-start text-sm sm:text-[16px] md:text-xl">
        <div className="flex gap-5">
          <input
            className="p-2 w-[33%] border-none rounded-lg outline-none"
            type="text"
            placeholder="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <input
            className="p-2 w-[33%]  border-none rounded-lg outline-none"
            type="text"
            placeholder="phone no"
            value={phoneno}
            onChange={(e) => setPhoneno(e.target.value)}
          />
          <input
            className="p-2 w-[33%] border-none rounded-lg outline-none"
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="flex gap-5 text-sm sm:text-[16px] md:text-xl">
          <input
            className="p-2 w-[33%] border-none rounded-lg outline-none"
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            className="p-2 w-[33%]  border-none rounded-lg outline-none"
            type="text"
            placeholder="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            className="p-2 w-[33%] border-none rounded-lg outline-none"
            type="number"
            placeholder="Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </div>
        <button
          onClick={addProductHandler}
          className="bg-blue-600 text-sm sm:text-[16px] text-white p-2 border-none hover:bg-blue-400 rounded-lg "
        >
          Add Product
        </button>
      </form>
      {products.length ? (
        <div className="mt-4 text-sm sm:text-[16px] md:text-xl w-full flex bg-white p-2 gap-1">
          <p className="w-[10%] text-center">S.No</p>
          <p className="w-[21%] text-center">Product Name</p>
          <p className="w-[21%] text-center">Price</p>
          <p className="w-[21%] text-center">Quantity</p>
          <p className="w-[21%] text-center">Total</p>
        </div>
      ) : (
        ""
      )}

      {products.length
        ? products.map((product) => (
            <div
              className="flex text-sm sm:text-[16px] md:text-xl bg-white w-full p-2 gap-1"
              key={product.id}
            >
              <p className="w-[10%] text-center">{product.id + 1}</p>
              <p className="w-[21%] text-center">{product.productName}</p>
              <p className="w-[21%] text-center">{product.price}</p>
              <p className="w-[21%] text-center">{product.qty}</p>
              <p className="w-[21%] text-center">
                {product.price * product.qty}
              </p>
            </div>
          ))
        : ""}
      <hr />
      {products.length ? (
        <div className="bg-white text-sm sm:text-[16px] md:text-xl flex justify-end p-2 ">
          <p className="w-[32%]">Total : {total}</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NewInvoice;
