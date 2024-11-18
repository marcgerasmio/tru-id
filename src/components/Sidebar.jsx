import { useState } from "react";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    const modal = document.getElementById("error_modal");
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("error_modal");
    if (modal) {
      modal.close();
    }
  };

  const logout = () => {
    navigate("/");
  }
  return (
    <>
      <aside className="bg-gray-800 text-white p-8 lg:fixed lg:h-full lg:w-64 w-full">
        <div className="flex justify-between items-center lg:block">
          <h1 className="hidden lg:block text-6xl font-bold mb-2 lg:mb-10">
            Tru
            <span className="text-red-700">I</span>
            <span className="text-blue-900">D</span>
            <span className="text-sm text-white">Admin</span>
          </h1>

          <h1 className="block lg:hidden w-1/6 sm:w-1/8 md:w-1/10 object-contain text-3xl font-bold">
            Tru
            <span className="text-red-700">I</span>
            <span className="text-blue-900">D</span>
          </h1>
          <button
            className="lg:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        <nav
          className={`flex flex-col lg:flex ${
            isMenuOpen ? "block" : "hidden"
          } lg:block`}
        >
          <ul className="space-y-2">
            <li className="p-2 hover:bg-red-600 rounded">
              <NavLink to="/dashboard" className="block">
                Dashboard
              </NavLink>
            </li>

            <li className="p-2 hover:bg-red-600 rounded">
              <NavLink to="/employees" className="block">
                Employees
              </NavLink>
            </li>

            <li className="p-2 hover:bg-red-600 rounded">
              <NavLink to="/tenants" className="block">
                Tenants
              </NavLink>
            </li>

            <li className="p-2 hover:bg-red-600 rounded">
              <NavLink to="/unpaid" className="block">
                Unpaid Payments
              </NavLink>
            </li>

            <li className="p-2 hover:bg-red-600 rounded">
              <NavLink to="/history" className="block">
                Payment History
              </NavLink>
            </li>

            <li className="p-2 hover:bg-red-600 rounded">
              <NavLink to="/sanction" className="block">
                Sanctions
              </NavLink>
            </li>
          </ul>

          <NavLink to="/profile" className="block">
            <button className="hidden lg:flex items-center hover:bg-red-600 p-2 rounded mt-10">
              <span className="mr-2">
                <FaUser size={15} />
              </span>
              Admin
            </button>
          </NavLink>
          <button
            onClick={() => openModal()}
            className="hidden lg:flex items-center hover:bg-red-600 rounded p-2"
          >
            <span className="mr-2">
              <RiLogoutBoxRFill size={18} />
            </span>
            Sign Out
          </button>
        </nav>
      </aside>

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
          <h3 className="font-bold text-lg">Confirm Action</h3>
          <p className="py-4">Are you sure you want to log out?</p>
          <div className="flex justify-end content-end">
            <button className="btn btn-error text-white" onClick={logout}>Log Out</button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Sidebar;
