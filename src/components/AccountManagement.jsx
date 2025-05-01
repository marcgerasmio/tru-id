import Sidebar from "./Sidebar.jsx";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient.jsx";

const AccountManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('employees'); // New state for active tab
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('Tenant')
        .select('*');
      
      if (error) {
        console.error("Error fetching tenants:", error);
        return;
      }
      
      setTenants(data || []);
    } catch (err) {
      console.error("Exception when fetching tenants:", err);
    }
  };

  const openModal = (item, type) => {
    setSelectedItem(item);
    setSelectedItemType(type);
    const modal = document.getElementById("my_modal_3");
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSelectedItemType(null);
    const modal = document.getElementById("my_modal_3");
    if (modal) {
      modal.close();
    }
  };

  const handleDelete = async () => {
    if (!selectedItem || !selectedItem.id) return;

    setIsDeleting(true);
    try {
      const tableName = selectedItemType === 'employee' ? 'Employee' : 'Tenant';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', selectedItem.id);

      if (error) {
        console.error(`Error deleting ${selectedItemType}:`, error);
        alert(`Failed to delete ${selectedItemType}. Please try again.`);
      } else {
        if (selectedItemType === 'employee') {
          setEmployees(employees.filter(emp => emp.id !== selectedItem.id));
        } else {
          setTenants(tenants.filter(tenant => tenant.id !== selectedItem.id));
        }
        closeModal();
      }
    } catch (err) {
      console.error(`Exception when deleting ${selectedItemType}:`, err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async (item, newStatus) => {
    setIsUpdating(true);
    try {
      const tableName = activeTab === 'employees' ? 'Employee' : 'Tenant';
      const { error } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .eq('id', item.id);

      if (error) {
        console.error(`Error updating ${activeTab} status:`, error);
        alert(`Failed to update status. Please try again.`);
      } else {
        if (activeTab === 'employees') {
          setEmployees(employees.map(emp => 
            emp.id === item.id ? { ...emp, status: newStatus } : emp
          ));
        } else {
          setTenants(tenants.map(tenant => 
            tenant.id === item.id ? { ...tenant, status: newStatus } : tenant
          ));
        }
      }
    } catch (err) {
      console.error(`Exception when updating ${activeTab} status:`, err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
    fetchTenants();
  }, []);

  const filteredEmployees = employees.filter(employee =>
    employee.employee_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTenants = tenants.filter(tenant =>
    tenant.tenant_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        <Sidebar className="hidden lg:block" />
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="mt-6">
            <div className="card bg-base-100 border shadow-md mt-4">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="card-title text-md md:text-2xl">
                      Account Management
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
                      Manage tenants and employees accounts here.
                    </p>
                  </div>

                  <label className="input input-bordered flex items-center gap-2 w-full md:w-1/2 lg:w-1/3">
                    <input
                      type="text"
                      placeholder="Search..."
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

                <div className="tabs">
  <button
    className={`tab px-4 py-2 rounded-lg ${
      activeTab === 'employees'
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 text-gray-700'
    }`}
    onClick={() => setActiveTab('employees')}
  >
    Employees
  </button>
  <button
    className={`tab px-4 py-2 rounded-lg ${
      activeTab === 'tenants'
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 text-gray-700'
    }`}
    onClick={() => setActiveTab('tenants')}
  >
    Tenants
  </button>
</div>

                <div className="overflow-x-auto mt-4 max-h-[calc(100vh-300px)]">
                  {activeTab === 'employees' && (
                    <table className="table w-full">
                      <thead className="sticky top-0 bg-base-100 z-10">
                        <tr>
                          <th>Employee ID</th>
                          <th>Employee Name</th>
                          <th>Current Assignment</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.map((employee) => (
                          <tr key={employee.id}>
                            <td>{employee.id_number}</td>
                            <td>{employee.employee_name}</td>
                            <td>{employee.department_assigned} Section</td>
                            <td>
                              <select
                                className="select select-bordered select-sm w-full max-w-xs"
                                value={employee.status}
                                onChange={(e) => handleStatusUpdate(employee, e.target.value)}
                                disabled={isUpdating}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>
                            <td>
                              <button
                                className="btn btn-error btn-sm text-white"
                                onClick={() => openModal(employee, 'employee')}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'tenants' && (
                    <table className="table w-full">
                      <thead className="sticky top-0 bg-base-100 z-10">
                        <tr>
                          <th>Tenant ID</th>
                          <th>Tenant Name</th>
                          <th>Business Type</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTenants.map((tenant) => (
                          <tr key={tenant.id}>
                            <td>{tenant.business_number}</td>
                            <td>{tenant.tenant_name}</td>
                            <td>{tenant.business_type}</td>
                            <td>
                              <select
                                className="select select-bordered select-sm w-full max-w-xs"
                                value={tenant.status}
                                onChange={(e) => handleStatusUpdate(tenant, e.target.value)}
                                disabled={isUpdating}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>
                            <td>
                              <button
                                className="btn btn-error btn-sm text-white"
                                onClick={() => openModal(tenant, 'tenant')}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
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
            Are you sure you want to delete?
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
              onClick={handleDelete}
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

export default AccountManagement;