import { useState } from "react";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("Member");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registration Successful");

      window.location.href = "/";
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div
      style={{
        width: "300px",
        margin: "100px auto",
      }}
    >
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br />
        <br />

        <select
          onChange={(e) =>
            setRole(e.target.value)
          }
        >
          <option>Member</option>
          <option>Admin</option>
        </select>

        <br />
        <br />

        <button type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;