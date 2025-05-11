import Sidebar from "./Sidebar.jsx";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient.jsx";
import { RiFileExcel2Fill } from "react-icons/ri";

import * as XLSX from "xlsx";

const PaymentHistory = () => {
  const [isPaid, notPaid] = useState(true);
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchPayment = async () => {
    const { data } = await supabase
      .from("Rent")
      .select("*")
      .neq("status", "Pending");
    setPayments(data);
  };

  const openModal = (payment) => {
    setSelectedPayment(payment);
    const modal = document.getElementById("my_modal_3");
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    setSelectedPayment(null);
    const modal = document.getElementById("my_modal_3");
    if (modal) {
      modal.close();
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedPayment) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("Rent")
        .update({ status: "Paid" })
        .eq("id", selectedPayment.id);

      if (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status. Please try again.");
      } else {
        fetchPayment();
        closeModal();
      }
    } catch (err) {
      console.error("Exception when updating status:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  };

  const filteredPayments = payments.filter((payments) =>
    payments.store_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToExcel = () => {
    // Prepare the data for export
    const exportData = payments.map((payment) => ({
      "Business Number": payment.business_number,
      "Store Name": payment.store_name,
      Section: payment.department,
      "Payment Amount": payment.amount,
      "For Month of": payment.date,
      "Date Paid": formatDate(payment.date_paid),
      "Payment Collector": payment.employee_name,
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const wscols = [
      { wch: 15 }, // Business Number
      { wch: 25 }, // Store Name
      { wch: 20 }, // Section
      { wch: 15 }, // Payment Amount
      { wch: 15 }, // For Month of
      { wch: 15 }, // Date Paid
      { wch: 25 }, // Payment Collector
    ];
    ws["!cols"] = wscols;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Payment History");

    // Generate the Excel file
    const fileName = `Payment_History_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  useEffect(() => {
    fetchPayment();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        {/* Sidebar: only visible on larger screens */}
        <Sidebar className="hidden lg:block" />

        <main className="flex-1 p-5 lg:p-5 ml-0 lg:ml-64 transition-all duration-300 text-gray-800">
          <div>
            <div className="card bg-base-100 border shadow-md">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                  <div>
                    <h2 className="card-title text-xl md:text-2xl">
                      Payment History of All Tenants
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
                      Transaction history and details of all Tenants.
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="input input-bordered flex items-center gap-2 w-full md:w-64">
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
                      className="btn btn-success text-white"
                      onClick={exportToExcel}
                    >
                      <RiFileExcel2Fill />
                      Export to Excel
                    </button>
                  </div>
                </div>

                {/* Table: scrollable on smaller screens */}
                <div className="overflow-x-auto rounded-lg">
                  <table className="table w-full text-sm text-gray-700">
                    <thead className="bg-gray-100 text-gray-600">
                      <tr>
                        <th className="px-4 py-3 text-left">Business Number</th>
                        <th className="px-4 py-3 text-left">Store Name</th>
                        <th className="px-4 py-3 text-left">Section</th>
                        <th className="px-4 py-3 text-left">Payment Amount</th>
                        <th className="px-4 py-3 text-left">For Month of</th>
                        <th className="px-4 py-3 text-left">Date Paid</th>
                        <th className="px-4 py-3 text-left">
                          Payment Collector
                        </th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Payment Method</th>
                        <th className="px-4 py-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="hover:bg-gray-50 border-t transition-colors duration-200"
                        >
                          <td className="px-4 py-3">
                            {payment.business_number}
                          </td>
                          <td className="px-4 py-3">{payment.store_name}</td>
                          <td className="px-4 py-3">{payment.department}</td>
                          <td className="px-4 py-3">{payment.total}</td>
                          <td className="px-4 py-3">{payment.date}</td>
                          <td className="px-4 py-3">
                            {formatDate(payment.date_paid)}
                          </td>
                          <td className="px-4 py-3">{payment.employee_name}</td>
                          <td className="px-4 py-3">{payment.status}</td>
                          <td className="px-4 py-3">
                            {payment.payment_method}
                          </td>
                          <td className="px-4 py-3">
                            {payment.status === "On-Process" && (
                              <button
                                className="btn btn-primary btn-sm text-white"
                                onClick={() => openModal(payment)}
                              >
                                View
                              </button>
                            )}
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

      {/* Payment Details Modal */}
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
          <h3 className="font-bold text-lg">Payment Details</h3>
          {selectedPayment && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">Store Name:</p>
                  <p>{selectedPayment.store_name}</p>
                </div>
                <div>
                  <p className="font-semibold">Business Number:</p>
                  <p>{selectedPayment.business_number}</p>
                </div>
                <div>
                  <p className="font-semibold">Section:</p>
                  <p>{selectedPayment.department}</p>
                </div>
                <div>
                  <p className="font-semibold">Total Amount:</p>
                  <p>{selectedPayment.total}</p>
                </div>
                <div>
                  <p className="font-semibold">For Month of:</p>
                  <p>{selectedPayment.date}</p>
                </div>
                <div>
                  <p className="font-semibold">Payment Method:</p>
                  <p>{selectedPayment.payment_method}</p>
                </div>
              </div>

              {selectedPayment.proof && (
                <div className="mb-4">
                  <p className="font-semibold mb-2">Payment Proof:</p>
                  <img
                    src={selectedPayment.proof}
                    alt="Payment Proof"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )}

              {selectedPayment.status === "On-Process" && (
                <div className="flex justify-end gap-2">
                  <button
                    className="btn btn-primary text-white"
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Mark as Paid"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default PaymentHistory;
