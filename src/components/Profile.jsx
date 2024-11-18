import Sidebar from "./Sidebar.jsx";

const Profile = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="card shadow-md border mb-10">
            <div className="card-body">
              <p>profile</p>
            </div>
          </div>

          <div className="card shadow-md border mb-10">
            <div className="card-body">
              <p>personal information</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;
