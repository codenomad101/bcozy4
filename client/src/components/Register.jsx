/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
const Register = ({ setMessage, setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const API_URL = "http://localhost:5000";

  const register = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
        role,
      });
      localStorage.setItem("token", response.data.token);
      setMessage("Registration successful");
      setIsLoggedIn(true);
    } catch (error) {
      setMessage("Registration failed");
    }
  };

  return (
    <div>
      <form>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button onClick={register}>Register</button>
        {/* <button onClick={login}>Login</button> */}
      </form>
    </div>
  );
};

export default Register;
