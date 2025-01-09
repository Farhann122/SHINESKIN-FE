import React, { useState } from "react";
import { AiOutlineKey, AiOutlineMail } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../ax";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fungsi Menangani Login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Mengirim Request Post Ke API Untuk Login
      const response = await axiosInstance.post("/api/login", {
        email,
        password,
      });

      // Jika login berhasil, simpan token dan role ke localStorage
      const { token, role } = response.data; // Asumsi backend mengirim token dan role

      if (token) {
        localStorage.setItem("token", token); // Menyimpan token JWT
        localStorage.setItem("role", role); // Menyimpan role
        localStorage.setItem("email", email);

        // Navigasi berdasarkan role
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "user") {
          navigate("/dashboard");
        }
      }

      // Menyimpan Pesan Dari Server
      setMessage(response.data.message);
      console.log("Login Success", response.data);
    } catch (error) {
      // Menangani Error Ketika Request Tidak Berhasil
      setMessage("Email atau Password Salah");
      console.log("Login Error", error);
    }
  };

  return (
    <main className="w-full font-poppins min-h-screen bg-cover bg-center bg-[url('https://img.freepik.com/free-photo/elements-relaxing-massage-spa_23-2148176935.jpg?t=st=1730713570~exp=1730717170~hmac=909ac2f5fe863292ff688b6d80cafc48fd9a0c0843f1308f7e37ac728b931a8c&w=1380')]">
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <div className="w-[900px] h-[600px] bg-white flex justify-center items-center rounded-lg shadow-xl">
          <div className="w-[500px] h-full bg-blue-600 flex justify-center items-center rounded-l-lg">
            <img
              src="https://img.freepik.com/free-photo/medium-shot-korean-woman-posing-with-face-cream_23-2150171941.jpg?t=st=1730713328~exp=1730716928~hmac=f40479ac9ddbfe47ec138e6e2c92358d9109fa5c44ad00330e3843a8091c752a&w=740"
              alt=""
              className="w-full h-full"
            />
          </div>
          <div className="w-[500px] h-full bg-white rounded-r-lg flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center px-10 mb-8 gap-2 select-none text-center">
              <h1 className="text-4xl text-gray-800 font-pacifico">
                Welcome Back!
              </h1>
              <p className="text-gray-600 text-sm font-light">Login to your account.</p>
            </div>
            <form className="space-y-4 px-8 w-full">
              <div className="pt-5">
                <div className="relative w-full">
                  <input
                    type="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email "
                    className="w-full border-b border-black focus:border-black outline-none py-2"
                    required
                  />
                  <AiOutlineMail className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="relative w-full pt-4">
                  <input
                    type="password"
                    name="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border-b mb-4 border-black focus:border-black outline-none py-2"
                    required
                  />
                  <AiOutlineKey className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex font-poppins pb-4 text-xs">
                  <h1 className="select-none">Don't have an account yet?</h1>
                  <Link
                    to="/registrasi"
                    className="text-blue-600 hover:text-blue-800 transition ml-1"
                  >
                    Sign Up
                  </Link>
                </div>
                <button
                  onClick={handleLogin}
                  type="submit"
                  className="w-full bg-black text-white py-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 rounded-lg h-11 shadow-lg duration-500"
                >
                  Login
                </button>
              </div>
            </form>
            {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginForm;
