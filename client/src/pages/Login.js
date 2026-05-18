import { useState } from "react";
import API from "../services/api";

function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

    console.log(email);
console.log(password);

  try {
    const res = await API.post(
      "/auth/login",
      {
        email,
        password,
      }
    );
    console.log(res.data);

    if (
      !res.data ||
      !res.data.user ||
      !res.data.token
    ) {
      alert("Invalid login");

      return;
    }

    localStorage.setItem(
      "token",
      res.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(
        res.data.user
      )
    );

    window.location.href =
      "/dashboard";
  } catch (error) {
    console.log(error);

    alert(
      error?.response?.data?.message ||
      "Login Failed"
    );
  }
};

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background:
          "linear-gradient(to right, #4facfe, #00f2fe)",
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          width: "400px",
          borderRadius: "15px",
        }}
      >
        <h2 className="text-center mb-4 text-primary">
          Team Task Manager
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Login
          </button>

          <button
            type="button"
            className="btn btn-outline-dark w-100 mt-3"
            onClick={() =>
              (window.location.href =
                "/register")
            }
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;