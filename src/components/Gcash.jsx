import Sidebar from "./Sidebar.jsx";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient.jsx";
import { RiFileExcel2Fill } from "react-icons/ri";
import * as XLSX from "xlsx";

const Gcash = () => {
  const [gcashAccounts, setGcashAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editNumber, setEditNumber] = useState("");

  const fetchGcashAccounts = async () => {
    const { data } = await supabase.from("Gcash").select("*");
    setGcashAccounts(data);
  };

  const openEditModal = (account) => {
    setSelectedAccount(account);
    setEditName(account.name);
    setEditNumber(account.number);
    setIsEditing(true);
    const modal = document.getElementById("edit_modal");
    if (modal) {
      modal.showModal();
    }
  };

  const closeEditModal = () => {
    setSelectedAccount(null);
    setEditName("");
    setEditNumber("");
    setIsEditing(false);
    const modal = document.getElementById("edit_modal");
    if (modal) {
      modal.close();
    }
  };

  const handleEdit = async () => {
    if (!selectedAccount) return;

    try {
      const { error } = await supabase
        .from("Gcash")
        .update({ name: editName, number: editNumber })
        .eq("id", selectedAccount.id);

      if (error) {
        console.error("Error updating GCash account:", error);
        alert("Failed to update GCash account. Please try again.");
      } else {
        alert("GCash account updated successfully");
        fetchGcashAccounts();
        closeEditModal();
      }
    } catch (err) {
      console.error("Exception when updating GCash account:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleDelete = async (account) => {
    if (!confirm("Are you sure you want to delete this GCash account?")) return;

    try {
      const { error } = await supabase
        .from("Gcash")
        .delete()
        .eq("id", account.id);

      if (error) {
        console.error("Error deleting GCash account:", error);
        alert("Failed to delete GCash account. Please try again.");
      } else {
        alert("GCash account deleted successfully");
        fetchGcashAccounts();
      }
    } catch (err) {
      console.error("Exception when deleting GCash account:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const exportToExcel = () => {
    const exportData = gcashAccounts.map((account) => ({
      Name: account.name,
      "GCash Number": account.number,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    const wscols = [
      { wch: 30 }, // Name
      { wch: 20 }, // GCash Number
    ];
    ws["!cols"] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "GCash Accounts");

    const fileName = `GCash_Accounts_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const filteredAccounts = gcashAccounts.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchGcashAccounts();
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
                      GCash Accounts
                    </h2>
                    <p className="text-sm text-gray-500">
                      Manage GCash accounts for payments.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm bg-white">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
                      <tr>
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-left">GCash Number</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 divide-y divide-gray-200">
                      {filteredAccounts.map((account) => (
                        <tr key={account.id} className="hover:bg-gray-50">
                          <td className="py-3 px-6">{account.name}</td>
                          <td className="py-3 px-6">{account.number}</td>
                          <td className="py-3 px-6 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                className="btn btn-info btn-outline hover:text-white btn-sm"
                                onClick={() => openEditModal(account)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-error btn-sm text-white"
                                onClick={() => handleDelete(account)}
                              >
                                Delete
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

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal font-mono">
        <div className="modal-box max-w-xs sm:max-w-md lg:max-w-lg bg-white shadow-lg rounded-lg">
          <h3 className="font-bold text-lg text-gray-800">Edit GCash Account</h3>
          <div className="modal-action">
            <div className="w-full">
              <label className="form-control mb-4">
                <div className="label">
                  <span className="label-text text-gray-600">Name</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter name..."
                  className="input input-bordered w-full"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </label>
              <label className="form-control mb-4">
                <div className="label">
                  <span className="label-text text-gray-600">GCash Number</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter GCash number..."
                  className="input input-bordered w-full"
                  value={editNumber}
                  onChange={(e) => setEditNumber(e.target.value)}
                />
              </label>
              <div className="flex justify-end mt-5 gap-2">
                <button
                  className="btn btn-primary text-white"
                  onClick={handleEdit}
                >
                  Update
                </button>
                <button
                  className="btn btn-error text-white"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Gcash;