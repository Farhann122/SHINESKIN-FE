import React, { useState } from "react";

import { AiOutlineKey, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import axiosInstance from "../../ax";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [imageProfile, setImageProfile] = useState(null); // Separate state for file upload
  const [message, setMessage] = useState(""); // To display success/error messages

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageProfile(file); // Set the file directly
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Prepare form data for submission
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("confirmPassword", formData.confirmPassword);
    data.append("role", formData.role);
    if (imageProfile) {
      data.append("imageProfile", imageProfile);
    }

    try {
      // Send data to backend
      const response = await axiosInstance.post("/api/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message); // Display success message
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="w-full min-h-screen bg-cover bg-center bg-[url('https://img.freepik.com/free-photo/elements-relaxing-massage-spa_23-2148176935.jpg?t=st=1730713570~exp=1730717170~hmac=909ac2f5fe863292ff688b6d80cafc48fd9a0c0843f1308f7e37ac728b931a8c&w=1380')]">
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <div className="w-[900px] h-[600px] bg-white flex justify-center items-center rounded-lg shadow-xl">
          <div className="w-[500px] h-full bg-blue-600 flex justify-center items-center rounded-l-lg">
            <img
              src="https://img.freepik.com/free-photo/medium-shot-korean-woman-posing-with-face-cream_23-2150171941.jpg?t=st=1730713328~exp=1730716928~hmac=f40479ac9ddbfe47ec138e6e2c92358d9109fa5c44ad00330e3843a8091c752a&w=740"
              alt=""
              className="w-full h-full"
            />
          </div>
          <div className="w-[500px] h-full bg-white rounded-r-lg font-poppins">
            <div className="flex flex-col items-center justify-center py-4 gap-4 select-none">
              <h1 className="text-4xl text-gray-800 font-pacifico">
                Register
              </h1>
              <p className="text-gray-600 text-sm font-light">Create your account.</p>
            </div>
            <form className="space-y-4 px-8" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border-b border-black focus:border-black outline-none py-2 pr-10"
                  required
                />
                <AiOutlineUser className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b border-black focus:border-black outline-none py-2"
                  required
                />
                <AiOutlineMail className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-b border-black focus:border-black outline-none py-2"
                  required
                />
                <AiOutlineKey className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border-b mb-4 border-black focus:border-black outline-none py-2"
                  required
                />
                <AiOutlineKey className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* File Upload Field */}
              <div className="relative">
                <input
                  type="file"
                  name="imageProfile"
                  onChange={handleFileChange}
                  className="w-full border-b mb-4 border-black focus:border-black outline-none py-2"
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="relative flex">
                <select
                  name="role"
                  id="role"
                  className="border-b border-black py-2 px-4"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-white py-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 h-11 rounded-lg shadow-lg duration-500"
              >
                Register
              </button>
              <div className="flex font-poppins justify-center text-xs ">
                <h1>Already have an account?</h1>

                <Link
                  to="/"
                  className="text-blue-600 hover:text-blue-800 transition ml-1"
                >
                  Sign In
                </Link>
              </div>
            </form>

            {/* Message Display */}
            {message && (
              <p className="text-center mt-2 text-red-500">{message}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegistrationForm;
