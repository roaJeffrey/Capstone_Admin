import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { databases, account } from '../../appwrite/AppwriteConfig';
import { v4 as uuidv4 } from 'uuid';

function AddUserPage({ setIsAddUserOpen }) {
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    year: "",
    month: "",
    day: "",
  });

  const { register, formState: { errors }, handleSubmit } = useForm();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roleResponse = await databases.listDocuments(
          "673b418100295c788a93", // Database ID
          "673b41d00018b34a286f"  // Role Collection ID
        );
        console.log("Fetched roles:", roleResponse.documents);
        setRoles(roleResponse.documents);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  // Password Visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const signupUser = async () => {
    if (user.password.length < 8) {
      console.error("Password must be at least 8 characters long.");
      return;
    }
  
    const name = `${user.firstName} ${user.lastName}`;
    const birthDate = new Date(`${user.year}-${user.month}-${user.day}`).toISOString();
  
    try {
    // After creating the user account via Appwrite Auth:
    const newUser = await account.create(
      uuidv4(),  // Unique user ID for Auth
      user.email,
      user.password,
      name
    );
    console.log("User account created:", newUser.$id);

    // Step 2: Save additional user info in the User collection
    const userData = {
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      birthdate: birthDate,
      phonenumber: user.phoneNumber,
    };

    const userDocument = await databases.createDocument(
      "673b418100295c788a93", // Database ID
      "673b41c1003840fb1cd8", // User Collection ID
      newUser.$id,            // Use the Auth user ID as the Do cument ID
      userData                // Additional user data
    );
    console.log("User document created:", userDocument);

    // Step 3: Assign role to the user
    if (selectedRole) {
      await databases.createDocument(
        "673b418100295c788a93", // Database ID
        "673b41cc002db95aabfc", // User_Role Collection ID
        uuidv4(),
        {
          role: selectedRole, // Role assigned to the user
          user: [newUser.$id], // Pass the userId from Auth
          createdby: "674158f400086149a7e4", // Adjust as necessary (Admin User ID)
        }
      );
      console.log("User role assigned successfully.");
    }
  
      setIsAddUserOpen(false); // Close modal on success
    } catch (error) {
      console.error("Error during signup process:", error);
    }
  };

  const handleCancel = () => setIsAddUserOpen(false);

  const filteredRoles = roles.filter(role => role.$id !== '673ee7be0020a2298fd1');

   // Phone number validation regex
   const phoneRegex = /^(?:\+63|0)\s?9\d{2}\s?\d{3}\s?\d{4}$/;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Add New User</h2>
        <form className="space-y-4" onSubmit={handleSubmit(signupUser)}>
          {/* Full Name */}
          <div className="flex space-x-2">
            <input
              {...register("firstname", { required: "First name is required." })}
              placeholder="First Name"
              className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />
            <input
              {...register("lastname", { required: "Last name is required." })}
              placeholder="Last Name"
              className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />
          </div>
          {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname.message}</p>}
          {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}

          {/* Birthdate */}
          <div className="flex flex-col mb-4">
            <p className="text-left ml-2 mb-1 text-sm">Birthdate</p>
            <div className="flex space-x-2">
              <select
                {...register("month", { required: "Month is required." })}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
                value={user.month}
                onChange={(e) => setUser({ ...user, month: e.target.value })}
              >
                <option value="" disabled>Month</option>
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
              <select
                {...register("day", { required: "Day is required." })}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
                value={user.day}
                onChange={(e) => setUser({ ...user, day: e.target.value })}
              >
                <option value="" disabled>Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select
                {...register("year", { required: "Year is required." })}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
                value={user.year}
                onChange={(e) => setUser({ ...user, year: e.target.value })}
              >
                <option value="" disabled>Year</option>
                {Array.from({ length: 50 }, (_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                ))}
              </select>
            </div>
          </div>


          {/* Phone Number */}
          <input
            {...register("phonenumber", { required: "Phone number is required.", 
              pattern: {
                value: phoneRegex,
                message: "Please enter a valid phone number.",
              }
             })}
            placeholder="Phone Number"
            type="tel"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
            onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
          />

          {/* Email */}
          <input  
            {...register("email", { required: "Email is required." })}
            placeholder="Email"
            type="email"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              {...register("password", { required: "Password is required." })}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <span 
              onClick={togglePasswordVisibility} 
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Role Dropdown */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              {...register("role", { required: "Role is required." })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-custom-green"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="" disabled>Select Role</option>
                {filteredRoles.map(role => {
                  console.log("Rendering role:", role);
                  <option key={role.$id} value={role.$id}>
                    {role.rolename}
                </option>
                })}
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel} 
              className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserPage;
