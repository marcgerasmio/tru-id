import Sidebar from "./Sidebar.jsx";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient.jsx";

const Sanction = () => {
  const [sanctions, setSanctions] = useState([]);
  const [tenant, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(""); 
  const [businessNumber, setBusinessNumber] = useState(""); 
  const [complain, setComplain] = useState("");
  const [sanction, setSanction] = useState("");
  const [clearance, setClearance] = useState("");
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSanctions = async () => {
    const { data } = await supabase
      .from("Sanction")
      .select("*")
      .eq("status", "Unresolved");
    setSanctions(data);
  };

  const fetchTenants = async () => {
    const { data } = await supabase
      .from("Tenant")
      .select("store_name, business_number");
    setTenants(data);
  };

  const handleTenantChange = (e) => {
    const storeName = e.target.value;
    setSelectedTenant(storeName);
    const tenantData = tenant.find((t) => t.store_name === storeName);
    setBusinessNumber(tenantData?.business_number || "");
  };

  const openModal = () => {
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

  const add_sanction = async () => {
    try {
      const { data, error } = await supabase
        .from('Sanction')
        .insert([
          {
          store_name : selectedTenant,
          business_number: businessNumber,
          complain,
          sanction,
          clearance,
          status : 'Unresolved'
          },
        ]);
      closeModal();
      fetchSanctions();
    } catch (err) {
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };

  const filteredSanction = sanctions.filter(sanctions =>
    sanctions.store_name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  useEffect(() => {
    fetchSanctions();
    fetchTenants();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        {/* Sidebar */}
        <Sidebar className="hidden lg:block" />

        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="mt-6">
            <div className="card bg-base-100 border shadow-md mt-4">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="card-title text-xl md:text-2xl">
                      List of Sanctions for All Tenants
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
                      Penalties and Complaints from these List of Tenants.
                    </p>
                  </div>

                  {/* Search Input */}
                  <label className="input input-bordered flex items-center gap-2 w-full md:w-1/2 lg:w-1/3">
                    <input
                      type="text"
                      placeholder="Search Store Name..."
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
                  <button
                    onClick={openModal}
                    className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                  >
                    Add Sanction
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Business Number</th>
                        <th>Store Name</th>
                        <th>Complain</th>
                        <th>Sanction</th>
                        <th>Clearance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSanction.map((sanction) => (
                        <tr key={sanction.id}>
                          <td>{sanction.business_number}</td>
                          <td>{sanction.store_name}</td>
                          <td>{sanction.complain}</td>
                          <td>{sanction.sanction}</td>
                          <td>{sanction.clearance}</td>
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

      {/* Modal */}
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
          <h3 className="font-bold text-lg">Add Sanction</h3>
          <div className="py-4">
            <label htmlFor="tenant-dropdown" className="block font-medium">
              Store Name:
            </label>
            <select
              id="tenant-dropdown"
              className="select select-bordered w-full"
              value={selectedTenant}
              onChange={handleTenantChange}
            >
              <option value="">-- Select Store Name --</option>
              {tenant.map((t) => (
                <option key={t.business_number} value={t.store_name}>
                  {t.store_name}
                </option>
              ))}
            </select>
            <label htmlFor="amount-input" className="block font-medium mt-4">
              Complain:
            </label>
            <input
              type="text"
              id="amount-input"
              className="input input-bordered w-full"
              onChange={(e) => setComplain(e.target.value)}
            />
             <label htmlFor="amount-input" className="block font-medium mt-4">
              Sanction:
            </label>
            <input
              type="text"
              id="amount-input"
              className="input input-bordered w-full"
              onChange={(e) => setSanction(e.target.value)}
            />
             <label htmlFor="amount-input" className="block font-medium mt-4">
              Clearance:
            </label>
            <input
              type="text"
              id="amount-input"
              className="input input-bordered w-full"
              onChange={(e) => setClearance(e.target.value)}
            />
          </div>
          <div className="flex justify-end content-end">
            <button className="btn btn-primary text-white" onClick={add_sanction}>
              Save
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Sanction;
