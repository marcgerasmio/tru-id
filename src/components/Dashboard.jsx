import Sidebar from "./Sidebar.jsx";
import { FaSignOutAlt, FaUsers } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient.jsx";


const Dashboard = () => {
  const [isAssign, setAssign] = useState(false);
  const [assign, reAssign] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState('');
  const [totalTenants, setTotalTenants] = useState('');
  const [pendingPayments, setPendingPayments] = useState('');
  const [totalSanctions, setTotalSanctions] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
    const { data } = await supabase
    .from('Employee')
    .select('*')

    setTotalEmployees(data.length);
    setEmployees(data);
  };

  const totalTenant = async () => {
    const { data } = await supabase
    .from('Tenant')
    .select('*')

    setTotalTenants(data.length)
  };

  const pendingPayment = async () => {
    const { data } = await supabase
    .from('Rent')
    .select('*')
    .eq('status', 'Pending')

    setPendingPayments(data.length)
  };

  const pendingSanction = async () => {
    const { data } = await supabase
    .from('Sanction')
    .select('*')
    .eq('status', 'Unresolved')
    setTotalSanctions(data.length)
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

  const filteredEmployees = employees.filter(employee =>
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
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h2 className="card-title text-sm flex items-center gap-2">
                  <FaUsers size={20} className="text-gray-400" />
                  Total Employees
                </h2>
                <p className="text-2xl font-bold">{totalEmployees}</p>
             
              </div>
            </div>
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h2 className="card-title text-sm flex items-center gap-2">
                  <FaUsers size={20} className="text-gray-400" />
                  Total Tenants
                </h2>
                <p className="text-2xl font-bold">{totalTenants}</p>
         
              </div>
            </div>
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h2 className="card-title text-sm flex items-center gap-2">
                  <MdPayment size={20} className="text-gray-400" />
                  Pending Payments
                </h2>
                <p className="text-2xl font-bold">{pendingPayments}</p>
            
              </div>
            </div>
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h2 className="card-title text-sm flex items-center gap-2">
                  <FaSignOutAlt size={20} className="text-gray-400" />
                  Active Sanctions
                </h2>
                <p className="text-2xl font-bold">{totalSanctions}</p>
         
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="card bg-base-100 border shadow-md mt-4">
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
                <table className="table w-full">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Current Assignment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.employee_name}</td>
                      <td>{employee.department_assigned} Section</td>
                      {employee.assign ? (
                        <td>
                          <button className="btn btn-error btn-sm text-white">
                            Re-Assign
                          </button>
                        </td>
                      ) : (
                        <td>
                          <button
                            className="btn btn-primary btn-sm text-white"
                            onClick={() => openModal(employee)}
                          >
                            Assign
                          </button>
                        </td>
                      )}
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
              <select className="select select-bordered w-full md:w-1/2"
              value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                <option disabled selected>
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
