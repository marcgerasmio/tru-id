import Sidebar from "./Sidebar.jsx";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient.jsx";

const Unpaid = () => {
  const [isPaid, notPaid] = useState(true);
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPayment = async () => {
    const { data } = await supabase
      .from("Rent")
      .select("*")
      .eq("status", "Pending");
    setPayments(data);
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

  const filteredPayments = payments.filter((payments) =>
    payments.store_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchPayment();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        <Sidebar className="hidden lg:block" />
        <main className="flex-1 p-5 lg:p-5 ml-0 lg:ml-64 transition-all duration-300 text-gray-800">
          <div>
            <div className="card bg-white border shadow-md">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="card-title text-xl md:text-2xl">
                      Overdue Payments
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
                      Unsettled rent payments of tenants.
                    </p>
                  </div>

                  {/* Responsive Search Input */}
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
                </div>

                {/* Table: scrollable on smaller screens */}
                <div className="overflow-x-auto rounded-lg">
                  <table className="table w-full text-sm text-gray-700">
                    <thead className="bg-gray-100 text-gray-600">
                      <tr>
                        <th className="px-4 py-3 text-left">Business Number</th>
                        <th className="px-4 py-3 text-left">Store Name</th>
                        <th className="px-4 py-3 text-left">Section</th>
                        <th className="px-4 py-3 text-left">Water Bill</th>
                        <th className="px-4 py-3 text-left">Electric Bill</th>
                        <th className="px-4 py-3 text-left">Stall Rent</th>
                        <th className="px-4 py-3 text-left">Total Bill</th>
                        <th className="px-4 py-3 text-left">For Month of</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="hover:bg-gray-50 border-t"
                        >
                          <td className="px-4 py-3">
                            {payment.business_number}
                          </td>
                          <td className="px-4 py-3">{payment.store_name}</td>
                          <td className="px-4 py-3">{payment.department}</td>
                          <td className="px-4 py-3">{payment.water_bill}</td>
                          <td className="px-4 py-3">{payment.electric_bill}</td>
                          <td className="px-4 py-3">{payment.rent}</td>
                          <td className="px-4 py-3">{payment.total}</td>
                          <td className="px-4 py-3">{payment.date}</td>
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
    </>
  );
};

export default Unpaid;
