import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { account } from '../appwrite/AppwriteConfig.js';


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState ({
    email: "",
    password: ""
  })

  const loginUser = async (e) => {
    e.preventDefault();
    try{
      await account.createEmailPasswordSession(user.email, user.password)
      navigate("/home")
    }catch (error) {
      console.error(error);
    }
    console.log("User Login".loginUser)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center h-screen font-sans bg-gray-50">
      <div className="flex flex-col items-center w-1/2 p-8 border-r border-gray-200">
        <img src="/logo/Coffeebyte_logoportrait.png" className="mx-auto" style={{ width: '20rem' }} />
      </div>
      
      <div className="flex flex-col text-left items-center w-1/2 p-8">
          <h2 className="text-3xl font-semibold text-custom-green mb-2">Welcome!</h2>
          <p className="text-black mb-6">Scan smarter, farm better</p>

        <form className="w-full max-w-sm space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-green"
              onChange={(e) =>
                setUser({
                  ...user,
                  email: e.target.value
                })
              }
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              className="w-full px-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-green"
              onChange={(e) =>
                setUser({
                  ...user,
                  password: e.target.value
                })
              }
            />
            <span 
              onClick={togglePasswordVisibility} 
              style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '50%', color: 'gray', transform: 'translateY(-50%)' }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <a href="#" className="text-sm text-custom-green hover:underline text-right block pb-5">
            Forgot Password?
          </a>

          <button 
            type="submit" 
            className="w-full bg-custom-green text-white py-2 rounded hover:bg-green-800 transition-colors duration-200"
            onClick={loginUser}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
