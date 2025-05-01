import Sidebar from "./Sidebar.jsx";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient.jsx";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';


const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [amount, setAmount] = useState('');
  const [waterBill, setWaterBill] = useState('');
  const [electricalBill, setElectricalBill] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchTenant = async () => {
    const { data } = await supabase
    .from('Tenant')
    .select('*')
    setTenants(data);
  };

  const edit_rent = async () => {
    try {
      const { data, error } = await supabase
        .from('Tenant')
        .update({ rent: amount })
        .eq('id', selectedTenant.id);

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
    setAmount(tenant.rent || ''); // Set the current rent amount
    const modal = document.getElementById("my_modal_1");
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    setAmount(''); // Reset amount when closing modal
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

  const filteredTenant = tenants.filter(tenants =>
    tenants.tenant_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteTenant = async () => {
    if (!selectedTenant || !selectedTenant.id) return;
  
    try {
      const { error } = await supabase
        .from('Tenant')
        .delete()
        .eq('id', selectedTenant.id);
  
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
      const { data, error } = await supabase
        .from('Rent')
        .insert([
          {
            business_number: selectedTenant.business_number,
            date,
            total: totalAmount,
            water_bill: waterBill,
            rent: selectedTenant.rent,
            electric_bill: electricalBill,
            status: 'Pending',
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
    setWaterBill('');
    setElectricalBill('');
    const modal = document.getElementById("my_modal_2");
    if (modal) {
      modal.showModal();
    }
  };

  const closeAddRentModal = () => {
    setWaterBill('');
    setElectricalBill('');
    const modal = document.getElementById("my_modal_2");
    if (modal) {
      modal.close();
    }
  };

  const exportToExcel = () => {
    // Prepare the data for export
    const exportData = tenants.map(tenant => ({
      'Business Number': tenant.business_number,
      'Tenant Name': tenant.tenant_name,
      'Store Name': tenant.store_name,
      'Business Type': tenant.business_type,
      'Date Started': extractDate(tenant.created_at),
      'Monthly Rent': tenant.rent,
      'Status': tenant.status
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const wscols = [
      {wch: 15}, // Business Number
      {wch: 25}, // Tenant Name
      {wch: 25}, // Store Name
      {wch: 20}, // Business Type
      {wch: 15}, // Date Started
      {wch: 15}, // Monthly Rent
      {wch: 15}  // Status
    ];
    ws['!cols'] = wscols;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Tenants");

    // Generate the Excel file
    const fileName = `Tenants_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

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
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                  <div>
                    <h2 className="card-title text-xl md:text-2xl">
                      List of All Tenants
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
                      Tenant List and their Details, Add Rents and Sanctions.
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="input input-bordered flex items-center gap-2 w-full md:w-64">
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
                    <button
                      className="btn btn-success btn-sm text-white"
                      onClick={exportToExcel}
                    >
                      Export to Excel
                    </button>
                  </div>
                </div>

                {/* Table: scrollable on smaller screens */}
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Business Number</th>
                        <th>Tenant Name</th>
                        <th>Store Name</th>
                        <th>Business Type</th>
                        <th>Date Started</th>
                        <th>Monthly Rent</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {filteredTenant.map((tenant) => (
                    <tr key={tenant.id}>
                      <td>{tenant.business_number}</td>
                      <td>{tenant.tenant_name}</td>
                      <td>{tenant.store_name}</td>
                      <td>{tenant.business_type}</td>
                      <td>{extractDate(tenant.created_at)}</td>
                      <td>{tenant.rent}</td>
                      <td className="flex gap-2">
                          <button
                            className="btn btn-primary btn-sm text-white"
                            onClick={() => myModal(tenant)}
                          >
                            Edit Rent
                          </button>
                          <button
                            className="btn btn-secondary btn-sm text-white"
                            onClick={() => openAddRentModal(tenant)}
                          >
                            Add Bill
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
            Are you sure you want to delete tenant{" "}
            <span className="font-bold">{selectedTenant?.tenant_name}</span>?
          </p>
          <div className="flex justify-end content-end">
          <button className="btn btn-error text-white" onClick={deleteTenant}>
  Delete
</button>
          </div>
        </div>
      </dialog>

      {/* Edit Rent Modal */}
      <dialog id="my_modal_1" className="modal font-mono">
        <div className="modal-box max-w-xs sm:max-w-md lg:max-w-lg">
          <h3 className="font-bold text-lg">Edit Rent Payment</h3>
          <div className="modal-action">
            <div className="w-full">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Current Monthly Rent: {selectedTenant?.rent}</span>
                </div>
                <div className="label">
                  <span className="label-text">New Monthly Rent Amount</span>
                </div>
                <input
                  type="number"
                  placeholder="Enter new rent amount..."
                  className="input input-bordered"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </label>
              <div className="flex justify-end mt-5 gap-2">
                <button className="btn btn-primary text-white" onClick={edit_rent}>Update Rent</button>
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
        <div className="modal-box max-w-xs sm:max-w-md lg:max-w-lg">
          <h3 className="font-bold text-lg">Bill Details</h3>
          <div className="modal-action">
            <div className="w-full">
              <label className="form-control mb-2">
                <div className="label">
                  <span className="label-text">Rent For:</span>
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
                    ].map((month) => (
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

              <div className="space-y-4">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Monthly Rent: {selectedTenant?.rent}</span>
                  </div>
                </label>

                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Water Bill</span>
                  </div>
                  <input
                    type="number"
                    placeholder="Enter water bill amount..."
                    className="input input-bordered"
                    value={waterBill}
                    onChange={(e) => setWaterBill(e.target.value)}
                  />
                </label>

                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Electrical Bill</span>
                  </div>
                  <input
                    type="number"
                    placeholder="Enter electrical bill amount..."
                    className="input input-bordered"
                    value={electricalBill}
                    onChange={(e) => setElectricalBill(e.target.value)}
                  />
                </label>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="label">
                    <span className="label-text font-bold">Total Amount: {totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-5 gap-2">
                <button className="btn btn-primary text-white" onClick={add_rent}>Submit</button>
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
