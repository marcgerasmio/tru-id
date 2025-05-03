import Sidebar from "./Sidebar.jsx";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient.jsx";
import * as XLSX from "xlsx";
import { RiFileExcel2Fill } from "react-icons/ri";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEmployee = async () => {
    try {
      const { data, error } = await supabase.from("Employee").select("*");

      if (error) {
        console.error("Error fetching employees:", error);
        return;
      }

      setEmployees(data || []);
    } catch (err) {
      console.error("Exception when fetching employees:", err);
    }
  };

  const deleteEmployee = async () => {
    if (!selectedEmployee || !selectedEmployee.id) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("Employee")
        .delete()
        .eq("id", selectedEmployee.id);

      if (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee. Please try again.");
      } else {
        // Remove the deleted employee from the local state
        setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));
        closeModal();
      }
    } catch (err) {
      console.error("Exception when deleting employee:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openModal = (employee) => {
    setSelectedEmployee(employee);
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

  useEffect(() => {
    fetchEmployee();
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    employee.employee_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToExcel = () => {
    // Prepare the data for export
    const exportData = employees.map((employee) => ({
      "Employee ID": employee.id_number,
      "Employee Name": employee.employee_name,
      "Current Assignment": `${employee.department_assigned} Section`,
      Status: employee.status,
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const wscols = [
      { wch: 15 }, // Employee ID
      { wch: 25 }, // Employee Name
      { wch: 25 }, // Current Assignment
      { wch: 15 }, // Status
    ];
    ws["!cols"] = wscols;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Employees");

    // Generate the Excel file
    const fileName = `Employees_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

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
                      Employee Directory
                    </h2>
                    <p className="text-sm text-gray-500">
                      Manage and export employee data.
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Search Employee Name..."
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
                        <th className="py-3 px-6 text-left">Employee ID</th>
                        <th className="py-3 px-6 text-left">Employee Name</th>
                        <th className="py-3 px-6 text-left">
                          Current Assignment
                        </th>
                        <th className="py-3 px-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 divide-y divide-gray-200">
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="py-3 px-6">{employee.id_number}</td>
                          <td className="py-3 px-6">
                            {employee.employee_name}
                          </td>
                          <td className="py-3 px-6">
                            {employee.department_assigned} Section
                          </td>
                          <td className="py-3 px-6 text-center">
                            <button
                              className="btn btn-sm btn-error text-white"
                              onClick={() => openModal(employee)}
                            >
                              Delete
                            </button>
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

      <dialog id="my_modal_3" className="modal font-mono">
        <div className="modal-box rounded-lg shadow-lg bg-white">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="text-lg font-semibold text-red-600">
            Confirm Deletion
          </h3>
          <p className="py-4 text-gray-700">
            Are you sure you want to delete{" "}
            <strong>{selectedEmployee.employee_name}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="btn btn-error text-white"
              onClick={deleteEmployee}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Employees;
