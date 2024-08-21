import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { useSelector } from "react-redux";
const Home = () => {
  const uid = useSelector((state) => state.user.uid);

  const [total, setTotal] = useState("");
  const [totalInvoice, setTotalInvoice] = useState("");
  const [totalMonthCollection, setTotalMonthCollection] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    getData();
  }, [invoices.length]);

  const getData = async () => {
    const q = query(collection(db, "invoices"), where("uid", "==", uid));
    try {
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvoices(data);
      getTotalInvoice(invoices);
      setTotalInvoice(invoices.length);
      getTotalMonthCollection(invoices);
      getEachMonthCollection(invoices);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getTotalInvoice = (invoiceList) => {
    const tot = invoiceList.reduce((acc, curr) => acc + curr.total, 0);
    setTotal(tot);
  };

  const getTotalMonthCollection = (invoiceList) => {
    const tot = invoiceList
      .filter(
        (invoice) =>
          new Date(invoice.date.seconds * 1000).getMonth() ===
          new Date().getMonth()
      )
      .reduce((acc, curr) => acc + curr.total, 0);
    setTotalMonthCollection(tot);
  };

  const getEachMonthCollection = (invoiceList) => {
    const chartData = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };
    invoiceList.forEach((invoice) => {
      chartData[
        new Date(invoice.date.seconds * 1000).toLocaleDateString("default", {
          month: "long",
        })
      ] += invoice.total;
    });
    createChart(chartData);
  };

  const createChart = (chartData) => {
    const ctx = document.getElementById("myChart");
    if (Chart.getChart("myChart")) {
      Chart.getChart("myChart")?.destroy();
    }
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: "Month Wise Collection",
            data: Object.values(chartData),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div className="h-full w-full ">
      <div className="flex sm:justify-between flex-col sm:flex-row gap-2">
        <div className="w-full sm:w-[30%] shadow-lg h-[200px] bg-gradient-to-r from-sky-500 to-indigo-400 rounded-lg flex items-center justify-center flex-col">
          <h1 className="text-xl text-white font-semibold">{total}</h1>
          <p className="font-semibold">Total</p>
        </div>
        <div className="w-full sm:w-[30%] shadow-lg h-[200px] bg-gradient-to-r from-amber-500 to-red-400 rounded-lg flex items-center justify-center flex-col">
          <h1 className="text-xl text-white font-semibold">{totalInvoice}</h1>
          <p className="font-semibold">No of Invoice</p>
        </div>
        <div className="w-full sm:w-[30%] shadow-lg h-[200px] bg-gradient-to-r from-purple-500 to-pink-400 rounded-lg flex items-center justify-center flex-col">
          <h1 className="text-xl text-white font-semibold">
            {totalMonthCollection}
          </h1>
          <p className="font-semibold">Month Collection</p>
        </div>
      </div>
      <div className="w-full   md:flex md:justify-between mt-4 ">
        <div className="bg-white w-full md:w-[58%] h-[60vh] shadow-lg rounded-lg">
          <canvas id="myChart"></canvas>
        </div>
        <div className="bg-white w-full md:w-[40%] h-[60vh] shadow-lg rounded-lg mt-2 md:mt-0 ">
          <h1 className="text-xl bg-indigo-400 text-white text-center p-2 rounded-lg">
            Recent Invoice List
          </h1>
          <div className="flex justify-between items-center p-2 hover:bg-[#eee]  gap-2">
            {!isSearch && (
              <p className="w-[30%] text-center ">
                <i
                  onClick={() => setIsSearch(true)}
                  className="fa-solid fa-magnifying-glass mr-1 cursor-pointer"
                ></i>
                Name
              </p>
            )}
            {isSearch && (
              <>
                <input
                  className="w-[30%]"
                  type="text"
                  placeholder="search names"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <i
                  onClick={() => {
                    setSearch("");
                    setIsSearch(false);
                  }}
                  className="fa-solid fa-xmark hover:bg-red-500 hover:text-white"
                ></i>
              </>
            )}
            <p className="w-[30%] text-center">Date</p>
            <p className="w-[30%] text-center">Total</p>
          </div>
          {invoices
            .filter((invoice) =>
              invoice.to.toLowerCase().includes(search.toLowerCase())
            )
            .map((invoice, idx) => (
              <div
                key={idx}
                className="flex justify-between p-2 hover:bg-[#eee]  gap-2 "
              >
                <p className="w-[30%] text-center ">{invoice.to}</p>
                <p className="w-[30%] text-center text-sm">
                  {new Date(invoice.date.seconds * 1000).toLocaleDateString()}
                </p>
                <p className="w-[30%] text-center">{invoice.total}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
