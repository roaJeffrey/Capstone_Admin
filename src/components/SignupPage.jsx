import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { account, databases } from '../appwrite/AppwriteConfig.js';
import { v4 as uuidv4 } from 'uuid';

function SignUpForm() {
  const { register, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    year: "",
    month: "",
    day: ""
  });

  // Password Visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Signup function
  const signupUser = async (e) => {
    e.preventDefault();
  
    // Validate password length
    if (user.password.length < 8) {
      console.error("Password must be at least 8 characters long.");
      return;
    }
  
    const name = `${user.firstName} ${user.lastName}`;
  
    // Log the user input for debugging
    console.log('Year:', user.year, 'Month:', user.month, 'Day:', user.day);
  
    // Create birthDate using the user input
    const birthDate = new Date(`${user.year}-${user.month}-${user.day}`).toISOString();

    const promise = account.create(
      uuidv4(),
      user.email,
      user.password,
      name
    );
    
    promise.then(
      function(response) {
        console.log("User account created:", response);
    
        // Save additional User info in the User collection
        return databases.createDocument(
          '67270ce0001ca47b2525', // Database ID
          '67276b5a0021e50d2930', // Collection ID for User
          uuidv4(),
          {
            firstname: user.firstName,
            lastname: user.lastName,
            email: user.email,
            password: user.password,
            birthdate: birthDate,
            phonenumber: user.phoneNumber
          }
        );
      }
    ).then(
      function(userDocResponse) {
        console.log("Additional user info saved successfully:", userDocResponse);
        navigate("/"); 
      }
    ).catch(function(error) {
      console.error("Error during signup process:", error);
    });
  };


  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center max-w-md mx-auto text-center rounded-lg p-4 bg-white shadow-lg">
        <img src="/logo/Coffeebyte_logolandscape.png" alt="COFID Logo" className="mx-auto" style={{ width: '10rem' }} />
        <h1 className="text-2xl font-semibold text-custom-green mb-6">Create a new account</h1>
        
        <form className="space-y-3" onSubmit={signupUser}>

          {/* Full Name */}
          <div className="flex space-x-2">
            <input
              {...register("firstname", { required: true })}
              placeholder="First Name"
              className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />
            <input
              {...register("lastname", { required: true })}
              placeholder="Last Name"
              className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />
          </div>

          {/* Birthdate */}
          <div className="flex flex-col mb-4">
            <p className="text-left ml-2 mb-1 text-sm">Birthdate</p>
            <div className="flex space-x-2">
              <select
                {...register("month", { required: true })}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
                onChange={(e) => setUser({ ...user, month: e.target.value })}
              >
                <option value="" disabled selected>Month</option>
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
              <select
                {...register("day", { required: true })}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
                onChange={(e) => setUser({ ...user, day: e.target.value })}
              >
                <option value="" disabled selected>Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select
                {...register("year", { required: true })}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
                onChange={(e) => setUser({ ...user, year: e.target.value })}
              >
                <option value="" disabled selected>Year</option>
                {Array.from({ length: 50 }, (_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone Number */}
          <input
            {...register("phonenumber", { required: true })}
            placeholder="Phone Number"
            type="tel"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
            onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
          />

          {/* Email */}
          <input  
            {...register("email", { required: true })}
            placeholder="Email"
            type="email"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              {...register("password", { required: true })}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <span 
              onClick={togglePasswordVisibility} 
              style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full p-2 bg-custom-green text-white rounded-md hover:bg-green-700 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        {/* Login Redirect */}
        <p className="mt-4 text-gray-500">
          <Link to="/" className="text-custom-green">Already have an account? </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpForm;
