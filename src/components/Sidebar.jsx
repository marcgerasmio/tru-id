import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiUsers,
  FiHome,
  FiClipboard,
  FiFileText,
} from "react-icons/fi";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaUserCog } from "react-icons/fa";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const openModal = () => document.getElementById("error_modal")?.showModal();
  const closeModal = () => document.getElementById("error_modal")?.close();
  const logout = () => navigate("/");

  const links = [
    { to: "/dashboard", icon: <FiHome size={16} />, label: "Dashboard" },
    { to: "/employees", icon: <FiUsers size={16} />, label: "Employees" },
    { to: "/tenants", icon: <FiClipboard size={16} />, label: "Tenants" },
    { to: "/unpaid", icon: <FiFileText size={16} />, label: "Unpaid Payments" },
    {
      to: "/history",
      icon: <FiFileText size={16} />,
      label: "Payment History",
    },
    { to: "/sanction", icon: <FiFileText size={16} />, label: "Sanctions" },
    {
      to: "/account-management",
      icon: <FaUserCog size={16} />,
      label: "Account Management",
    },
  ];

  return (
    <aside className="flex flex-col md:flex-row max-h-screen lg:fixed lg:h-screen overflow-y-auto">
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#171e29] text-white z-40 border-b border-[#2a3441]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-2 rounded-md hover:bg-[#2a3441]"
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <h1 className="text-2xl sm:text-2xl md:text-5xl lg:text-6xl font-bold">
            Tru
            <span className="text-error">I</span>
            <span className="text-info">D</span>
            <span className="text-xs">Admin</span>
          </h1>
          <img
            src="/logo.png"
            alt="Admin"
            className="w-8 h-8 rounded-full border-2 border-gray-600"
          />
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden mt-14"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static flex flex-col h-screen bg-[#1e2530] text-gray-300 w-full md:w-64 shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen
            ? "translate-y-14 md:translate-y-0"
            : "-translate-y-full md:translate-y-0"
        } top-0 left-0 overflow-y-auto max-h-[calc(100vh-56px)] md:max-h-screen`}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-2 mt-4">
          <h1 className="text-5xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            Tru
            <span className="text-error">I</span>
            <span className="text-info">D</span>
            <span className="text-sm">Admin</span>
          </h1>
          <span className="text-sm text-gray-400">Rental Management</span>
        </div>

        <div className="border-t mt-5 border-[#3c4a5c]" />

        <nav className="flex-1 py-4">
          <ul className="space-y-1 text-sm">
            {links.map(({ to, icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 ${
                      isActive ? "bg-info text-white" : "hover:bg-[#2a3441]"
                    }`
                  }
                >
                  <span className="mr-3">{icon}</span>
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <div
                className="flex items-center px-4 py-2.5 cursor-pointer hover:bg-[#2a3441]"
                onClick={openModal}
              >
                <RiLogoutCircleLine className="mr-3" size={16} />
                Sign out
              </div>
            </li>
          </ul>
        </nav>

        <div className="px-4 py-2 text-xs text-gray-400 border-t border-[#3c4a5c]">
          <p>Devs: Christian, Melissa, Claire</p>
        </div>
      </div>

      {/* Logout Modal */}
      <dialog id="error_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-base">Confirm Action</h3>
          <p className="py-4">Are you sure you want to sign out?</p>
          <div className="flex justify-end">
            <button
              className="btn btn-error text-white flex items-center"
              onClick={logout}
            >
              <RiLogoutCircleLine className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </dialog>
    </aside>
  );
};

export default Sidebar;
