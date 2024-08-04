/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
const Login = ({ setMessage, setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = "http://localhost:5000";

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setMessage("Login successful");
      setIsLoggedIn(true);
    } catch (error) {
      setMessage("Login failed");
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </form>
    </div>
  );
};

export default Login;
