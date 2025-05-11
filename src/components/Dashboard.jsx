import Sidebar from "./Sidebar.jsx";
import { FaSignOutAlt, FaUsers } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient.jsx";
import { PiWarningBold } from "react-icons/pi";

const Dashboard = () => {
  const [isAssign, setAssign] = useState(false);
  const [assign, reAssign] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState("");
  const [totalTenants, setTotalTenants] = useState("");
  const [pendingPayments, setPendingPayments] = useState("");
  const [totalSanctions, setTotalSanctions] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    const modal = document.getElementById("my_modal_3");
    if (modal) {
      modal.showModal();
    }
  };

  const handleClick = () => {
    setAssign(true);
    reAssign(true);
  };

  const totalEmployee = async () => {
    const { data } = await supabase.from("Employee").select("*");

    setTotalEmployees(data.length);
    setEmployees(data);
  };

  const totalTenant = async () => {
    const { data } = await supabase.from("Tenant").select("*");

    setTotalTenants(data.length);
  };

  const pendingPayment = async () => {
    const { data } = await supabase
      .from("Rent")
      .select("*")
      .eq("status", "Pending");

    setPendingPayments(data.length);
  };

  const pendingSanction = async () => {
    const { data } = await supabase
      .from("Sanction")
      .select("*")
      .eq("status", "Unresolved");
    setTotalSanctions(data.length);
  };

  const updateAssignment = async () => {
    try {
      const { data } = await supabase
        .from("Employee")
        .update([
          {
            department_assigned: selectedSection,
          },
        ])
        .eq("id", selectedEmployee.id);
      totalEmployee();
    } catch (error) {
      alert("Error Saving Data.");
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.employee_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    totalEmployee();
    totalTenant();
    pendingPayment();
    pendingSanction();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        <Sidebar className="hidden lg:block" />
        <main className="flex-1 p-6 md:p-6 lg:p-6 ml-0 lg:ml-64 transition-all duration-300 text-gray-800">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm text-gray-500 font-medium">
                    Total Employees
                  </h4>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {totalEmployees}
                  </p>
                </div>
                <FaUsers size={28} className="text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm text-gray-500 font-medium">
                    Total Tenants
                  </h4>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {totalTenants}
                  </p>
                </div>
                <FaUsers size={28} className="text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm text-gray-500 font-medium">
                    Pending Payments
                  </h4>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {pendingPayments}
                  </p>
                </div>
                <MdPayment size={28} className="text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm text-gray-500 font-medium">
                    Active Sanctions
                  </h4>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {totalSanctions}
                  </p>
                </div>
                <PiWarningBold size={28} className="text-red-500" />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="card bg-white border shadow-md mt-4">
              <div className="card-body">
                <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                  <div>
                    <h2 className="card-title text-2xl">Employee Management</h2>
                    <p className="text-gray-500 mb-4">
                      Manage your employees and their assignments.
                    </p>
                  </div>
                  <label className="input input-bordered flex items-center gap-2 w-full sm:w-1/3">
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="w-full grow"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </label>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border border-gray-200 rounded-lg overflow-hidden text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
                      <tr>
                        <th className="py-3 px-6 text-left">Employee Name</th>
                        <th className="py-3 px-6 text-left">
                          Current Assignment
                        </th>
                        <th className="py-3 px-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 divide-y divide-gray-200">
                      {filteredEmployees.map((employee) => (
                        <tr
                          key={employee.id}
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="py-3 px-6">
                            {employee.employee_name}
                          </td>
                          <td className="py-3 px-6">
                            {employee.department_assigned} Section
                          </td>
                          <td className="py-3 px-6 text-center">
                            <button
                              onClick={() => openModal(employee)}
                              className={`btn btn-sm text-white ${
                                employee.assign
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-blue-500 hover:bg-blue-600"
                              }`}
                            >
                              {employee.assign ? "Re-Assign" : "Assign"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <dialog id="my_modal_3" className="modal font-mono">
        <div className="modal-box max-w-xs sm:max-w-md lg:max-w-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
            <h3 className="font-bold text-lg mb-8">| Employee Assignment</h3>
            <div className="flex flex-col md:flex-row gap-3 mb-2">
              <label className="form-control w-full max-w-xs">
                <span className="label-text">Employee ID</span>
                <input
                  type="text"
                  placeholder={selectedEmployee.id_number}
                  className="input input-bordered w-full"
                  disabled
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <span className="label-text">Employee Name</span>
                <input
                  type="text"
                  placeholder={selectedEmployee.employee_name}
                  className="input input-bordered w-full"
                  disabled
                />
              </label>
            </div>
            <div className="flex flex-col md:flex-row mb-5">
              <label className="form-control w-full max-w-xs">
                <span className="label-text">Section Assigned</span>
                <input
                  type="text"
                  placeholder={selectedEmployee.department_assigned}
                  className="input input-bordered w-full"
                  disabled
                />
              </label>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <select
                className="select select-bordered w-full md:w-1/2"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option selected>
                  Dept./Section:
                </option>
                <option value="Meat">Meat</option>
                <option value="Fish">Fish</option>
                <option value="Fruit">Fruit</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Groceries">Groceries</option>
                <option value="Non Foods">Non Food</option>
              </select>
              <button
                className="btn btn-primary text-white w-full md:w-1/2"
                onClick={updateAssignment}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default Dashboard;
