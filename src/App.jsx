import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Employees from "./components/Employees.jsx";
import Tenants from "./components/Tenants.jsx";
import PaymentHistory from "./components/History.jsx";
import Sanction from "./components/Sanction.jsx";
import Profile from "./components/Profile.jsx";
import Unpaid from "./components/Unpaid.jsx";
import AccountManagement from "./components/AccountManagement.jsx";
import Gcash from "./components/Gcash.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/history" element={<PaymentHistory />} />
        <Route path="/sanction" element={<Sanction />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/unpaid" element={<Unpaid />} />
        <Route path="/account-management" element={<AccountManagement />} />
        <Route path="/gcash" element={<Gcash />} />
      </Routes>
    </>
  );
};

export default App;
