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
  const [searchQuery, setSearchQuery] = useState("");

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

  const addSanction = async () => {
    try {
      const { data, error } = await supabase.from("Sanction").insert([
        {
          store_name: selectedTenant,
          business_number: businessNumber,
          complain,
          sanction,
          clearance,
          status: "Unresolved",
        },
      ]);
      closeModal();
      fetchSanctions();
    } catch (err) {
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };

  const filteredSanction = sanctions.filter((sanction) =>
    sanction.store_name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <main className="flex-1 p-5 lg:p-5 ml-0 lg:ml-64 transition-all duration-300 text-gray-800">
          <div className="card bg-white border shadow-md rounded-lg">
            <div className="card-body">
              <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Sanctions for Tenants
                  </h2>
                  <p className="text-gray-500 text-sm">
                    View and manage penalties for tenants.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <label className="input input-bordered flex items-center gap-2 w-full">
                    <input
                      type="text"
                      placeholder="Search Store Name..."
                      className="w-full"
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
                    className="btn btn-info text-white font-bold rounded-lg shadow-md transition duration-200"
                  >
                    <span className="text-lg mb-1">+</span>Add Sanction
                  </button>
                </div>
              </div>

              {/* Sanction Table */}
              <div className="overflow-x-auto rounded-lg">
                <table className="table w-full text-sm text-gray-700">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-3">Business Number</th>
                      <th className="px-4 py-3">Store Name</th>
                      <th className="px-4 py-3">Complain</th>
                      <th className="px-4 py-3">Sanction</th>
                      <th className="px-4 py-3">Clearance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSanction.map((sanction) => (
                      <tr
                        key={sanction.id}
                        className="hover:bg-gray-50 border-t transition-colors duration-200"
                      >
                        <td className="px-4 py-3">
                          {sanction.business_number}
                        </td>
                        <td className="px-4 py-3">{sanction.store_name}</td>
                        <td className="px-4 py-3">{sanction.complain}</td>
                        <td className="px-4 py-3">{sanction.sanction}</td>
                        <td className="px-4 py-3">{sanction.clearance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Sanction Modal */}
      <dialog id="my_modal_3" className="modal font-sans">
        <div className="modal-box max-w-lg">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-semibold text-lg mb-4">Add Sanction</h3>
          <div className="py-4 space-y-4">
            <div>
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
            </div>
            <div>
              <label htmlFor="complain-input" className="block font-medium">
                Complain:
              </label>
              <input
                type="text"
                id="complain-input"
                className="input input-bordered w-full"
                value={complain}
                onChange={(e) => setComplain(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sanction-input" className="block font-medium">
                Sanction:
              </label>
              <input
                type="text"
                id="sanction-input"
                className="input input-bordered w-full"
                value={sanction}
                onChange={(e) => setSanction(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="clearance-input" className="block font-medium">
                Clearance:
              </label>
              <input
                type="text"
                id="clearance-input"
                className="input input-bordered w-full"
                value={clearance}
                onChange={(e) => setClearance(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="btn btn-primary text-white"
              onClick={addSanction}
            >
              Save Sanction
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Sanction;
