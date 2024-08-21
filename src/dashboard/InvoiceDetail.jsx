import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const InvoiceDetail = () => {
  const location = useLocation();
  const [data, setData] = useState(location.state);

  const printInvoice = () => {
    const invoiceContainer = document.getElementById("invoice-container");
    html2canvas(invoiceContainer, { useCORS: true }).then((canvas) => {
      const imageData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [612, 792],
      });
      pdf.internal.scaleFactor = 1;
      const imageProps = pdf.getImageProperties(imageData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imageProps.height * pdfWidth) / imageProps.width;
      pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice" + new Date());
    });
  };

  return (
    <div className="w-full h-screen  ">
      <div className="flex justify-end">
        <button
          onClick={printInvoice}
          className="bg-cyan-600 hover:bg-cyan-400 text-white rounded-lg border-none p-2"
        >
          <i className="fa-solid fa-download"></i> Print Invoice
        </button>
      </div>
      <div
        id="invoice-container"
        className={`p-4 w-[80%] h-[90%] bg-white mx-auto rounded-lg mt-4`}
      >
        <div className="flex justify-between mt-2">
          <div className="flex flex-col items-center gap-2">
            <img
              className="h-20 w-20 rounded-full shadow-lg"
              src={useSelector((state) => state.user.imageUrl)}
              alt="logo"
            />
            <p className="text-2xl font-semibold text-purple-600">
              {useSelector((state) => state.user.companyName)}
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-amber-600">Invoice</p>
            <p className="text-xl ">To : {data.to}</p>
            <p className="text-xl ">Phn : {data.phoneno}</p>
            <p className="text-xl ">Add : {data.address}</p>
            <p className="text-xl ">
              Email : {useSelector((state) => state.user.emailId)}
            </p>
          </div>
        </div>
        <table className="mt-10 w-full">
          <thead className="w-full ">
            <tr className="w-full bg-blue-400 text-white">
              <th className="border-2 border-black p-2 ">S.No</th>
              <th className="border-2 border-black p-2 ">Product Name</th>
              <th className="border-2 border-black p-2 ">Price</th>
              <th className="border-2 border-black p-2 ">Quantity</th>
              <th className="border-2 border-black p-2 ">Total</th>
            </tr>
          </thead>

          <tbody>
            {data.products.map((product) => (
              <tr key={product.id}>
                <td className="border-2 border-black p-2 text-center">
                  {product.id + 1}
                </td>
                <td className="border-2 border-black p-2 text-center">
                  {product.productName}
                </td>
                <td className="border-2 border-black p-2 text-center">
                  {product.price}
                </td>
                <td className="border-2 border-black p-2 text-center">
                  {product.qty}
                </td>
                <td className="border-2 border-black p-2 text-center">
                  {product.qty * product.price}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className=" bg-blue-400 text-white">
              <td
                colSpan="4"
                className="p-2 text-right border-2 border-black font-bold"
              >
                Total
              </td>
              <td className="text-center border-2 border-black font-bold">
                {data.total}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default InvoiceDetail;
