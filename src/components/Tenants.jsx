import Sidebar from "./Sidebar.jsx";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient.jsx";
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Fill } from "react-icons/ri";
import * as XLSX from "xlsx";

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [amount, setAmount] = useState("");
  const [waterBill, setWaterBill] = useState("");
  const [electricalBill, setElectricalBill] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchTenant = async () => {
    const { data } = await supabase.from("Tenant").select("*");
    setTenants(data);
  };

  const edit_rent = async () => {
    try {
      const { data, error } = await supabase
        .from("Tenant")
        .update({ rent: amount })
        .eq("id", selectedTenant.id);

      if (error) {
        console.error("Error updating rent:", error);
        alert("Failed to update rent. Please try again.");
      } else {
        alert("Rent updated successfully");
        fetchTenant();
        closeModal();
      }
    } catch (err) {
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };

  const myModal = (tenant) => {
    setSelectedTenant(tenant);
    setAmount(tenant.rent || ""); // Set the current rent amount
    const modal = document.getElementById("my_modal_1");
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    setAmount(""); // Reset amount when closing modal
    const modal = document.getElementById("my_modal_1");
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

  const filteredTenant = tenants.filter((tenants) =>
    tenants.tenant_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteTenant = async () => {
    if (!selectedTenant || !selectedTenant.id) return;

    try {
      const { error } = await supabase
        .from("Tenant")
        .delete()
        .eq("id", selectedTenant.id);

      if (error) throw error;

      // Refresh tenant list after deletion
      fetchTenant();
      closeModal();
      alert("Tenant successfully deleted.");
    } catch (err) {
      alert(`Failed to delete tenant: ${err.message}`);
    }
  };

  const calculateTotal = () => {
    const water = parseFloat(waterBill) || 0;
    const electrical = parseFloat(electricalBill) || 0;
    const rent = parseFloat(selectedTenant?.rent) || 0;
    const total = water + electrical + rent;
    setTotalAmount(total);
  };

  useEffect(() => {
    calculateTotal();
  }, [waterBill, electricalBill, selectedTenant]);

  const add_rent = async () => {
    const date = `${selectedMonth} ${selectedYear}`;
    try {
      const { data, error } = await supabase.from("Rent").insert([
        {
          business_number: selectedTenant.business_number,
          date,
          total: totalAmount,
          water_bill: waterBill,
          rent: selectedTenant.rent,
          electric_bill: electricalBill,
          status: "Pending",
          department: selectedTenant.business_type,
          store_name: selectedTenant.store_name,
        },
      ]);
      if (error) {
        console.error("Error adding rent:", error);
        alert("Failed to add rent. Please try again.");
      } else {
        alert("Rent added successfully");
        navigate("/unpaid");
      }
    } catch (err) {
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };

  const openAddRentModal = (tenant) => {
    setSelectedTenant(tenant);
    setWaterBill("");
    setElectricalBill("");
    const modal = document.getElementById("my_modal_2");
    if (modal) {
      modal.showModal();
    }
  };

  const closeAddRentModal = () => {
    setWaterBill("");
    setElectricalBill("");
    const modal = document.getElementById("my_modal_2");
    if (modal) {
      modal.close();
    }
  };

  const exportToExcel = () => {
    // Prepare the data for export
    const exportData = tenants.map((tenant) => ({
      "Business Number": tenant.business_number,
      "Tenant Name": tenant.tenant_name,
      "Store Name": tenant.store_name,
      "Business Type": tenant.business_type,
      "Date Started": extractDate(tenant.created_at),
      "Monthly Rent": tenant.rent,
      Status: tenant.status,
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const wscols = [
      { wch: 15 }, // Business Number
      { wch: 25 }, // Tenant Name
      { wch: 25 }, // Store Name
      { wch: 20 }, // Business Type
      { wch: 15 }, // Date Started
      { wch: 15 }, // Monthly Rent
      { wch: 15 }, // Status
    ];
    ws["!cols"] = wscols;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Tenants");

    // Generate the Excel file
    const fileName = `Tenants_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  useEffect(() => {
    fetchTenant();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        <Sidebar className="hidden lg:block" />
        <main className="flex-1 p-5 lg:p-5 ml-0 lg:ml-64 transition-all duration-300 text-gray-800">
          <div>
            <div className="card bg-white border shadow-md rounded-lg">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Tenant Directory
                    </h2>
                    <p className="text-sm text-gray-500">
                      Manage tenant details and monthly bills.
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Search Tenant Name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input input-bordered w-60"
                    />
                    <button
                      className="btn btn-success text-white"
                      onClick={exportToExcel}
                    >
                      <RiFileExcel2Fill />
                      Export to Excel
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm bg-white">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
                      <tr>
                        <th className="py-3 px-6 text-left">Business No.</th>
                        <th className="py-3 px-6 text-left">Tenant Name</th>
                        <th className="py-3 px-6 text-left">Store Name</th>
                        <th className="py-3 px-6 text-left">Type</th>
                        <th className="py-3 px-6 text-left">Start Date</th>
                        <th className="py-3 px-6 text-left">Rent</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 divide-y divide-gray-200">
                      {filteredTenant.map((tenant) => (
                        <tr key={tenant.id} className="hover:bg-gray-50">
                          <td className="py-3 px-6">
                            {tenant.business_number}
                          </td>
                          <td className="py-3 px-6">{tenant.tenant_name}</td>
                          <td className="py-3 px-6">{tenant.store_name}</td>
                          <td className="py-3 px-6">{tenant.business_type}</td>
                          <td className="py-3 px-6">
                            {extractDate(tenant.created_at)}
                          </td>
                          <td className="py-3 px-6">{tenant.rent}</td>
                          <td className="py-3 px-6 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                className="btn btn-info btn-outline hover:text-white btn-sm"
                                onClick={() => myModal(tenant)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-info btn-sm text-white"
                                onClick={() => openAddRentModal(tenant)}
                              >
                                Add
                              </button>
                            </div>
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

      {/* Delete Confirmation Modal */}
      <dialog id="my_modal_3" className="modal font-mono">
        <div className="modal-box max-w-xs sm:max-w-md lg:max-w-lg bg-white shadow-lg rounded-lg">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-gray-800">Confirm Action</h3>
          <p className="py-4 text-gray-600">
            Are you sure you want to delete tenant{" "}
            <span className="font-semibold">{selectedTenant?.tenant_name}</span>
            ?
          </p>
          <div className="flex justify-end space-x-2">
            <button className="btn btn-error text-white" onClick={deleteTenant}>
              Delete
            </button>
            <button
              className="btn btn-outline text-gray-700"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {/* Edit Rent Modal */}
      <dialog id="my_modal_1" className="modal font-mono">
        <div className="modal-box max-w-xs sm:max-w-md lg:max-w-lg bg-white shadow-lg rounded-lg">
          <h3 className="font-bold text-lg text-gray-800">Edit Rent Payment</h3>
          <div className="modal-action">
            <div className="w-full">
              <label className="form-control">
                <div className="label">
                  <span className="label-text text-gray-600">
                    Current Monthly Rent: {selectedTenant?.rent}
                  </span>
                </div>
                <div className="label">
                  <span className="label-text text-gray-600">
                    New Monthly Rent Amount
                  </span>
                </div>
                <input
                  type="number"
                  placeholder="Enter new rent amount..."
                  className="input input-bordered w-full"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </label>
              <div className="flex justify-end mt-5 gap-2">
                <button
                  className="btn btn-primary text-white"
                  onClick={edit_rent}
                >
                  Update Rent
                </button>
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

      {/* Add Rent Modal */}
      <dialog id="my_modal_2" className="modal font-mono">
        <div className="modal-box max-w-xs sm:max-w-md lg:max-w-lg bg-white shadow-lg rounded-lg">
          <h3 className="font-bold text-lg text-gray-800">Bill Details</h3>
          <div className="modal-action">
            <div className="w-full">
              <label className="form-control mb-2">
                <div className="label">
                  <span className="label-text text-gray-600">Rent For:</span>
                </div>
                <div className="flex space-x-2">
                  <select
                    className="select select-bordered w-full"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
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
                    ].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="select select-bordered w-full"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option disabled selected>
                      Select Year
                    </option>
                    {Array.from(
                      { length: 10 },
                      (_, i) => new Date().getFullYear() + i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <div className="space-y-4">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text text-gray-600">
                      Monthly Rent: {selectedTenant?.rent}
                    </span>
                  </div>
                </label>

                <label className="form-control">
                  <div className="label">
                    <span className="label-text text-gray-600">Water Bill</span>
                  </div>
                  <input
                    type="number"
                    placeholder="Enter water bill amount..."
                    className="input input-bordered w-full"
                    value={waterBill}
                    onChange={(e) => setWaterBill(e.target.value)}
                  />
                </label>

                <label className="form-control">
                  <div className="label">
                    <span className="label-text text-gray-600">
                      Electrical Bill
                    </span>
                  </div>
                  <input
                    type="number"
                    placeholder="Enter electrical bill amount..."
                    className="input input-bordered w-full"
                    value={electricalBill}
                    onChange={(e) => setElectricalBill(e.target.value)}
                  />
                </label>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="label">
                    <span className="label-text text-lg font-semibold text-gray-800">
                      Total Amount: {totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-5 gap-2">
                <button
                  className="btn btn-primary text-white"
                  onClick={add_rent}
                >
                  Submit
                </button>
                <button
                  className="btn btn-error text-white"
                  onClick={closeAddRentModal}
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
