import Sidebar from "./Sidebar.jsx";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient.jsx";
import * as XLSX from 'xlsx';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEmployee = async () => {
    try {
      const { data, error } = await supabase
        .from('Employee')
        .select('*');
      
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
        .from('Employee')
        .delete()
        .eq('id', selectedEmployee.id);
      
      if (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee. Please try again.");
      } else {
        // Remove the deleted employee from the local state
        setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
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

  const filteredEmployees = employees.filter(employee =>
    employee.employee_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToExcel = () => {
    // Prepare the data for export
    const exportData = employees.map(employee => ({
      'Employee ID': employee.id_number,
      'Employee Name': employee.employee_name,
      'Current Assignment': `${employee.department_assigned} Section`,
      'Status': employee.status
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const wscols = [
      {wch: 15}, // Employee ID
      {wch: 25}, // Employee Name
      {wch: 25}, // Current Assignment
      {wch: 15}  // Status
    ];
    ws['!cols'] = wscols;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Employees");

    // Generate the Excel file
    const fileName = `Employees_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        <Sidebar className="hidden lg:block" />
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="mt-6">
            <div className="card bg-base-100 border shadow-md mt-4">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                  <div>
                    <h2 className="card-title text-md md:text-2xl">
                      List of All Employees
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
                      Employee List and their Details.
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="input input-bordered flex items-center gap-2 w-full md:w-64">
                      <input
                        type="text"
                        placeholder="Search Employee Name..."
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

                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Current Assignment</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id}>
                          <td>{employee.id_number}</td>
                          <td>{employee.employee_name}</td>
                          <td>{employee.department_assigned} Section</td>
                          {employee.assign ? (
                            <td>
                              <button className="btn btn-error btn-sm text-white">
                                Delete
                              </button>
                            </td>
                          ) : (
                            <td>
                              <button
                                className="btn btn-primary btn-sm text-white"
                                onClick={() => openModal(employee)}
                              >
                                Delete
                              </button>
                            </td>
                          )}
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

      <dialog id="my_modal_3" className="modal">
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
            Are you sure you want to delete employee {selectedEmployee.employee_name}?
          </p>
          <div className="flex justify-end gap-2">
            <button 
              className="btn btn-outline" 
              onClick={closeModal}
            >
              Cancel
            </button>
            <button 
              className="btn btn-error text-white" 
              onClick={deleteEmployee}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Employees;