import Dashboard from "./dashboard/Dashboard";
import Home from "./dashboard/Home";
import InvoiceDetail from "./dashboard/InvoiceDetail";
import Invoices from "./dashboard/Invoices";
import NewInvoice from "./dashboard/NewInvoice";
import Setting from "./dashboard/Setting";
import Login from "./login/Login";
import Register from "./register/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="new-invoice" element={<NewInvoice />} />
          <Route path="setting" element={<Setting />} />
          <Route path="invoice-detail" element={<InvoiceDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
