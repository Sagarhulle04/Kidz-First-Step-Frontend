import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../services/axiosConfig";
import { loggedInUser } from "../store/user";
import { toast } from "react-toastify";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Loading Profile...</p>
      </div>
    );
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error("Name is required");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("gender", gender);
      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put("/updateProfile", formData);
      toast.success(res.data.message || "Profile updated successfully!");
      dispatch(loggedInUser(res.data.updateUser));
      setIsEditing(false);
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-40"></div>
        <div className="px-6 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-20 mb-6 space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              src={user.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt={user.name}
              className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md bg-gray-100"
            />
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500 capitalize">{user.role} Account</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => {
                  setName(user.name);
                  setGender(user.gender);
                  setIsEditing(true);
                }}
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-blue-700 transition cursor-pointer"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6 mt-4">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Edit Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="edit-gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="edit-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image (optional)
                  </label>
                  <input
                    id="edit-image"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFile(null);
                  }}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 mt-4">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-400 font-medium">Email Address</p>
                  <p className="text-base font-semibold text-gray-800 mt-1">{user.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-400 font-medium">Gender</p>
                  <p className="text-base font-semibold text-gray-800 capitalize mt-1">{user.gender || "Not Specified"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-400 font-medium">Account Role</p>
                  <p className="text-base font-semibold text-gray-800 capitalize mt-1">{user.role}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-400 font-medium">Joined On</p>
                  <p className="text-base font-semibold text-gray-800 mt-1">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
