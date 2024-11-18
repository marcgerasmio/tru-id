import { useState } from "react";
import supabase from "./supabaseClient";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const openModal = () => {
    const modal = document.getElementById("error_modal");
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("error_modal");
    if (modal) {
      modal.close();
    }
  };

  const login = async () => {
    const { data } = await supabase
    .from('Admin')
    .select('*')
    .eq('email', email)
    .single();

    if (data && data.password === password && data.email === email) {
    navigate("/dashboard");
    }
    else {
     openModal();
    }
  };

  return (
    <>
      <div
        className="hero min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center w-full sm:w-3/4 md:w-2/3 lg:w-2/3 font-mono px-4">
          <div className="w-full sm:w-3/4 md:w-1/2 p-6 md:p-10 bg-base-200 rounded-lg">
            <h1 className="mb-5 text-5xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              Tru
              <span className="text-red-700">I</span>
              <span className="text-blue-900">D</span>
              <span className="text-sm">Admin</span>
            </h1>
            <p className="mb-4 text-sm sm:text-base md:text-sm font-bold text-gray-500">
              *Tenant Profile and QR Code Rent Payment System
            </p>
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input
                    type="text"
                    className="grow p-2"
                    placeholder="example@gmail.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
              </div>
              <div className="mb-6">
                <label className="input input-bordered flex items-center gap-2 w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a password"
                    className="grow p-2"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </div>

              <div className="flex items-center justify-between mb-4 text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={() => setShowPassword(!showPassword)}
                    className="mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Show Password
                </label>
              </div>
              <button
                onClick={login}
                className="w-full px-4 py-3 font-medium text-white bg-green-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
              >
                Sign In
              </button>
          </div>
        </div>
      </div>

      <dialog id="error_modal" className="modal">
        <div className="modal-box max-w-xs md:max-w-md">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Login Failed</h3>
          <p className="py-4">
            Please check your email and password and try again.
          </p>
        </div>
      </dialog>
    </>
  );
};

export default Login;
