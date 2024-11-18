import Sidebar from "./Sidebar.jsx";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient.jsx";
import { useNavigate } from "react-router-dom";


const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchTenant = async () => {
    const { data } = await supabase
    .from('Tenant')
    .select('*')
    setTenants(data);
  };

  const add_rent = async () => {
    const date = `${selectedMonth} ${selectedYear}`;
    try {
      const { data, error } = await supabase
        .from('Rent')
        .insert([
          {
            business_number: selectedTenant.business_number,
            date,
            amount,
            status: 'Pending',
            department: selectedTenant.business_type,
            store_name: selectedTenant.store_name,
          },
        ]);
        alert("Successful");
        navigate("/unpaid");
    } catch (err) {
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };
  
  

  const myModal = (tenant) => {
    setSelectedTenant(tenant)
    const modal = document.getElementById("my_modal_1");
    if (modal) {
      modal.showModal();
    }
  };

  const openModal = (tenant) => {
    setSelectedTenant(tenant)
    const modal = document.getElementById("my_modal_3");
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("my_modal_3");
    if (modal) {
      modal.close();
    }
  };

  function extractDate(isoString) {
    const date = new Date(isoString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); 
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  const filteredTenant = tenants.filter(tenants =>
    tenants.tenant_name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  useEffect(() => {
    fetchTenant();
   }, []);
 
  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        {/* Sidebar: hidden on small screens */}
        <Sidebar className="hidden lg:block" />

        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="mt-6">
            <div className="card bg-base-100 border shadow-md mt-4">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="card-title text-xl md:text-2xl">
                      List of All Tenants
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
                      Tenant List and their Details, Add Rents and Sanctions.
                    </p>
                  </div>

                  {/* Search input: responsive width */}
                  <label className="input input-bordered flex items-center gap-2 w-full md:w-1/2 lg:w-1/3">
                    <input
                      type="text"
                      placeholder="Search Tenant Name..."
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

                {/* Table: scrollable on smaller screens */}
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Stall ID</th>
                        <th>Tenant Name</th>
                        <th>Store Name</th>
                        <th>Business Type</th>
                        <th>Business Number</th>
                        <th>Date Started</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {filteredTenant.map((tenant) => (
                    <tr key={tenant.id}>
                      <td>{tenant.id}</td>
                      <td>{tenant.tenant_name}</td>
                      <td>{tenant.store_name}</td>
                      <td>{tenant.business_type}</td>
                      <td>{tenant.business_number}</td>
                      <td>{extractDate(tenant.created_at)}</td>
                      <td className="flex gap-2">
                          <button
                            className="btn btn-primary btn-sm text-white"
                            onClick={() => myModal(tenant)}
                          >
                            Add Rent
                          </button>
                          <button
                            className="btn-error btn btn-sm text-white"
                            onClick={() => openModal(tenant)}
                          >
                            Remove
                          </button>
                        </td>
                    </tr>
                  ))}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <dialog id="my_modal_3" className="modal font-mono">
        <div className="modal-box max-w-xs sm:max-w-md lg:max-w-lg">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Confirm Action</h3>
          <p className="py-4">
            Are you sure you want to delete employee John Doe?
          </p>
          <div className="flex justify-end content-end">
            <button className="btn btn-error text-white" onClick={closeModal}>
              Delete
            </button>
          </div>
        </div>
      </dialog>

      {/* Add Rent & Sanctions Modal */}
      <dialog id="my_modal_1" className="modal font-mono">
        <div className="modal-box max-w-xs sm:max-w-md lg:max-w-lg">
          <h3 className="font-bold text-lg">Rent Payment</h3>
          <div className="modal-action">
            <div className="w-full">
            <label className="form-control mb-2">
              <div className="label">
                <span className="label-text">Rent Payment</span>
              </div>
              <div className="flex space-x-2">
                <select className="select select-bordered w-full"
                 value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                  <option disabled selected>
                    Select Month
                  </option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month, index) => (
                    <option key={month} value={month}>
                    {month}
                  </option>
                  ))}
                </select>
                <select className="select select-bordered w-full"
                value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                  <option disabled selected>
                    Select Year
                  </option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
              </div>
            </label>

              <label className="form-control">
                <div className="label">
                  <span className="label-text">Amount</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here..."
                  className="input input-bordered"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </label>
              <div className="flex justify-end mt-5 gap-2">
                <button className="btn btn-primary text-white" onClick={add_rent}>Submit</button>
                <button
                  className="btn btn-error text-white"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
          </div>
        </div>
        </div>
      </dialog>
    </>
  );
};

export default Tenants;
