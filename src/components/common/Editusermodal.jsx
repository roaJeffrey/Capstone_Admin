import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { functions } from "../../appwrite/AppwriteConfig";
import BgLoading from "./Bgloading";

function Editusermodal({ user, setIsEditUserOpen, fetchUserData }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    phonenumber: user.phonenumber,
    email: user.email,
    password: "",
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleSave = async () => {
    setLoading(true);

    try {
      const body = JSON.stringify({
        id: user.$id,
        firstname: editedUser.firstname,
        lastname: editedUser.lastname,
        email: editedUser.email,
        phone: editedUser.phonenumber,
        password: editedUser.password,
        route: "update"
      })

      await functions.createExecution("6762b098002ed7a9288d", body)

      fetchUserData();
      setIsEditUserOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.message || "An error occurred while updating user details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => setIsEditUserOpen(false);

  return (
    <div>
      <BgLoading loading={loading} />
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Edit User</h2>
          <form className="space-y-4" onSubmit={handleSubmit(handleSave)}>
            {/* Full Name */}
            <div className="flex space-x-2">
              <input
                type="text"
                {...register("firstname", {
                  required: "First name is required.",
                })}
                placeholder="First Name"
                defaultValue={editedUser.firstname}
                className="w-1/2 p-2 border rounded-md focus:outline-none"
                onChange={(e) =>
                  setEditedUser({ ...editedUser, firstname: e.target.value })
                }
              />
              <input
                type="text"
                {...register("lastname", {
                  required: "Last name is required.",
                })}
                placeholder="Last Name"
                defaultValue={editedUser.lastname}
                className="w-1/2 p-2 border rounded-md focus:outline-none"
                onChange={(e) =>
                  setEditedUser({ ...editedUser, lastname: e.target.value })
                }
              />
            </div>
            {errors.firstname && (
              <p className="text-red-500 text-sm">{errors.firstname.message}</p>
            )}
            {errors.lastname && (
              <p className="text-red-500 text-sm">{errors.lastname.message}</p>
            )}

            {/* Phone Number */}
            <input
              {...register("phonenumber", {
                required: "Phone number is required.",
              })}
              placeholder="Phone Number"
              type="tel"
              defaultValue={editedUser.phonenumber}
              className="w-full p-2 border rounded-md focus:outline-none"
              onChange={(e) =>
                setEditedUser({ ...editedUser, phonenumber: e.target.value })
              }
            />

            {/* Email */}
            <input
              {...register("email", { required: "Email is required." })}
              placeholder="Email"
              type="email"
              defaultValue={editedUser.email}
              className="w-full p-2 border rounded-md focus:outline-none"
              onChange={(e) =>
                setEditedUser({ ...editedUser, email: e.target.value })
              }
            />

            {/* Password */}
            <div className="relative mb-4">
              <input
                {...register("password")}
                placeholder="New Password (optional)"
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border rounded-md focus:outline-none"
                onChange={(e) =>
                  setEditedUser({ ...editedUser, password: e.target.value })
                }
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
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
    </div>
  );
}

export default Editusermodal;
