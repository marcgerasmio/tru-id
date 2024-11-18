import Sidebar from "./Sidebar.jsx";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient.jsx";

const PaymentHistory = () => {
  const [isPaid, notPaid] = useState(true);
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  const fetchPayment = async () => {
    const { data } = await supabase
    .from('Rent')
    .select('*')
    .eq('status', 'Paid')
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


  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formattedDate;
  };


  const filteredPayments = payments.filter(payments =>
    payments.store_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchPayment();
   }, []);
 
  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        {/* Sidebar: only visible on larger screens */}
        <Sidebar className="hidden lg:block" />

        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="mt-6">
            <div className="card bg-base-100 border shadow-md mt-4">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="card-title text-xl md:text-2xl">
                      Payment History of All Tenants
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
                      Transaction history and details of all Tenants.
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
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Business Number</th>
                        <th>Store Name</th>
                        <th>Section</th>
                        <th>Payment Amount</th>
                        <th>For Month of</th>
                        <th>Date Paid</th>
                        <th>Payment Collector</th>
                      </tr>
                    </thead>
                    <tbody>
                    {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.business_number}</td>
                      <td>{payment.store_name}</td>
                      <td>{payment.department}</td>
                      <td>{payment.amount}</td>
                      <td>{payment.date}</td>
                      <td>{formatDate(payment.date_paid)}</td>
                      <td>{payment.employee_name}</td>
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

export default PaymentHistory;
